import { Appointment } from './types';

/**
 * Format a Date to UTC string for Google Calendar and iCal (YYYYMMDDTHHmmssZ)
 */
function formatToCalUtc(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}

/**
 * Generate Google Calendar TEMPLATE web link
 */
export function getGoogleCalendarUrl(appt: Appointment): string {
  const start = new Date(appt.scheduled_at);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration default

  const dates = `${formatToCalUtc(start)}/${formatToCalUtc(end)}`;
  const title = encodeURIComponent(`${appt.title} - ${appt.doctor_name}`);
  const details = encodeURIComponent(
    `Doctor: ${appt.doctor_name}\nClinic: ${appt.clinic_address}\nNotes: ${appt.notes || 'None'}\nHelper: ${
      appt.helper_name || 'Family'
    }\nCoordinated via Softly Care`
  );
  const location = encodeURIComponent(appt.clinic_address);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generate standard RFC 5545 .ics iCalendar file content
 */
export function generateIcsContent(appt: Appointment): string {
  const start = new Date(appt.scheduled_at);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Softly//Elderly Care Coordinator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:appt-${appt.id}@softlycare.local`,
    `DTSTAMP:${formatToCalUtc(new Date())}`,
    `DTSTART:${formatToCalUtc(start)}`,
    `DTEND:${formatToCalUtc(end)}`,
    `SUMMARY:${appt.title} - ${appt.doctor_name}`,
    `DESCRIPTION:${appt.notes || 'Doctor Appointment'} (Helper: ${appt.helper_name || 'N/A'})`,
    `LOCATION:${appt.clinic_address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
