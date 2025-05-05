import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ITask, TRAVEL_TASKS } from '@/app/model/task';
import { mintNFT } from '@/app/lib/contract';
import { uploadToIPFS } from '@/app/lib/ipfs';
import { ethers } from 'ethers';

interface Task extends ITask {
  _id: string;
}

export default function TaskManager() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const mintTaskNFT = async (task: Task) => {
    try {
      if (!session?.user?.email) {
        throw new Error('User not authenticated');
      }

      const metadata = {
        name: task.title,
        description: task.description,
        image: 'ipfs://Qm...', // Replace with your IPFS image hash
        attributes: [
          {
            trait_type: 'Category',
            value: task.category,
          },
          {
            trait_type: 'Status',
            value: task.status,
          },
        ],
      };

      const metadataUri = await uploadToIPFS(metadata);
      
      // Mock the provider since we don't have access to it in this example
      const mockProvider = { } as ethers.BrowserProvider;
      const result = await mintNFT(mockProvider, session.user.email, metadataUri, task.taskId);

      if (result.success) {
        await fetch('/api/tasks', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: task.taskId,
            nftTokenId: result.tokenId,
            metadataUri,
          }),
        });

        await fetchTasks();
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRAVEL_TASKS.map((predefinedTask) => (
          <div
            key={predefinedTask.taskId}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{predefinedTask.title}</h3>
            <p className="text-sm text-gray-600">{predefinedTask.description}</p>
            <button
              onClick={() => addTask(predefinedTask.taskId)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Task
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Tasks</h2>
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
              </div>
              <div className="space-x-2">
                {task.status === 'pending' && (
                  <button
                    onClick={() => updateTaskStatus(task.taskId, 'completed')}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Complete
                  </button>
                )}
                {task.status === 'completed' && !task.nftTokenId && (
                  <button
                    onClick={() => mintTaskNFT(task)}
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Mint NFT
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 