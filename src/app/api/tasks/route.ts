import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Task, TRAVEL_TASKS } from '@/app/model/task';
import connectToDatabase from '@/app/lib/dbConnect';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const tasks = await Task.find({ userId: session.user.email });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await request.json();
    const predefinedTask = TRAVEL_TASKS.find(task => task.taskId === taskId);
    
    if (!predefinedTask) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Check if task already exists for user
    const existingTask = await Task.findOne({ 
      userId: session.user.email, 
      taskId 
    });

    if (existingTask) {
      return NextResponse.json({ error: 'Task already exists' }, { status: 400 });
    }

    const task = new Task({
      userId: session.user.email,
      ...predefinedTask,
      status: 'pending'
    });

    await task.save();
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, status, nftTokenId, metadataUri } = await request.json();
    
    await connectToDatabase();
    const task = await Task.findOne({ 
      userId: session.user.email, 
      taskId 
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      } else if (status === 'verified') {
        task.verifiedAt = new Date();
      }
    }

    if (nftTokenId) task.nftTokenId = nftTokenId;
    if (metadataUri) task.metadataUri = metadataUri;

    await task.save();
    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
} 