// GitHub integration for pushing code to repository
import { Octokit } from '@octokit/rest'

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

// Create repo and get info
async function main() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Authenticated as: ${user.login}`);
    
    // Try to create the repo
    const repoName = 'personal-smart-dashboard';
    try {
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'Personal Smart Dashboard - Tasks, Bills, Subscriptions, Car Maintenance, Kids Events, Groceries, and Unifi Protect Cameras',
        private: false,
        auto_init: false
      });
      console.log(`Repository created: ${repo.html_url}`);
      console.log(`Clone URL: ${repo.clone_url}`);
    } catch (e: any) {
      if (e.status === 422) {
        console.log(`Repository already exists: https://github.com/${user.login}/${repoName}`);
      } else {
        throw e;
      }
    }
    
    console.log(`\nGitHub username: ${user.login}`);
    console.log(`Repository: ${repoName}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
