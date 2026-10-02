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
          <span className="text-xs px-2.5 py-1 rounded-full bg-softly-lavender text-stone-700 font-medium">
            {appointment.status}
          </span>
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

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        {/* Google Calendar Link */}
        <a
          href={gCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Google Calendar</span>
        </a>

        {/* Download ICS */}
        <button
          type="button"
          onClick={handleDownloadIcs}
          className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save .ics</span>
        </button>
      </div>
    </div>
  );
}
