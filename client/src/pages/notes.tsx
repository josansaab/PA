import { AppLayout } from "@/components/layout/app-layout";
import { PenLine } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNote, updateNote } from "@/lib/api";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Notes() {
  const queryClient = useQueryClient();
  const { data: note } = useQuery({
    queryKey: ["note"],
    queryFn: getNote,
  });

  const [content, setContent] = useState("");
  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const updateNoteMutation = useMutation({
    mutationFn: (newContent: string) => updateNote(newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  useEffect(() => {
    if (debouncedContent !== undefined && debouncedContent !== note?.content) {
      updateNoteMutation.mutate(debouncedContent);
    }
  }, [debouncedContent]);

  return (
    <AppLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Notes</h1>
          <div className="text-sm text-slate-500">
            {updateNoteMutation.isPending ? "Saving..." : "Auto-saved"}
          </div>
        </div>

        <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-slate-400">
             <PenLine className="h-4 w-4" />
             <span className="text-sm">Rich Text Editor</span>
          </div>
          <textarea 
            className="flex-1 w-full h-full bg-transparent p-6 resize-none focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed"
            placeholder="Start typing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>
    </AppLayout>
  );
}
