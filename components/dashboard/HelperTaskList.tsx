'use client';

import React, { useState } from 'react';
import { HelperTask } from '@/lib/types';
import { CheckCircle2, Circle, IndianRupee, Plus, Calendar, User } from 'lucide-react';

interface Props {
  tasks: HelperTask[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onAddTask: (title: string, description?: string) => Promise<void>;
  onOpenPayModal: (helperName: string) => void;
}

export default function HelperTaskList({
  tasks,
  onToggleTask,
  onAddTask,
  onOpenPayModal,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onAddTask(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setShowAddForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-soft">
      {/* Header with Title and Pay Helper CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block mb-0.5">
            Local Coordination
          </span>
          <h2 className="text-xl font-bold text-softly-text tracking-tight">
            Helper Tasks & Compensation
          </h2>
          <p className="text-xs text-softly-muted mt-0.5">
            Tasks assigned to trusted local helper (Ramesh Kumar, Jaipur).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Cashfree Pay Helper Button */}
          <button
            type="button"
            onClick={() => onOpenPayModal('Ramesh Kumar')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-95 text-softly-text text-xs font-semibold shadow-soft transition-all"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Pay Helper (Cashfree)</span>
          </button>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-200"
        >
          <input
            type="text"
            required
            placeholder="e.g. Pick up blood pressure medicines from Apollo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-softly-coral"
          />
          <input
            type="text"
            placeholder="Details or notes (e.g. 2 strips Metformin, show prescription card #8821)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-softly-coral"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-full text-stone-500 text-xs hover:bg-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-full bg-softly-text text-white text-xs font-semibold hover:bg-stone-800"
            >
              {loading ? 'Saving...' : 'Add Task'}
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
              task.completed
                ? 'bg-stone-50/80 border-stone-200 opacity-60'
                : 'bg-white border-stone-200/90 shadow-xs'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggleTask(task.id, !task.completed)}
              className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors flex-shrink-0"
              title={task.completed ? 'Mark incomplete' : 'Mark completed'}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Circle className="w-5 h-5 text-stone-300" />
              )}
            </button>

            <div className="flex-1">
              <h4
                className={`text-sm font-semibold tracking-tight ${
                  task.completed ? 'line-through text-stone-400' : 'text-stone-800'
                }`}
              >
                {task.title}
              </h4>

              {task.description && (
                <p className="text-xs text-softly-muted mt-1 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex items-center gap-3 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-stone-400" />
                  {task.assigned_to}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  Due Today
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
