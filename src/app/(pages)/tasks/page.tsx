"use client";

import { FC, useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { WalletConnect } from '@/app/components/WalletConnect';
import { useWallet } from '@/app/lib/wallet-context';
import { PageTransition } from '@/app/components/PageTransition';

type Task = {
  id: string;
  title: string;
  description: string;
  imageRequired: boolean;
};

const TasksPage: FC = () => {
  const { isConnected } = useWallet();
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Predefined tasks
  const tasks: Task[] = [
    {
      id: 'milestone',
      title: 'Upload Milestone',
      description: 'Take a picture of a milestone you encounter during your journey',
      imageRequired: true,
    },
    {
      id: 'highway',
      title: 'Highway',
      description: 'Capture a photo of a highway sign or a beautiful highway view',
      imageRequired: true,
    },
    {
      id: 'toll-plaza',
      title: 'Toll Plaza',
      description: 'Share a photo of a toll plaza you passed through',
      imageRequired: true,
    },
  ];

  // Load completed tasks from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]') as string[];
        setCompletedTaskIds(completed);
      } catch (error) {
        console.error('Error loading completed tasks:', error);
        setError('Failed to load completed tasks. Please refresh the page.');
      }
    }
  }, []);

  // Handler for when a task is completed
  const handleTaskComplete = (taskId: string) => {
    try {
      setCompletedTaskIds(prev => {
        if (!prev.includes(taskId)) {
          const updated = [...prev, taskId];
          localStorage.setItem('completedTasks', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error saving completed task:', error);
      setError('Failed to save completed task. Please try again.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Travel Tasks</h1>
              <p className="text-gray-300">
                Complete these travel-related tasks to earn unique NFT rewards for your journey!
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <WalletConnect />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {!isConnected ? (
            <div className="bg-blue-900/20 border border-blue-800 text-blue-300 p-4 rounded-lg mb-8">
              <p className="font-medium">
                Please connect your wallet to mint NFTs after completing tasks.
              </p>
            </div>
          ) : (
            <div className="bg-green-900/20 border border-green-800 text-green-300 p-4 rounded-lg mb-8">
              <p className="font-medium">
                Your wallet is connected! You can now earn NFTs by completing tasks.
              </p>
              <p className="text-sm mt-1">
                Completed {completedTaskIds.length} of {tasks.length} tasks
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                onComplete={handleTaskComplete}
                isCompleted={completedTaskIds.includes(task.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TasksPage; 