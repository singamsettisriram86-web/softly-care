'use client';

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';

interface Props {
  isOpen: boolean;
  helper: HelperMarketplaceProfile | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteHelperConfirmModal({ isOpen, helper, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !helper) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/marketplace/helpers?id=${helper.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete profile.');
      }

      // Clear local storage if this was the saved helper
      if (typeof window !== 'undefined') {
        localStorage.removeItem('softly_marketplace_helper_id');
      }

      onDeleted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting profile. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 relative p-6 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={deleting}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-900">Delete Helper Profile?</h3>
          <p className="text-xs text-stone-500 mt-1">
            Are you sure you want to permanently delete your caregiver profile for{' '}
            <strong className="text-stone-800">{helper.name}</strong>?
          </p>
        </div>

        <div className="bg-red-50/80 rounded-2xl p-4 text-left text-xs text-red-800 border border-red-200/80 space-y-1.5">
          <p className="font-bold">This action cannot be undone:</p>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-red-700">
            <li>Your listing will be removed from marketplace search</li>
            <li>Families will no longer be able to call or message you</li>
            <li>All lead inquiries and contact history will be cleared</li>
          </ul>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-800 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="w-1/2 py-2.5 rounded-full border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-1/2 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
          >
            {deleting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
