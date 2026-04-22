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
    <div className="flex flex-col gap-3 h-full rounded-3xl bg-card p-5 md:p-7 ring-1 ring-foreground/[0.06] shadow-[var(--shadow-paper)]">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border-0 shadow-none focus-visible:ring-0 px-0 font-display text-[28px] md:text-[34px] tracking-[-0.025em] h-auto font-medium"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={tagId} onValueChange={(v) => v && setTagId(v)}>
          <SelectTrigger className="h-8 w-auto text-xs rounded-full bg-muted/60 border-0">
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
          <span className="text-[11px] text-muted-foreground tabular-nums min-w-[3ch]">
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
          className="flex-1 min-h-[50vh] md:min-h-[55vh] resize-none border-0 shadow-none focus-visible:ring-0 px-0 font-mono text-[13px] leading-[1.7]"
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
    <div className="inline-flex items-center rounded-full bg-muted p-0.5 text-xs">
      <button
        onClick={() => onChange('write')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors inline-flex items-center gap-1',
          view === 'write'
            ? 'bg-card text-foreground shadow-[var(--shadow-paper)] ring-1 ring-foreground/[0.06]'
            : 'text-muted-foreground',
        )}
      >
        <Pencil className="size-3" />
        Write
      </button>
      <button
        onClick={() => onChange('preview')}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors inline-flex items-center gap-1',
          view === 'preview'
            ? 'bg-card text-foreground shadow-[var(--shadow-paper)] ring-1 ring-foreground/[0.06]'
            : 'text-muted-foreground',
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
  h1: (props) => <h1 className="font-display text-[1.75rem] tracking-[-0.02em] mt-5 mb-2 font-medium" {...props} />,
  h2: (props) => <h2 className="font-display text-[1.4rem] tracking-[-0.02em] mt-5 mb-2 font-medium" {...props} />,
  h3: (props) => <h3 className="font-display text-[1.15rem] tracking-[-0.015em] mt-4 mb-1.5 font-medium" {...props} />,
  p: (props) => <p className="my-2.5 leading-[1.7] text-[14px]" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 my-2.5 text-[14px] space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 my-2.5 text-[14px] space-y-1" {...props} />,
  li: (props) => <li className="leading-[1.7]" {...props} />,
  code: ({ className, children, ...rest }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <pre className="rounded-xl bg-muted/70 p-3.5 overflow-x-auto text-[12px] my-3 leading-relaxed">
          <code className={className} {...rest}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 text-[0.86em] font-mono"
        {...rest}
      >
        {children}
      </code>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="my-3 rounded-xl bg-muted/50 px-4 py-2.5 text-muted-foreground italic text-[14px] leading-[1.7]"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-primary underline underline-offset-[3px] decoration-primary/30 hover:decoration-primary transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  hr: () => <hr className="my-5 border-border" />,
  table: (props) => (
    <div className="overflow-x-auto my-3 rounded-lg ring-1 ring-border">
      <table className="w-full text-[13px] border-collapse" {...props} />
    </div>
  ),
  th: (props) => <th className="text-left bg-muted/50 px-3 py-2 font-medium" {...props} />,
  td: (props) => <td className="border-t border-border px-3 py-2" {...props} />,
};
