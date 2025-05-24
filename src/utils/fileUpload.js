/**
 * File upload utility for Cloudinary integration
 */

// Import Cloudinary configuration
import { uploadImage } from './cloudinary';

/**
 * Create a URL for a file preview
 * @param {File} file - The file to create a preview for
 * @returns {string} The preview URL
 */
export const createFilePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to avoid memory leaks
 * @param {string} previewUrl - The preview URL to revoke
 */
export const revokeFilePreview = (previewUrl) => {
  URL.revokeObjectURL(previewUrl);
};

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<string[]>} - Array of URLs for the uploaded files
 */
export const uploadFiles = async (files) => {
  try {
    // Use Promise.all to upload all files in parallel
    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
