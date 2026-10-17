import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  const pin = searchParams.get('pin');
  const checkMine = searchParams.get('check') === 'mine';

  // Check if the currently logged-in user already has a registered family
  if (checkMine) {
    try {
      const userCookie = req.cookies.get('softly_user')?.value;
      if (!userCookie) {
        return NextResponse.json({ success: true, family: null, hasFamily: false });
      }
      const user = JSON.parse(userCookie);
      const family = await memoryDataRepository.getUserFamily({
        id: user.id,
        name: user.name,
        email: user.email || user.identifier,
      });
      return NextResponse.json({ success: true, family: family || null, hasFamily: !!family });
    } catch {
      return NextResponse.json({ success: true, family: null, hasFamily: false });
    }
  }

  if (pin) {
    const family = await memoryDataRepository.findFamilyByCode(pin);
    if (!family) {
      return NextResponse.json({ success: false, error: 'Family space not found for this PIN' }, { status: 404 });
    }
    const members = await memoryDataRepository.getMembers(family.id);
    return NextResponse.json({ success: true, family, members });
  }

  if (familyId) {
    const members = await memoryDataRepository.getMembers(familyId);
    const family = await memoryDataRepository.getFamily(familyId);
    return NextResponse.json({ success: true, family, members });
  }
  const families = await memoryDataRepository.getAllFamilies();
  return NextResponse.json({ success: true, families });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      familyName,
      caregiverName,
      caregiverPhone,
      caregiverCity,
      careMembers,       // new: array of { relation, name, city }
      helperName,
      helperPhone,
      helperUpi,
      helperType,        // 'live_in' | 'visiting'
    } = body;

    if (!familyName || !caregiverName) {
      return NextResponse.json(
        { success: false, error: 'Family name and Caregiver name are required' },
        { status: 400 }
      );
    }

    // Read logged-in user to link the family to this caregiver account
    let userId: string | undefined;
    try {
      const userCookie = req.cookies.get('softly_user')?.value;
      if (userCookie) {
        const user = JSON.parse(userCookie);
        userId = user.id;
      }
    } catch { /* ignore */ }

    const result = await memoryDataRepository.registerFamily({
      familyName,
      caregiverName,
      caregiverPhone,
      caregiverCity,
      userId,
      careMembers: careMembers || [],
      helperName,
      helperPhone,
      helperUpi,
      helperType: helperType || 'visiting',
    });

    return NextResponse.json(
      { success: true, family: result.family, members: result.members },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/families — either add a new member (action:'add') or update existing (action:'update')
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'add', familyId, memberId, relation, name, city, phone, upi_id, role, helper_type } = body;

    if (action === 'update') {
      // Update an existing member
      if (!memberId) {
        return NextResponse.json({ success: false, error: 'memberId is required' }, { status: 400 });
      }
      const updated = await memoryDataRepository.updateMember(memberId, {
        name: name !== undefined ? name.trim() : undefined,
        relation: relation !== undefined ? relation.trim() : undefined,
        city: city !== undefined ? city.trim() : undefined,
        phone: phone !== undefined ? phone.trim() : undefined,
        upi_id: upi_id !== undefined ? upi_id.trim() : undefined,
        helper_type: helper_type !== undefined ? helper_type : undefined,
      });
      return NextResponse.json({ success: true, member: updated });
    }

    // Default action: 'add' — add a new care member or helper
    if (!familyId || !name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'familyId and name are required' },
        { status: 400 }
      );
    }
    const member = await memoryDataRepository.addCareMember({
      familyId,
      relation: (relation || 'Elder').trim(),
      name: name.trim(),
      city: (city || '').trim(),
      phone: (phone || '').trim(),
      role: role || (relation === 'Helper' ? 'helper' : 'elder'),
      helper_type: helper_type || 'visiting',
    });
    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/families?memberId=xxx — delete a family member
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');
    if (!memberId) {
      return NextResponse.json({ success: false, error: 'memberId query param is required' }, { status: 400 });
    }
    await memoryDataRepository.deleteMember(memberId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
