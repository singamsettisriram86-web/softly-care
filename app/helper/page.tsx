import React from 'react';
import HelperDailyChecklist from '@/components/helper/HelperDailyChecklist';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function HelperPage({
  searchParams,
}: {
  searchParams?: { pin?: string };
}) {
  const pin = searchParams?.pin || 'CARE-7892';

  return (
    <div className="min-h-screen bg-softly-bg text-softly-text pb-16">
      {/* Top Mobile Nav Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Living Room</span>
        </Link>

        <span className="text-xs font-bold text-stone-800">
          Mobile Helper Portal
        </span>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-softly-coral hover:text-[#e08983] underline"
        >
          Caregiver Hub
        </Link>
      </header>

      <main>
        <HelperDailyChecklist pin={pin} />
      </main>
    </div>
  );
}
