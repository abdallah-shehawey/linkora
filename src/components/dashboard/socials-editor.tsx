"use client";

import { useState, useMemo } from "react";
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
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEditor } from "./editor-context";
import { SOCIALS, SOCIAL_PLATFORMS, extractWhatsAppNumber } from "@/components/social-icons";
import type { SocialLink, SocialPlatform } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Each social row needs a stable ID for dnd-kit. We derive one from
 *  the platform name + its index so it stays unique even when the same
 *  platform is added multiple times. */
function socialDndId(s: SocialLink, index: number) {
  return `social-${s.platform}-${index}`;
}

function SocialRow({
  s,
  index,
  dndId,
}: {
  s: SocialLink;
  index: number;
  dndId: string;
}) {
  const { updateSocial, removeSocial } = useEditor();
  const meta = SOCIALS[s.platform];
  const Icon = meta.Icon;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dndId });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-2.5 transition-shadow",
        isDragging && "z-10 shadow-2xl shadow-black/50 ring-1 ring-brand-400/40",
      )}
    >
      <button
        className="cursor-grab touch-none text-white/25 transition-colors hover:text-white/60 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/80">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <Input
          value={s.label ?? ""}
          onChange={(e) => updateSocial(index, { label: e.target.value })}
          placeholder={
            s.platform === "whatsapp"
              ? "Display name (optional)"
              : `Account name (e.g. shown as "${meta.label}")`
          }
          className="h-8 border-0 bg-transparent px-1 text-sm focus:ring-0"
          spellCheck={false}
        />
        <Input
          value={s.url}
          onChange={(e) => {
            let val = e.target.value;
            // WhatsApp: if user pastes a wa.me / whatsapp.com link,
            // auto-extract the number and warn them.
            if (s.platform === "whatsapp" && /wa\.me|whatsapp\.com/i.test(val)) {
              const num = extractWhatsAppNumber(val);
              if (num) {
                val = num;
                toast.info("Just the phone number! We'll build the link for you.", {
                  duration: 3000,
                });
              }
            }
            updateSocial(index, { url: val });
          }}
          placeholder={meta.placeholder}
          className="h-8 border-0 bg-transparent px-1 text-xs text-white/60 focus:ring-0"
          autoCapitalize="none"
          inputMode={s.platform === "whatsapp" ? "tel" : undefined}
          spellCheck={false}
        />
      </div>
      <button
        onClick={() => removeSocial(index)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-red-500/10 hover:text-red-400"
        aria-label={`Remove ${meta.label}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SocialsEditor() {
  const { profile, addSocial, setSocials } = useEditor();
  const [picking, setPicking] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const dndIds = useMemo(
    () => profile.socials.map((s, i) => socialDndId(s, i)),
    [profile.socials],
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = dndIds.indexOf(active.id as string);
    const newIndex = dndIds.indexOf(over.id as string);
    if (oldIndex < 0 || newIndex < 0) return;
    setSocials(arrayMove(profile.socials, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3">
      {profile.socials.length === 0 ? null : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={dndIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {profile.socials.map((s, i) => (
                <SocialRow
                  key={dndIds[i]}
                  s={s}
                  index={i}
                  dndId={dndIds[i]}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="relative">
        <button
          onClick={() => setPicking((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/12 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Add account
        </button>
        {picking && (
          <div className="glass-strong absolute inset-x-0 top-full z-20 mt-1 rounded-xl p-2">
            <div className="grid grid-cols-4 gap-1">
              {SOCIAL_PLATFORMS.map((p) => {
                const meta = SOCIALS[p as SocialPlatform];
                const Icon = meta.Icon;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      addSocial(p as SocialPlatform);
                      setPicking(false);
                    }}
                    className="flex flex-col items-center gap-1 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px]">{meta.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 px-1 text-center text-[10px] text-white/35">
              You can add the same platform more than once.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
