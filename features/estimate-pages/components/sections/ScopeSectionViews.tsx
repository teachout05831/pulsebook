"use client";

import { useState } from "react";
import type { SectionProps } from "./sectionProps";

export type LineItem = { description: string; quantity: number; unitPrice: number; total: number };

export function ChecklistView({ items, pc }: { items: LineItem[]; pc: string }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item, i) => (
        <li key={`${item.description}-${i}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={i % 2 === 0 ? { background: `${pc}08` } : undefined}>
          <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${pc}18`, color: pc }}>&#10003;</span>
          <div>
            <p className="font-medium text-gray-800">{item.description}</p>
            {item.quantity > 1 && <p className="text-sm text-gray-500">Qty: {item.quantity}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function NarrativeView({ narrative, items }: { narrative: string | null; items: LineItem[] }) {
  const text = narrative || items.map((item) => item.description).join(". ");
  const display = text && !text.endsWith(".") ? `${text}.` : text;
  return (
    <div className="prose prose-gray max-w-none">
      <p className="text-base text-gray-700 leading-7 whitespace-pre-line">{display}</p>
    </div>
  );
}

export function DetailedView({ items, estimate, primaryColor }: {
  items: LineItem[]; estimate: NonNullable<SectionProps["estimate"]>; primaryColor: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left">
            <th className="py-3 pr-4 text-xs uppercase tracking-wider font-semibold text-gray-500">Description</th>
            <th className="py-3 px-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-center">Qty</th>
            <th className="py-3 px-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-right">Rate</th>
            <th className="py-3 pl-4 text-xs uppercase tracking-wider font-semibold text-gray-500 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.description}-${i}`} className={i % 2 === 1 ? "bg-gray-50/60" : ""}>
              <td className="py-3 pr-4 text-gray-900">{item.description}</td>
              <td className="py-3 px-4 text-gray-600 text-center">{item.quantity}</td>
              <td className="py-3 px-4 text-gray-600 text-right">${item.unitPrice.toFixed(2)}</td>
              <td className="py-3 pl-4 text-gray-900 font-medium text-right">${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200">
            <td colSpan={3} className="py-3 pr-4 text-right font-medium text-gray-600">Subtotal</td>
            <td className="py-3 pl-4 text-right font-medium text-gray-900">${estimate.subtotal.toFixed(2)}</td>
          </tr>
          {estimate.taxAmount > 0 && (
            <tr>
              <td colSpan={3} className="py-1 pr-4 text-right text-sm text-gray-500">Tax ({estimate.taxRate}%)</td>
              <td className="py-1 pl-4 text-right text-sm text-gray-600">${estimate.taxAmount.toFixed(2)}</td>
            </tr>
          )}
          <tr className="rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
            <td colSpan={3} className="py-3 pr-4 text-right font-bold text-gray-900 text-base">Total</td>
            <td className="py-3 pl-4 text-right font-bold text-gray-900 text-base">${estimate.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function RoomChecklistView({ items, pc }: { items: LineItem[]; pc: string }) {
  const rooms = Object.values(items.reduce<Record<string, { room: string; items: { name: string; qty: number }[] }>>((acc, item) => {
    const p = item.description.split(" - ");
    const room = p.length > 1 ? p[0].trim() : "General";
    const name = p.length > 1 ? p.slice(1).join(" - ").trim() : item.description;
    (acc[room] ??= { room, items: [] }).items.push({ name, qty: item.quantity });
    return acc;
  }, {}));
  const [exp, setExp] = useState<Record<string, boolean>>(() => Object.fromEntries(rooms.map((r) => [r.room, true])));
  const chevron = (open: boolean) => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={`text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}><path d="M6 4l4 4-4 4"/></svg>;
  return (
    <div className="space-y-3">
      {rooms.map(({ room, items: ri }) => (
        <div key={room} className="border rounded-lg overflow-hidden">
          <button type="button" onClick={() => setExp((p) => ({ ...p, [room]: !p[room] }))} className="w-full bg-gray-50 px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-gray-900">{room}</span>
            <span className="flex items-center gap-2">
              <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 font-medium">{ri.length}</span>
              {chevron(!!exp[room])}
            </span>
          </button>
          {exp[room] && <ul className="px-4 py-2 space-y-1">{ri.map((item, i) => (
            <li key={`${item.name}-${i}`} className="flex items-center gap-3 rounded-lg px-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${pc}18`, color: pc }}>&#10003;</span>
              <div><p className="font-medium text-gray-800">{item.name}</p>{item.qty > 1 && <p className="text-sm text-gray-500">Qty: {item.qty}</p>}</div>
            </li>
          ))}</ul>}
        </div>
      ))}
    </div>
  );
}
