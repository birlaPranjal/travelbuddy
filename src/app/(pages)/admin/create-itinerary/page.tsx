"use client";

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createItinerary, ItineraryData } from '@/app/model/Itinerary';
import { uploadMultipleImages } from '@/app/lib/cloudinary';
import { PageTransition } from '@/app/components/PageTransition';
import { Spinner } from '@/app/components/Spinner';

const CreateItineraryPage: FC = () => {
  const [formData, setFormData] = useState<Omit<ItineraryData, 'images' | 'createdBy'>>({
    title: '',
    description: '',
    duration: 1,
    price: 0,
    location: '',
    highlights: [''],
    inclusions: [''],
    exclusions: [''],
    isPublished: false,
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'price' ? parseFloat(value) : parseInt(value);
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleArrayInputChange = (index: number, field: 'highlights' | 'inclusions' | 'exclusions', value: string) => {
    setFormData(prev => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayItem = (field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'highlights' | 'inclusions' | 'exclusions') => {
    setFormData(prev => {
      const updatedArray = [...prev[field]];
      updatedArray.splice(index, 1);
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      setImages(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (images.length === 0) {
        throw new Error('Please select at least one image');
      }
      
      // Upload images to Cloudinary
      let imageUrls: string[] = [];
      try {
        const uploadResult = await uploadMultipleImages(images);
        if (!uploadResult.success || !uploadResult.imageUrls) {
          throw new Error(uploadResult.error || 'Failed to upload images');
        }
        imageUrls = uploadResult.imageUrls;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new Error(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }

      // Create itinerary with uploaded image URLs
      const result = await createItinerary({
        ...formData,
        images: imageUrls,
        createdBy: 'admin', // hardcoded for simplicity
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create itinerary');
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Error creating itinerary:', err);
      setError(err instanceof Error ? err.message : 'Failed to create itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Create New Itinerary</h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Back to Dashboard
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg mb-8">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-gray-300 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleNumberInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-gray-300 mb-2">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleNumberInputChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Images */}
              <div className="mb-6">
                <label htmlFor="images" className="block text-gray-300 mb-2">Images</label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-gray-400 text-sm mt-1">
                  You can select multiple images. The first image will be used as the main image.
                </p>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">Highlights</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded-md"
                  >
                    Add Highlight
                  </button>
                </div>
                
                {formData.highlights.map((highlight, index) => (
                  <div key={`highlight-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayInputChange(index, 'highlights', e.target.value)}
                      className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a highlight"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'highlights')}
                        className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Inclusions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">Inclusions</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('inclusions')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded-md"
                  >
                    Add Inclusion
                  </button>
                </div>
                
                {formData.inclusions.map((inclusion, index) => (
                  <div key={`inclusion-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => handleArrayInputChange(index, 'inclusions', e.target.value)}
                      className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter what's included"
                    />
                    {formData.inclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'inclusions')}
                        className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Exclusions */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-white">Exclusions</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('exclusions')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded-md"
                  >
                    Add Exclusion
                  </button>
                </div>
                
                {formData.exclusions.map((exclusion, index) => (
                  <div key={`exclusion-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={exclusion}
                      onChange={(e) => handleArrayInputChange(index, 'exclusions', e.target.value)}
                      className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter what's not included"
                    />
                    {formData.exclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'exclusions')}
                        className="ml-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-md"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Publish Status */}
              <div className="mb-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="ml-2 text-gray-300">
                    Publish immediately (otherwise saved as draft)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 flex items-center"
                >
                  {loading && <Spinner size="sm" color="white" className="mr-2" />}
                  {loading ? 'Creating...' : 'Create Itinerary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CreateItineraryPage; 