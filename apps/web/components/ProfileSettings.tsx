"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/dashboard";
import { Button, Modal } from "@/components/ui";

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
      <button
        onClick={() => setOpen(true)}
        className="text-[13px] text-steel underline transition-colors duration-200 hover:text-ember"
      >
        Edit profile
      </button>
    );
  }

  const label = "mb-1 block text-[13px] text-steel";
  return (
    <Modal label="Edit profile" onClose={() => setOpen(false)}>
      <h2 className="font-display text-[19px] font-light tracking-[-0.02em] text-graphite">
        Edit profile
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="ps-name">Name</label>
          <input id="ps-name" className="input-quiet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="ps-target">Exam target</label>
          <input id="ps-target" className="input-quiet" value={form.examTarget} onChange={(e) => setForm({ ...form, examTarget: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="ps-start">Start date</label>
          <input id="ps-start" type="date" className="input-quiet" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="ps-end">Target date</label>
          <input id="ps-end" type="date" className="input-quiet" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="ps-min">Daily minutes</label>
          <input id="ps-min" type="number" min={1} className="input-quiet" value={form.dailyStudyMinutes} onChange={(e) => setForm({ ...form, dailyStudyMinutes: e.target.value })} />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
