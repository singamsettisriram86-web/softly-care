'use client';

import React from 'react';
import { Appointment } from '@/lib/types';
import { getGoogleCalendarUrl, generateIcsContent } from '@/lib/calendar';
import { Calendar, MapPin, User, ExternalLink, Download } from 'lucide-react';

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Props) {
  const dateObj = new Date(appointment.scheduled_at);
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownloadIcs = () => {
    const icsData = generateIcsContent(appointment);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment-${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gCalUrl = getGoogleCalendarUrl(appointment);

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft hover:shadow-floating transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block mb-0.5">
              Doctor Consultation
            </span>
            <h3 className="font-bold text-lg text-softly-text tracking-tight">
              {appointment.title}
            </h3>
            <p className="text-sm font-semibold text-stone-700">{appointment.doctor_name}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {appointment.for_member_name && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-softly-coral/15 text-softly-coral font-semibold border border-softly-coral/25">
                For: {appointment.for_member_name}
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded-full bg-softly-lavender text-stone-700 font-medium">
              {appointment.status}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 my-3 text-xs text-softly-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-medium text-stone-800">
              {formattedDate} at {formattedTime}
            </span>
          </div>

          {appointment.clinic_address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{appointment.clinic_address}</span>
            </div>
          )}

          {appointment.helper_name && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>Accompanying Helper: <strong>{appointment.helper_name}</strong></span>
            </div>
          )}
        </div>

        {appointment.notes && (
          <p className="text-xs text-stone-600 bg-stone-50 rounded-2xl p-2.5 border border-stone-100 mb-3">
            <strong>Notes:</strong> {appointment.notes}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Calendar Sync
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Google Calendar Link */}
          <a
            href={gCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Calendar</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Download ICS */}
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors shadow-2xs"
            title="Download .ics for Apple Calendar, Outlook, or phone calendar"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Apple / .ics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
