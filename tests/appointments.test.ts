import { memoryDataRepository } from '../lib/data-repository';
import { getGoogleCalendarUrl, generateIcsContent } from '../lib/calendar';

describe('Appointments & Calendar Sync', () => {
  it('creates an appointment in the repository', async () => {
    const appt = await memoryDataRepository.addAppointment({
      family_id: 'fam-sharma',
      title: 'Orthopedic Knee Scan',
      doctor_name: 'Dr. Rajesh Sharma',
      clinic_address: 'Apex Hospital, Jaipur',
      scheduled_at: '2026-10-15T10:30:00.000Z',
      helper_name: 'Ramesh Kumar',
      status: 'scheduled',
      notes: 'Bring previous X-rays',
    });

    expect(appt.id).toBeDefined();
    expect(appt.title).toBe('Orthopedic Knee Scan');
  });

  it('generates a valid Google Calendar URL', () => {
    const mockAppt = {
      id: 'appt-test',
      family_id: 'fam-sharma',
      title: 'Dental Checkup',
      doctor_name: 'Dr. Verma',
      clinic_address: 'City Dental Clinic',
      scheduled_at: '2026-10-15T10:30:00.000Z',
      status: 'scheduled' as const,
    };

    const url = getGoogleCalendarUrl(mockAppt);
    expect(url).toContain('calendar.google.com/calendar/render');
    expect(url).toContain('Dental%20Checkup');
    expect(url).toContain('City%20Dental%20Clinic');
  });

  it('generates standard .ics content', () => {
    const mockAppt = {
      id: 'appt-test-2',
      family_id: 'fam-sharma',
      title: 'Eye Test',
      doctor_name: 'Dr. Kapoor',
      clinic_address: 'Vision Eye Care',
      scheduled_at: '2026-10-15T14:00:00.000Z',
      status: 'scheduled' as const,
    };

    const ics = generateIcsContent(mockAppt);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Eye Test - Dr. Kapoor');
    expect(ics).toContain('LOCATION:Vision Eye Care');
    expect(ics).toContain('END:VCALENDAR');
  });
});
