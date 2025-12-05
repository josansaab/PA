// GitHub integration for pushing code to repository
import { Octokit } from '@octokit/rest'
import * as fs from 'fs';
import * as path from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Get all files recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = [], basePath: string = dirPath): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    // Skip node_modules, .git, dist, and other build artifacts
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.cache' || file === 'attached_assets') {
      return;
    }
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, basePath);
    } else {
      arrayOfFiles.push(path.relative(basePath, fullPath));
    }
  });

  return arrayOfFiles;
}

async function main() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    const owner = user.login;
    const repo = 'PA';
    const branch = 'main';
    const basePath = '/home/runner/workspace';
    
    // Check if repo exists
    try {
      await octokit.repos.get({ owner, repo });
      console.log(`Using existing repository: ${repo}`);
    } catch (e) {
      console.error(`Repository ${repo} not found`);
      return;
    }
    
    // Get all files
    const files = getAllFiles(basePath);
    console.log(`Found ${files.length} files to upload`);
    
    // Get or create the branch reference
    let sha: string | undefined;
    try {
      const { data: ref } = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
      sha = ref.object.sha;
    } catch (e) {
      // Branch doesn't exist, we'll create it
    }
    
    // Create blobs for each file
    const tree: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
    
    for (const filePath of files) {
      const fullPath = path.join(basePath, filePath);
      const content = fs.readFileSync(fullPath);
      const base64Content = content.toString('base64');
      
      try {
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: base64Content,
          encoding: 'base64'
        });
        
        tree.push({
          path: filePath,
          mode: '100644',
          type: 'blob',
          sha: blob.sha
        });
        
        process.stdout.write('.');
      } catch (e) {
        console.error(`\nFailed to upload ${filePath}:`, e);
      }
    }
    
    console.log(`\nCreating tree with ${tree.length} files...`);
    
    // Create tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: sha
    });
    
    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message: 'Personal Smart Dashboard - Full codebase',
      tree: newTree.sha,
      parents: sha ? [sha] : []
    });
    
    // Update or create branch reference
    try {
      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commit.sha,
        force: true
      });
    } catch (e) {
      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: commit.sha
      });
    }
    
    console.log(`\nCode pushed successfully!`);
    console.log(`Repository: https://github.com/${owner}/${repo}`);
    console.log(`\nCurl command for your VPS:`);
    console.log(`curl -L https://github.com/${owner}/${repo}/archive/${branch}.tar.gz | tar xz && cd ${repo}-${branch} && chmod +x install.sh && ./install.sh`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
