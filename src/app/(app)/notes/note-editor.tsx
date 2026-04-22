'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Trash2, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateNote } from '@/lib/hooks/use-notes';
import type { Note, Tag } from '@/lib/supabase/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function NoteEditor({
  note,
  tags,
  onDelete,
}: {
  note: Note;
  tags: Tag[];
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [tagId, setTagId] = useState(note.tag_id ?? 'none');
  const [view, setView] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const update = useUpdateNote();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const dirty =
      title !== note.title ||
      body !== note.body ||
      (tagId === 'none' ? null : tagId) !== note.tag_id;
    if (!dirty) return;
    setSaving('saving');
    debounceRef.current = setTimeout(() => {
      update.mutate(
        {
          id: note.id,
          patch: {
            title,
            body,
            tag_id: tagId === 'none' ? null : tagId,
          },
        },
        {
          onSuccess: () => {
            setSaving('saved');
            setTimeout(() => setSaving('idle'), 1500);
          },
        },
      );
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, tagId, note.id]);

  return (
    <div className="flex flex-col gap-3 h-full rounded-2xl border border-border/60 bg-card p-4 md:p-6">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border-0 shadow-none focus-visible:ring-0 px-0 font-serif text-2xl md:text-3xl h-auto"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={tagId} onValueChange={(v) => v && setTagId(v)}>
          <SelectTrigger className="h-8 w-auto text-xs rounded-full">
            <SelectValue placeholder="No tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No tag</SelectItem>
            {tags.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {saving === 'saving'
              ? 'Saving…'
              : saving === 'saved'
                ? 'Saved'
                : ''}
          </span>
          <ViewToggle view={view} onChange={setView} />
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete note"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {view === 'write' ? (
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Dump it out. Markdown welcome."
          className="flex-1 min-h-[50vh] md:min-h-[55vh] resize-none border-0 shadow-none focus-visible:ring-0 px-0 font-mono text-sm leading-relaxed"
        />
      ) : (
        <div className="flex-1 min-h-[50vh] md:min-h-[55vh] prose-content overflow-y-auto">
          {body.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {body}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: 'write' | 'preview';
  onChange: (v: 'write' | 'preview') => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border/60 p-0.5 text-xs">
      <button
        onClick={() => onChange('write')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors inline-flex items-center gap-1',
          view === 'write' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        <Pencil className="size-3" />
        Write
      </button>
      <button
        onClick={() => onChange('preview')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors inline-flex items-center gap-1',
          view === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        <Eye className="size-3" />
        Preview
      </button>
    </div>
  );
}

/* Minimal prose styles via components — avoids pulling in @tailwindcss/typography. */
const markdownComponents: Parameters<typeof ReactMarkdown>[0]['components'] = {
  h1: (props) => <h1 className="font-serif text-2xl mt-4 mb-2" {...props} />,
  h2: (props) => <h2 className="font-serif text-xl mt-4 mb-2" {...props} />,
  h3: (props) => <h3 className="font-serif text-lg mt-3 mb-1" {...props} />,
  p: (props) => <p className="my-2 leading-relaxed text-sm" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 my-2 text-sm" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 my-2 text-sm" {...props} />,
  li: (props) => <li className="my-1" {...props} />,
  code: ({ className, children, ...rest }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre className="rounded-lg bg-muted p-3 overflow-x-auto text-xs my-3">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono"
        {...rest}
      >
        {children}
      </code>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-primary/50 pl-3 my-3 italic text-muted-foreground text-sm"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-primary underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  hr: () => <hr className="my-4 border-border/60" />,
  table: (props) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props) => <th className="text-left border-b border-border px-2 py-1" {...props} />,
  td: (props) => <td className="border-b border-border/60 px-2 py-1" {...props} />,
};
