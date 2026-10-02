import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET() {
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
      fatherName,
      motherName,
      parentsCity,
      helperName,
      helperPhone,
    } = body;

    if (!familyName || !caregiverName) {
      return NextResponse.json(
        { success: false, error: 'Family name and Caregiver name are required' },
        { status: 400 }
      );
    }

    const result = await memoryDataRepository.registerFamily({
      familyName,
      caregiverName,
      caregiverPhone,
      caregiverCity,
      fatherName,
      motherName,
      parentsCity,
      helperName,
      helperPhone,
    });

    return NextResponse.json(
      {
        success: true,
        family: result.family,
        members: result.members,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
