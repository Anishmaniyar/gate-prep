"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/dashboard";

function isoDay(dt: string): string {
  return new Date(dt).toISOString().slice(0, 10);
}

export function ProfileSettings({ profile, onSaved }: { profile: DashboardData["profile"]; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile.name,
    examTarget: profile.examTarget,
    startDate: isoDay(profile.startDate),
    targetDate: isoDay(profile.targetDate),
    dailyStudyMinutes: String(profile.dailyStudyMinutes),
  });

  const save = async () => {
    setSaving(true);
    await api.put("/profile", {
      name: form.name.trim() || profile.name,
      examTarget: form.examTarget.trim() || profile.examTarget,
      startDate: new Date(form.startDate + "T00:00:00.000Z").toISOString(),
      targetDate: new Date(form.targetDate + "T00:00:00.000Z").toISOString(),
      dailyStudyMinutes: Math.max(1, Number(form.dailyStudyMinutes) || profile.dailyStudyMinutes),
    });
    setSaving(false);
    setOpen(false);
    onSaved();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-neutral-500 underline">
        Edit profile
      </button>
    );
  }

  const field = "w-full bg-black border border-neutral-800 rounded px-2 py-1.5 text-sm text-neutral-200";
  const label = "block text-xs text-neutral-500 mb-1";
  return (
    <div className="mt-3 border border-neutral-800 rounded p-3 bg-neutral-950 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={label} htmlFor="ps-name">Name</label>
        <input id="ps-name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className={label} htmlFor="ps-target">Exam target</label>
        <input id="ps-target" className={field} value={form.examTarget} onChange={(e) => setForm({ ...form, examTarget: e.target.value })} />
      </div>
      <div>
        <label className={label} htmlFor="ps-start">Start date</label>
        <input id="ps-start" type="date" className={field} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
      </div>
      <div>
        <label className={label} htmlFor="ps-end">Target date</label>
        <input id="ps-end" type="date" className={field} value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
      </div>
      <div>
        <label className={label} htmlFor="ps-min">Daily minutes</label>
        <input id="ps-min" type="number" min={1} className={field} value={form.dailyStudyMinutes} onChange={(e) => setForm({ ...form, dailyStudyMinutes: e.target.value })} />
      </div>
      <div className="flex items-end gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="border border-neutral-600 rounded px-3 py-1.5 text-sm text-neutral-100 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-neutral-500">
          Cancel
        </button>
      </div>
    </div>
  );
}
