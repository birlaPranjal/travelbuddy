/**
 * Utility function to upload an image to Cloudinary
 * @param file File to upload
 * @param folder Optional folder path in Cloudinary
 * @returns Promise with upload result
 */
export const uploadImageToCloudinary = async (file: File, folder: string = 'itineraries'): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      imageUrl: data.imageUrl
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image'
    };
  }
};

/**
 * Utility function to upload multiple images to Cloudinary
 * @param files Files to upload
 * @param folder Optional folder path in Cloudinary
 * @returns Promise with upload results
 */
export const uploadMultipleImages = async (files: File[], folder: string = 'itineraries'): Promise<{ success: boolean; imageUrls?: string[]; error?: string }> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    
    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      throw new Error(`Failed to upload ${failedUploads.length} out of ${files.length} images`);
    }
    
    const imageUrls = results.map(result => result.imageUrl as string);
    
    return {
      success: true,
      imageUrls
    };
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images'
    };
  }
}; 