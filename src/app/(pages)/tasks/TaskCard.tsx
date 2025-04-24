"use client";

import { FC, useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Spinner } from '@/app/components/Spinner';
import { triggerConfetti } from '@/app/lib/utils';
import { Toast } from '@/app/components/Toast';

type Task = {
  id: string;
  title: string;
  description: string;
  imageRequired: boolean;
};

type TaskCardProps = {
  task: Task;
  onComplete?: (taskId: string) => void;
};

export const TaskCard: FC<TaskCardProps> = ({ task, onComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nftUrl, setNftUrl] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Check if task is already completed from localStorage
  useEffect(() => {
    const checkCompletedTask = () => {
      if (typeof window !== 'undefined') {
        try {
          const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]') as string[];
          if (completedTasks.includes(task.id)) {
            setIsCompleted(true);
          }
        } catch (error) {
          console.error('Error checking completed tasks:', error);
        }
      }
    };

    checkCompletedTask();
  }, [task.id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('taskId', task.id);

      // Send to the API endpoint
      const response = await axios.post('/api/complete-task', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Save to localStorage
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]') as string[];
      if (!completedTasks.includes(task.id)) {
        completedTasks.push(task.id);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      }

      setIsCompleted(true);
      setNftUrl(response.data.nftUrl);
      
      // Show success toast and trigger confetti
      setShowSuccessToast(true);
      triggerConfetti();
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(task.id);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Border animation class when completed
  const cardBorderClass = isCompleted 
    ? 'border-2 border-green-500 animate-pulse' 
    : 'border border-gray-700';

  return (
    <>
      <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-500 ${cardBorderClass}`}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
          <p className="text-gray-300 mb-4">{task.description}</p>

          {isCompleted ? (
            <div className="text-center">
              <div className="relative">
                <div className="bg-green-100 text-green-800 rounded-md p-3 mb-4">
                  <div className="flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 mr-2 text-green-600 animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Task completed! NFT has been minted to your wallet.</span>
                  </div>
                </div>
              </div>
              {nftUrl && (
                <a 
                  href={nftUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  View your NFT
                </a>
              )}
            </div>
          ) : (
            <>
              {previewUrl && (
                <div className="mb-4 relative h-48 w-full">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    className="rounded-md object-cover"
                    fill
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-300 mt-1
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-500
                      cursor-pointer"
                  />
                </label>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isUploading || !selectedFile}
                className={`w-full py-2 px-4 rounded-md transition ${
                  isUploading || !selectedFile
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                } text-white font-medium`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" color="white" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <Toast 
        message="🎉 NFT Minted Successfully!" 
        type="success" 
        isVisible={showSuccessToast} 
        onClose={() => setShowSuccessToast(false)} 
      />
    </>
  );
}; 