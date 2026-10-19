'use client';

import React from 'react';
import { ShieldCheck, MapPin, Briefcase, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';

interface Props {
  helper: HelperMarketplaceProfile;
  onViewDetails: (helper: HelperMarketplaceProfile) => void;
  onConnect: (helper: HelperMarketplaceProfile) => void;
}

export default function HelperCard({ helper, onViewDetails, onConnect }: Props) {
  const isLiveIn = helper.helper_type === 'live_in';
  const isVisiting = helper.helper_type === 'visiting';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 text-stone-800 flex items-center justify-center text-lg font-bold shrink-0">
              {helper.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-stone-900 text-base leading-tight">
                  {helper.name}
                </h3>
                {helper.is_verified && (
                  <span title="Verified Caregiver" className="inline-flex items-center text-emerald-600">
                    <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-0.5 text-stone-600 font-medium">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {helper.base_city}
                </span>
                <span>•</span>
                <span className="font-semibold text-stone-700">
                  {helper.experience_years}+ Yrs Exp
                </span>
              </p>
            </div>
          </div>

          {/* Availability pill */}
          <div>
            {helper.is_available ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-medium">
                <span>Employed</span>
              </span>
            )}
          </div>
        </div>

        {/* Arrangement & Service Cities */}
        <div className="mb-3.5 flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isLiveIn 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : isVisiting 
              ? 'bg-blue-50 border-blue-200 text-blue-900' 
              : 'bg-purple-50 border-purple-200 text-purple-900'
          }`}>
            {isLiveIn ? '🏠 Live-in Caregiver' : isVisiting ? '🚗 Visiting Helper' : '🤝 Live-in / Visiting'}
          </span>

          {helper.service_cities && helper.service_cities.length > 1 && (
            <span className="text-[11px] text-stone-500 truncate max-w-[200px]" title={helper.service_cities.join(', ')}>
              Serves: {helper.service_cities.slice(0, 3).join(', ')}{helper.service_cities.length > 3 ? ` +${helper.service_cities.length - 3}` : ''}
            </span>
          )}
        </div>

        {/* Top Skills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {(helper.skills || []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200/60"
            >
              {skill}
            </span>
          ))}
          {(helper.skills || []).length > 3 && (
            <span className="text-[11px] font-medium text-stone-400 self-center">
              +{(helper.skills || []).length - 3} more
            </span>
          )}
        </div>

        {/* Languages */}
        {helper.languages && helper.languages.length > 0 && (
          <p className="text-[11px] text-stone-400 mb-4">
            Languages: <span className="text-stone-600 font-medium">{helper.languages.join(', ')}</span>
          </p>
        )}
      </div>

      {/* Footer: Rate + Action Buttons */}
      <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
            Expected Pay
          </span>
          <span className="text-sm font-bold text-stone-900">
            {helper.expected_salary || (helper.daily_rate ? `${helper.daily_rate}/day` : '₹15,000/mo')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(helper)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-colors"
          >
            Details
          </button>

          <button
            type="button"
            onClick={() => onConnect(helper)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:opacity-90 active:scale-95 flex items-center gap-1.5"
            style={{ background: '#FFB7B2', color: '#292524' }}
          >
            <Phone className="w-3 h-3" />
            <span>Connect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
