"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Sparkles,
  Link2,
  Plus,
  ChevronDown,
  Smile,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditor } from "./editor-context";
import type { LinkItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMOJIS = ["✦", "🎨", "▶️", "🎁", "✉️", "🛒", "📅", "🎧", "📷", "💬", "🔥", "⭐"];

function LinkRow({ link }: { link: LinkItem }) {
  const { updateLink, removeLink } = useEditor();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition-shadow",
        isDragging && "z-10 shadow-2xl shadow-black/50 ring-1 ring-brand-400/40",
        !link.active && "opacity-60",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-2 cursor-grab touch-none text-white/25 transition-colors hover:text-white/60 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={link.title}
            onChange={(e) => updateLink(link.id, { title: e.target.value })}
            placeholder="Link title (e.g. My YouTube)"
            className="h-10 font-medium"
          />
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
              placeholder="https://…"
              className="h-10 pl-10 text-white/80"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <IconToggle
              active={!!link.highlight}
              onClick={() => updateLink(link.id, { highlight: !link.highlight })}
              title="Highlight this link"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Highlight
            </IconToggle>

            <div className="relative">
              <IconToggle
                active={!!link.emoji}
                onClick={() => setEmojiOpen((v) => !v)}
                title="Add an emoji"
              >
                <Smile className="h-3.5 w-3.5" />
                {link.emoji || "Emoji"}
              </IconToggle>
              {emojiOpen && (
                <div className="glass-strong absolute left-0 top-full z-20 mt-1 grid w-48 grid-cols-6 gap-1 rounded-xl p-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateLink(link.id, { emoji: undefined });
                      setEmojiOpen(false);
                    }}
                    className="col-span-6 rounded-md py-1 text-xs text-white/50 hover:bg-white/5"
                  >
                    Clear
                  </button>
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        updateLink(link.id, { emoji: e });
                        setEmojiOpen(false);
                      }}
                      className="rounded-md py-1 text-lg hover:bg-white/10"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2.5">
              <Switch
                checked={link.active}
                onChange={(v) => updateLink(link.id, { active: v })}
              />
              <button
                onClick={() => removeLink(link.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconToggle({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand-400/40 bg-brand-500/15 text-brand-200"
          : "border-white/10 text-white/50 hover:bg-white/5 hover:text-white/80",
      )}
    >
      {children}
    </button>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand-500" : "bg-white/12",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}

export function LinksEditor() {
  const { profile, setLinks, addLink } = useEditor();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = profile.links.findIndex((l) => l.id === active.id);
    const newIndex = profile.links.findIndex((l) => l.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setLinks(arrayMove(profile.links, oldIndex, newIndex));
  };

  return (
    <div className="space-y-4">
      <Button onClick={addLink} className="w-full" size="md">
        <Plus className="h-4 w-4" />
        Add link
      </Button>

      {profile.links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/12 py-12 text-center">
          <Link2 className="mx-auto h-8 w-8 text-white/25" />
          <p className="mt-3 text-sm text-white/50">
            No links yet. Add your first one above.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={profile.links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {profile.links.map((link) => (
                <LinkRow key={link.id} link={link} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {profile.links.length > 3 && (
        <button
          onClick={addLink}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/8 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white/80"
        >
          <ChevronDown className="h-4 w-4" />
          Add another link
        </button>
      )}
    </div>
  );
}
