import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { propertyFormSchema } from '../utils/validationSchema';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {  uploadFiles } from '../utils/fileUpload';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import './PropertyListingForm.css';

const PropertyListingForm = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationTab, setLocationTab] = useState('LIST'); // LIST or CURRENT_LOCATION
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  
  const propertyTypeOptions = [
    { value: 'Flats / Apartments', label: 'Flats / Apartments' },
    { value: 'Independent / Builder Floors', label: 'Independent / Builder Floors' },
    { value: 'Farm House', label: 'Farm House' },
    { value: 'House & Villa', label: 'House & Villa' }
  ];
  
  const bhkOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '4+', label: '4+' }
  ];
  
  const bathroomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '4+', label: '4+' }
  ];
  
  const furnishingOptions = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Semi-Furnished', label: 'Semi-Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' }
  ];
  
  const projectStatusOptions = [
    { value: 'New Launch', label: 'New Launch' },
    { value: 'Ready to Move', label: 'Ready to Move' },
    { value: 'Under Construction', label: 'Under Construction' }
  ];
  
  const listedByOptions = [
    { value: 'Builder', label: 'Builder' },
    { value: 'Dealer', label: 'Dealer' },
    { value: 'Owner', label: 'Owner' }
  ];
  
  const carParkingOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '3+', label: '3+' }
  ];
  
  const facingOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
    { value: 'North-East', label: 'North-East' },
    { value: 'North-West', label: 'North-West' },
    { value: 'South-East', label: 'South-East' },
    { value: 'South-West', label: 'South-West' }
  ];
  
  const stateOptions = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    // Add other Indian states as needed
  ];
  
  // Handle image selection
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + selectedImages.length > 20) {
      toast.error('Maximum 20 images allowed');
      return;
    }
    
    // Create preview URLs for selected images
    const newImagePreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedImages(prev => [...prev, ...newImagePreviews]);
    setImageFiles(prev => [...prev, ...files]);
  };
  
  // Remove an image
  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    const updatedFiles = [...imageFiles];
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(selectedImages[index].preview);
    
    updatedImages.splice(index, 1);
    updatedFiles.splice(index, 1);
    
    setSelectedImages(updatedImages);
    setImageFiles(updatedFiles);
  };
  
  // Handle profile image upload
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview URL for the profile image
      const preview = URL.createObjectURL(file);
      setProfileImage(file);
      setProfileImagePreview(preview);
    }
  };
  
  // Remove profile image
  const removeProfileImage = () => {
    if (profileImagePreview) {
      URL.revokeObjectURL(profileImagePreview);
    }
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  // Submit form
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      
      // Upload property images to Cloudinary
      let imageUrls = [];
      if (imageFiles.length > 0) {
        toast.info('Uploading property images...');
        imageUrls = await uploadFiles(imageFiles);
      }
      
      // Upload profile image to Cloudinary if present
      let profileImageUrl = null;
      if (profileImage) {
        toast.info('Uploading profile image...');
        const profileUrls = await uploadFiles([profileImage]);
        profileImageUrl = profileUrls[0];
      }
      
      // Add data to Firebase
      toast.info('Saving property listing...');
      // Use the uploaded image URLs in the property data
      // eslint-disable-next-line no-unused-vars
      const propertyData = {
        ...values,
        images: imageUrls, 
        profileImage: profileImageUrl, 
        createdAt: new Date()
      };
      
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'propertyListings'), propertyData);
      console.log('Document written with ID: ', docRef.id);
      
      toast.success('Property listing created successfully!');
      
      // Reset form and images
      resetForm();
      setSelectedImages([]);
      setImageFiles([]);
      
      // Redirect to listings page after a short delay
      setTimeout(() => {
        navigate('/listings');
      }, 1500); // 1.5 second delay to show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating property listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial form values
  const initialValues = {
    propertyType: '',
    bhk: '',
    bathrooms: '',
    furnishing: '',
    projectStatus: '',
    listedBy: '',
    superBuiltupArea: '',
    carpetArea: '',
    maintenance: '',
    totalFloors: '',
    floorNo: '',
    carParking: '',
    facing: '',
    projectName: '',
    adTitle: '',
    description: '',
    price: '',
    state: '',
    name: 'pickasho',
    mobile: '+91'
  };

  return (
    <div id='property-listing-form' className=" border-1 property-listing-container">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Formik
        initialValues={initialValues}
        validationSchema={propertyFormSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isValid }) => (
          <Form className="property-form">
            {/* Details Section */}
            <div className="form-section">
              <h2>INCLUDE SOME DETAILS</h2>
              
              {/* Property Type */}
              <div className="field-container">
                <h3>Type (Choose one):</h3>
                <div className="option-group">
                  {propertyTypeOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.propertyType === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="propertyType"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="propertyType" component="div" className="error-message" />
              </div>

              {/* BHK Section */}
              <div className="field-container">
                <h3>BHK:</h3>
                <div className="option-group">
                  {bhkOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.bhk === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="bhk"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="bhk" component="div" className="error-message" />
              </div>

              {/* Bathrooms Section */}
              <div className="field-container">
                <h3>Bathrooms:</h3>
                <div className="option-group">
                  {bathroomOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.bathrooms === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="bathrooms"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="bathrooms" component="div" className="error-message" />
              </div>

              {/* Furnishing Section */}
              <div className="field-container">
                <h3>Furnishing:</h3>
                <div className="option-group">
                  {furnishingOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.furnishing === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="furnishing"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="furnishing" component="div" className="error-message" />
              </div>

              {/* Project Status Section */}
              <div className="field-container">
                <h3>Project Status:</h3>
                <div className="option-group">
                  {projectStatusOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.projectStatus === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="projectStatus"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="projectStatus" component="div" className="error-message" />
              </div>

              {/* Listed By Section */}
              <div className="field-container">
                <h3>Listed by:</h3>
                <div className="option-group">
                  {listedByOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.listedBy === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="listedBy"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="listedBy" component="div" className="error-message" />
              </div>

              {/* Area and Other Details */}
              <div className="field-container">
                <div className="input-group">
                  <label htmlFor="superBuiltupArea">Super Builtup Area (sq ft):</label>
                  <Field type="number" name="superBuiltupArea" id="superBuiltupArea" />
                  <ErrorMessage name="superBuiltupArea" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="carpetArea">Carpet Area (sq ft):</label>
                  <Field type="number" name="carpetArea" id="carpetArea" />
                  <ErrorMessage name="carpetArea" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="maintenance">Maintenance (Monthly):</label>
                  <Field type="number" name="maintenance" id="maintenance" />
                  <ErrorMessage name="maintenance" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="totalFloors">Total Floors:</label>
                  <Field type="number" name="totalFloors" id="totalFloors" />
                  <ErrorMessage name="totalFloors" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="floorNo">Floor No:</label>
                  <Field type="number" name="floorNo" id="floorNo" />
                  <ErrorMessage name="floorNo" component="div" className="error-message" />
                </div>
              </div>

              {/* Car Parking Section */}
              <div className="field-container">
                <h3>Car Parking:</h3>
                <div className="option-group">
                  {carParkingOptions.map(option => (
                    <div key={option.value} className="option-item">
                      <label className={values.carParking === option.value ? 'selected' : ''}>
                        <Field
                          type="radio"
                          name="carParking"
                          value={option.value}
                          className="hidden-radio"
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <ErrorMessage name="carParking" component="div" className="error-message" />
              </div>

              {/* Facing Section */}
              <div className="field-container">
                <h3>Facing:</h3>
                <Select
                  options={facingOptions}
                  onChange={(option) => setFieldValue('facing', option.value)}
                  placeholder="Select facing direction"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <ErrorMessage name="facing" component="div" className="error-message" />
              </div>

              {/* Project Details */}
              <div className="field-container">
                <div className="input-group">
                  <label htmlFor="projectName">Project Name</label>
                  <Field type="text" name="projectName" id="projectName" maxLength="70" />
                  <ErrorMessage name="projectName" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="adTitle">Ad Title</label>
                  <Field type="text" name="adTitle" id="adTitle" maxLength="70" />
                  <ErrorMessage name="adTitle" component="div" className="error-message" />
                </div>

                <div className="input-group">
                  <label htmlFor="description">Description</label>
                  <Field as="textarea" name="description" id="description" rows="6" maxLength="4096" />
                  <ErrorMessage name="description" component="div" className="error-message" />
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="form-section price-section">
              <h2>SET A PRICE</h2>
              <div className="input-group">
                <Field type="number" name="price" id="price" placeholder="₹" />
                <ErrorMessage name="price" component="div" className="error-message" />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-section">
              <h2>UPLOAD UP TO 20 PHOTOS</h2>
              <div className="image-upload-container">
                <div className="image-upload-box">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                  <label htmlFor="imageUpload" className="image-upload-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
                      <polyline points="8 9 12 5 16 9" />
                      <line x1="12" y1="5" x2="12" y2="15" />
                    </svg>
                    <span>Add Photo</span>
                  </label>
                </div>
                
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-preview-container">
                    <img src={image.preview} alt={`Preview ${index}`} className="image-preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Empty placeholder boxes - arranged in a grid */}
                {Array.from({ length: Math.max(0, 19 - selectedImages.length) }).map((_, index) => (
                  <div key={`placeholder-${index}`} className="image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#c8c8c8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                ))}
              </div>
              {selectedImages.length === 0 && 
                <div className="error-message">At least one image is required</div>
              }
            </div>

            {/* Location Section */}
            <div className="form-section">
              <h2>CONFIRM YOUR LOCATION</h2>
              <div className="location-options">
                <div id='list'
                  className={`location-option ${locationTab === 'LIST' ? 'selected' : ''}`}
                  onClick={() => setLocationTab('LIST')}
                >
                  LIST
                </div>
                <div 
                  className={`location-option ${locationTab === 'CURRENT_LOCATION' ? 'selected' : ''}`}
                  onClick={() => setLocationTab('CURRENT_LOCATION')}
                >
                  CURRENT LOCATION
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="state">State: <span className="required-field">(This field is mandatory)</span></label>
                <Select
                  options={stateOptions}
                  onChange={(option) => setFieldValue('state', option.value)}
                  placeholder=""
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <ErrorMessage name="state" component="div" className="error-message" />
              </div>
            </div>

            {/* User Details Section */}
            <div className="form-section">
              <h2 className="review-title">REVIEW YOUR DETAILS</h2>
              
              <div className="user-profile-section">
                <div className="profile-photo-container">
                  <div className="profile-photo">
                    {profileImagePreview ? (
                      <>
                        <img src={profileImagePreview} alt="Profile" className="user-profile-img" />
                        <button 
                          type="button" 
                          className="remove-profile-btn"
                          onClick={removeProfileImage}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="profile-initial">C</div>
                    )}
                  </div>
                  
                  <div className="profile-camera-icon">
                    <input 
                      type="file" 
                      id="profileImageUpload" 
                      accept="image/*" 
                      onChange={handleProfileImageChange} 
                      className="profile-image-input"
                    />
                    <label htmlFor="profileImageUpload" className="camera-icon-label">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </label>
                  </div>
                </div>
                
                <div className="user-details-info">
                  <div className="name-field">
                    <label htmlFor="name">Name</label>
                    <Field type="text" name="name" id="name" maxLength="30" />
                    <div className="char-limit">11 / 30</div>
                    <ErrorMessage name="name" component="div" className="error-message" />
                  </div>
                </div>
              </div>
              
              <div className="verification-section">
                <h3>Let's verify your account</h3>
                <p className="verification-text">We will send you a confirmation code by SMS on the next step.</p>
                
                <div className="mobile-input-group">
                  <label htmlFor="mobile">Mobile Phone Number *</label>
                  <div className="mobile-input-container">
                  
                    <Field 
                      type="text" 
                      name="mobile" 
                      id="mobile" 
                      className="mobile-field"
                      placeholder="Phone number"
                    />
                  </div>
                  <ErrorMessage name="mobile" component="div" className="error-message" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-button ${isValid && !isSubmitting ? 'active' : 'disabled'}`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Now'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PropertyListingForm;
