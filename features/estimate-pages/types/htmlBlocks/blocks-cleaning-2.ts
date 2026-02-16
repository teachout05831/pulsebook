import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_2: HtmlBlock[] = [
  // ─── Room Card (Expandable) ───────────────────────────────────
  {
    id: "cleaning-room-card",
    name: "Room Card with Checklist",
    category: "cleaning",
    description: "Expandable room card with emoji, name, and task checklist",
    variables: ["roomEmoji", "roomName", "roomMeta", "task1", "task2", "task3", "task4"],
    html: `<div class="cl-c">
  <details class="cl-room" open>
    <summary class="cl-room-header">
      <div class="cl-room-left">
        <div class="cl-room-emoji">{{roomEmoji}}</div>
        <div>
          <div class="cl-room-name">{{roomName}}</div>
          <div class="cl-room-meta">{{roomMeta}}</div>
        </div>
      </div>
      <span class="cl-room-arrow">▾</span>
    </summary>
    <ul class="cl-room-checklist">
      <li><span class="cl-check">✓</span> {{task1}}</li>
      <li><span class="cl-check">✓</span> {{task2}}</li>
      <li><span class="cl-check">✓</span> {{task3}}</li>
      <li><span class="cl-check">✓</span> {{task4}}</li>
    </ul>
  </details>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-room {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #e7e5e4;
  margin-bottom: 16px;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.2s;
}
:scope .cl-room:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}
:scope .cl-room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  cursor: pointer;
  user-select: none;
  list-style: none;
}
:scope .cl-room-header::-webkit-details-marker {
  display: none;
}
:scope .cl-room-header::marker {
  display: none;
  content: '';
}
:scope .cl-room-header:hover {
  background: #fafaf9;
}
:scope .cl-room-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
:scope .cl-room-emoji {
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--primary-color, #10b981) 10%, white);
  border-radius: 10px;
}
:scope .cl-room-name {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-weight: 600;
  font-size: 1.05rem;
  color: #292524;
}
:scope .cl-room-meta {
  font-size: 0.82rem;
  color: #a8a29e;
  margin-top: 2px;
}
:scope .cl-room-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #78716c;
  transition: transform 0.3s, background 0.3s;
}
:scope .cl-room[open] .cl-room-arrow {
  transform: rotate(180deg);
  background: color-mix(in srgb, var(--primary-color, #10b981) 20%, white);
}
:scope .cl-room-checklist {
  padding: 0 22px 20px;
  list-style: none;
  margin: 0;
}
:scope .cl-room-checklist li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f4;
  font-size: 0.95rem;
  color: #57534e;
}
:scope .cl-room-checklist li:last-child {
  border-bottom: none;
}
:scope .cl-check {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--primary-color, #10b981);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.8rem;
  font-weight: 700;
}`,
  },
];
