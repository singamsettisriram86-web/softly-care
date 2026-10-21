'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import FloatingNav from '@/components/landing/FloatingNav';

const SKILL_OPTIONS = [
  'Bedridden Patient Care',
  'Vitals / BP Check',
  'Mobility & Walking',
  'Diabetic Diet & Soft Cooking',
  'Dementia & Alzheimer Care',
  'Post-Surgery Bedside Care',
  'Doctor Clinic Accompaniment',
  'Bathing & Personal Hygiene',
  'Catheter & Urine Bag Care',
];

const LANGUAGE_OPTIONS = ['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada', 'Marathi', 'Bengali'];

export default function RegisterHelperPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other' | ''>('');
  const [age, setAge] = useState<string>('');
  const [baseCity, setBaseCity] = useState('');
  const [serviceCitiesInput, setServiceCitiesInput] = useState('');
  const [helperType, setHelperType] = useState<'live_in' | 'visiting' | 'both' | ''>('');
  const [experienceYears, setExperienceYears] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [expectedSalary, setExpectedSalary] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [bio, setBio] = useState('');
  const [upiId, setUpiId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Authentication check: users must sign up or log in to register as a helper
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login?next=/helpers/register&tab=signup');
          return;
        }
        if (data.user?.name && !name) {
          setName(data.user.name);
        }
      } catch (_) {}
    })();
  }, [router]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !baseCity.trim()) {
      setError('Please provide your name, phone number, and current city.');
      return;
    }

    if (!helperType) {
      setError('Please select a work arrangement (Live-in Care, Visiting Only, or Open to Both).');
      return;
    }

    if (selectedSkills.length === 0) {
      setError('Please select at least one care skill you can provide.');
      return;
    }

    setLoading(true);
    setError('');

    // Parse service cities
    const serviceCities = serviceCitiesInput
      ? serviceCitiesInput.split(',').map((c) => c.trim()).filter(Boolean)
      : [baseCity.trim()];
    if (!serviceCities.includes(baseCity.trim())) {
      serviceCities.unshift(baseCity.trim());
    }

    try {
      const res = await fetch('/api/marketplace/helpers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          whatsapp: (whatsapp || phone).trim(),
          gender: gender || 'Female',
          age: age ? Number(age) : 35,
          base_city: baseCity.trim(),
          service_cities: serviceCities,
          helper_type: helperType,
          experience_years: experienceYears ? Number(experienceYears) : 0,
          skills: selectedSkills,
          languages: selectedLanguages.length > 0 ? selectedLanguages : ['Telugu'],
          expected_salary: expectedSalary.trim() || undefined,
          daily_rate: dailyRate.trim() || undefined,
          bio: bio.trim() || undefined,
          upi_id: upiId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Registration failed');

      // Save ID to localStorage for helper dashboard
      if (typeof window !== 'undefined' && data.helper?.id) {
        localStorage.setItem('softly_marketplace_helper_id', data.helper.id);
      }

      router.push('/helpers/profile');
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/helpers/browse"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Helpers Directory</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>JOIN OUR CAREGIVER NETWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            Register as an Elderly Care Assistant
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
            Create your profile to get discovered by verified families seeking elderly caregivers for their parents in your city or across India.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              1. Personal Details
            </span>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (Calling) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98480 22338"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="Same as mobile if empty"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Age</label>
                <input
                  type="number"
                  min="18"
                  max="70"
                  placeholder="e.g. 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Living Type & Service Locations */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              2. Living Arrangement & Cities
            </span>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Work Arrangement Preference *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setHelperType('live_in')}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    helperType === 'live_in'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🏠</span>
                  <span className="text-xs block">Live-in Care</span>
                  <span className="text-[9px] text-emerald-700 block">Stays with parents</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHelperType('visiting')}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    helperType === 'visiting'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🚗</span>
                  <span className="text-xs block">Visiting Only</span>
                  <span className="text-[9px] text-blue-700 block">Day shifts & chores</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHelperType('both')}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    helperType === 'both'
                      ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🤝</span>
                  <span className="text-xs block">Open to Both</span>
                  <span className="text-[9px] text-purple-700 block">Flexible</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Primary Base City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amalapuram, Hyderabad"
                  value={baseCity}
                  onChange={(e) => setBaseCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  placeholder="e.g. 3"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Other Cities You Can Serve (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Kakinada, Rajahmundry, Hyderabad, Visakhapatnam"
                value={serviceCitiesInput}
                onChange={(e) => setServiceCitiesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Families searching for helpers in these cities will be able to see your profile.
              </p>
            </div>
          </div>

          {/* Section 3: Care Skills & Languages */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              3. Specialized Skills & Languages
            </span>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Select Your Care Skills:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SKILL_OPTIONS.map((skill) => {
                  const checked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left border flex items-center justify-between transition-all ${
                        checked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span>{skill}</span>
                      {checked && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Languages You Speak:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const checked = selectedLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        checked
                          ? 'border-stone-900 bg-stone-900 text-white shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Pay & Bio */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              4. Expected Pay & Bio
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Monthly Salary
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹15,000 / month"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Daily Rate
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹600 / day"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                UPI ID (for payments)
              </label>
              <input
                type="text"
                placeholder="e.g. 9848022338@paytm or name@okaxis"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tell Families About Your Care Experience
              </label>
              <textarea
                rows={3}
                placeholder="Describe past eldercare work, special cases (e.g. stroke, wheelchair transfers), and your patient approach..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: '#FFB7B2', color: '#292524' }}
            >
              <span>{loading ? 'Creating Profile...' : 'Publish Helper Profile to Directory'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2.5">
              By registering, you agree to receive direct calls and WhatsApp inquiries from verified families on Softly.
            </p>
          </div>
        </form>

        {/* Caregiver Registration FAQs */}
        <div id="faq" className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24">
          <div className="text-center mb-6">
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Caregiver FAQs
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900">
              Frequently Asked Questions for Helpers
            </h3>
          </div>

          <div className="space-y-3 max-w-xl mx-auto text-left text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-bold text-stone-900 mb-1">💰 Does Softly take any agency cut from my salary?</h4>
              <p className="text-stone-600 leading-relaxed">
                Zero commission. You receive 100% of your earnings directly from the family via UPI or cash.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-bold text-stone-900 mb-1">📱 How do families contact me after I register?</h4>
              <p className="text-stone-600 leading-relaxed">
                Families browsing helpers in your city unlock your phone and WhatsApp numbers to call or message you directly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-bold text-stone-900 mb-1">🔄 What if I find a job and don’t want calls?</h4>
              <p className="text-stone-600 leading-relaxed">
                Simply log into your Caregiver Work Portal (/helpers/profile) and tap &quot;Set as Employed&quot;. Your profile will be instantly hidden from search.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <h4 className="font-bold text-stone-900 mb-1">🏠 What is the difference between Live-in and Visiting?</h4>
              <p className="text-stone-600 leading-relaxed">
                Live-in caregivers stay with the senior 24x7 (free room &amp; meals provided, avg ₹16,000–₹25,000/mo). Visiting attendants visit for 4 to 8 hours daily (avg ₹8,000–₹15,000/mo).
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
