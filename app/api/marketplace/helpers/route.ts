import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const helper = await memoryDataRepository.getMarketplaceHelperById(id);
      if (!helper) {
        return NextResponse.json({ success: false, error: 'Helper profile not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, helper });
    }

    const city = searchParams.get('city') || undefined;
    const helper_type = searchParams.get('helper_type') || undefined;
    const skill = searchParams.get('skill') || undefined;
    const available_only = searchParams.get('available_only') === 'true';
    const search = searchParams.get('search') || undefined;

    const helpers = await memoryDataRepository.getMarketplaceHelpers({
      city,
      helper_type,
      skill,
      available_only,
      search,
    });

    return NextResponse.json({ success: true, helpers });
  } catch (error: any) {
    console.error('[API Marketplace Helpers GET Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      whatsapp,
      gender,
      age,
      base_city,
      service_cities,
      helper_type,
      experience_years,
      skills,
      languages,
      expected_salary,
      daily_rate,
      bio,
      upi_id,
      availability_note,
    } = body;

    if (!name || !phone || !base_city) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and primary city are required.' },
        { status: 400 }
      );
    }

    const newHelper = await memoryDataRepository.createMarketplaceHelper({
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp || phone).trim(),
      gender: gender || 'Female',
      age: age ? Number(age) : 35,
      base_city: base_city.trim(),
      service_cities: Array.isArray(service_cities) && service_cities.length > 0 
        ? service_cities.map((c: string) => c.trim()) 
        : [base_city.trim()],
      helper_type: helper_type || 'visiting',
      experience_years: experience_years ? Number(experience_years) : 1,
      skills: Array.isArray(skills) ? skills : ['Senior Companionship', 'Mobility Assistance'],
      languages: Array.isArray(languages) ? languages : ['Telugu', 'Hindi'],
      expected_salary: expected_salary?.trim() || '₹14,000 / month',
      daily_rate: daily_rate?.trim() || '₹500 / day',
      bio: bio?.trim() || 'Dedicated, compassionate caregiver trained in elderly care and daily routine assistance.',
      upi_id: upi_id?.trim() || undefined,
      is_verified: true,
      is_available: true,
      availability_note: availability_note?.trim() || 'Available immediately',
    });

    return NextResponse.json({ success: true, helper: newHelper }, { status: 201 });
  } catch (error: any) {
    console.error('[API Marketplace Helpers POST Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Helper profile id is required.' }, { status: 400 });
    }

    const updated = await memoryDataRepository.updateMarketplaceHelper(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update helper profile.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, helper: updated });
  } catch (error: any) {
    console.error('[API Marketplace Helpers PATCH Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Helper profile id required.' }, { status: 400 });
    }

    const deleted = await memoryDataRepository.deleteMarketplaceHelper(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete helper profile.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Helper profile deleted successfully.' });
  } catch (error: any) {
    console.error('[API Marketplace Helpers DELETE Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
