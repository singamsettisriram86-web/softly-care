import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  if (!familyId) {
    return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
  }
  const tasks = await memoryDataRepository.getTasks(familyId);
  return NextResponse.json({ success: true, tasks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      family_id,
      title,
      description,
      due_date,
      assigned_to = 'Local Helper',
      for_member_id,
      for_member_name,
    } = body;
    if (!family_id) {
      return NextResponse.json({ success: false, error: 'family_id is required' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Task title is required' },
        { status: 400 }
      );
    }

    const newTask = await memoryDataRepository.addTask({
      family_id,
      title,
      description,
      due_date: due_date || new Date().toISOString(),
      completed: false,
      assigned_to,
      for_member_id,
      for_member_name,
    });

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, completed } = body;

    if (!taskId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'taskId and completed boolean are required' },
        { status: 400 }
      );
    }

    const updated = await memoryDataRepository.updateTaskStatus(taskId, completed);
    return NextResponse.json({ success: true, task: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
