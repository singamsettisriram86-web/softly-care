'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, Check, Sparkles } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';

interface Props {
  isOpen: boolean;
  helper: HelperMarketplaceProfile | null;
  onClose: () => void;
  onUpdated: (updatedHelper: HelperMarketplaceProfile) => void;
}

const ALL_SKILLS = [
  'Bedridden Patient Care',
  'Vitals / BP Check',
  'Mobility & Walking',
  'Diabetic Diet & Soft Cooking',
  'Dementia & Alzheimer Care',
  'Post-Surgery Bedside Care',
  'Catheter & Urine Bag Care',
  'Bathing & Personal Hygiene',
  'Stroke Recovery Support',
  'Gentle Massage & Physiotherapy',
  'Senior Companionship & Conversation',
  'Doctor Clinic Accompaniment',
];

const ALL_LANGUAGES = ['Telugu', 'Hindi', 'English', 'Kannada', 'Tamil', 'Marathi', 'Malayalam'];

export default function EditHelperProfileModal({ isOpen, helper, onClose, onUpdated }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [age, setAge] = useState<number | string>(35);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [baseCity, setBaseCity] = useState('');
  const [serviceCitiesStr, setServiceCitiesStr] = useState('');
  const [helperType, setHelperType] = useState<'live_in' | 'visiting' | 'both'>('live_in');
  const [experienceYears, setExperienceYears] = useState<number | string>(3);
  const [expectedSalary, setExpectedSalary] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (helper) {
      setName(helper.name || '');
      setPhone(helper.phone || '');
      setWhatsapp(helper.whatsapp || helper.phone || '');
      setAge(helper.age || 35);
      setGender((helper.gender as any) || 'Female');
      setBaseCity(helper.base_city || '');
      setServiceCitiesStr((helper.service_cities || []).join(', '));
      setHelperType((helper.helper_type as any) || 'live_in');
      setExperienceYears(helper.experience_years || 1);
      setExpectedSalary(helper.expected_salary || '');
      setDailyRate(helper.daily_rate || '');
      setBio(helper.bio || '');
      setUpiId(helper.upi_id || '');
      setAvailabilityNote(helper.availability_note || '');
      setSkills(helper.skills || []);
      setLanguages(helper.languages || ['Telugu', 'Hindi']);
      setErrorMsg('');
    }
  }, [helper, isOpen]);

  if (!isOpen || !helper) return null;

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !baseCity.trim()) {
      setErrorMsg('Name, mobile phone, and base city are required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const parsedServiceCities = serviceCitiesStr
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const payload = {
        id: helper.id,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        age: Number(age) || 35,
        gender,
        base_city: baseCity.trim(),
        service_cities: parsedServiceCities.length > 0 ? parsedServiceCities : [baseCity.trim()],
        helper_type: helperType,
        experience_years: Number(experienceYears) || 1,
        expected_salary: expectedSalary.trim() || '₹15,000 / month',
        daily_rate: dailyRate.trim() || '₹600 / day',
        bio: bio.trim(),
        upi_id: upiId.trim() || undefined,
        availability_note: availabilityNote.trim() || 'Available immediately',
        skills,
        languages,
      };

      const res = await fetch('/api/marketplace/helpers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success || !data.helper) {
        throw new Error(data.error || 'Failed to update helper profile.');
      }

      onUpdated(data.helper);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>✏️ Edit Caregiver Profile</span>
            </h3>
            <p className="text-xs text-stone-500">Update your public listing, rates, service cities, and care skills</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-left text-xs">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Basic Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-600 font-bold mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">Gender &amp; Age</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">Phone Number (Calling) *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Defaults to calling phone"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>
          </div>

          {/* Location & Service Cities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-stone-600 font-bold mb-1">Base Hometown / City *</label>
              <input
                type="text"
                value={baseCity}
                onChange={(e) => setBaseCity(e.target.value)}
                required
                placeholder="e.g. Amalapuram, Hyderabad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">All Service Cities (Comma-separated)</label>
              <input
                type="text"
                value={serviceCitiesStr}
                onChange={(e) => setServiceCitiesStr(e.target.value)}
                placeholder="e.g. Amalapuram, Kakinada, Rajahmundry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>
          </div>

          {/* Care Type & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-stone-600 font-bold mb-1">Living Arrangement</label>
              <select
                value={helperType}
                onChange={(e) => setHelperType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              >
                <option value="live_in">🏠 Live-in (24x7)</option>
                <option value="visiting">🚗 Visiting / Day Shifts</option>
                <option value="both">Both Live-in &amp; Visiting</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">Expected Monthly Pay</label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. ₹16,000 / month"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 font-bold mb-1">Daily Rate</label>
              <input
                type="text"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                placeholder="e.g. ₹600 / day"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-bold mb-1">UPI ID for Salary / Direct Pay</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@upi"
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2]"
              />
            </div>
          </div>

          {/* Bio / Summary */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-stone-600 font-bold mb-1">About Your Caregiving Experience</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your care experience, special patient care skills, hygiene routines, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 outline-none focus:ring-2 focus:ring-[#FFB7B2] leading-relaxed"
            />
          </div>

          {/* Skills Checklist */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-stone-600 font-bold mb-2">Caregiver Skills &amp; Specialties</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SKILLS.map((s) => {
                const checked = skills.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'bg-[#FFB7B2] text-stone-900 border-transparent shadow-2xs font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-stone-900" />}
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-stone-600 font-bold mb-2">Languages Spoken</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_LANGUAGES.map((l) => {
                const checked = languages.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'bg-stone-900 text-white border-transparent'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 text-white" />}
                    <span>{l}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 border-t border-stone-100 flex items-center justify-end gap-3 z-10">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 font-semibold hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full font-bold text-stone-900 shadow-soft transition-all flex items-center gap-1.5"
              style={{ background: '#FFB7B2' }}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-800" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-stone-800" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
