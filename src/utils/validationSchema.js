import * as Yup from 'yup';

export const propertyFormSchema = Yup.object().shape({
  // Property Type
  propertyType: Yup.string()
    .oneOf(['Flats / Apartments', 'Independent / Builder Floors', 'Farm House', 'House & Villa'])
    .required('Property type is required'),
  
  // BHK
  bhk: Yup.string()
    .oneOf(['1', '2', '3', '4+'])
    .required('Number of bedrooms is required'),
  
  // Bathrooms
  bathrooms: Yup.string()
    .oneOf(['1', '2', '3', '4+'])
    .required('Number of bathrooms is required'),
  
  // Furnishing
  furnishing: Yup.string()
    .oneOf(['Furnished', 'Semi-Furnished', 'Unfurnished'])
    .required('Furnishing status is required'),
  
  // Project Status
  projectStatus: Yup.string()
    .oneOf(['New Launch', 'Ready to Move', 'Under Construction'])
    .required('Project status is required'),
  
  // Listed by
  listedBy: Yup.string()
    .oneOf(['Builder', 'Dealer', 'Owner'])
    .required('Lister type is required'),
  
  // Super Builtup Area
  superBuiltupArea: Yup.number()
    .positive('Area must be positive')
    .required('Super builtup area is required'),
  
  // Carpet Area
  carpetArea: Yup.number()
    .positive('Area must be positive')
    .required('Carpet area is required'),
  
  // Maintenance
  maintenance: Yup.number()
    .min(0, 'Maintenance cannot be negative')
    .required('Maintenance is required'),
  
  // Total Floors
  totalFloors: Yup.number()
    .positive('Total floors must be positive')
    .integer('Total floors must be a whole number')
    .required('Total floors is required'),
  
  // Floor No
  floorNo: Yup.number()
    .min(0, 'Floor number cannot be negative')
    .integer('Floor number must be a whole number')
    .test('valid-floor', 'Floor number cannot exceed total floors', 
      function(value) {
        return !value || !this.parent.totalFloors || value <= this.parent.totalFloors;
      })
    .required('Floor number is required'),
  
  // Car Parking
  carParking: Yup.string()
    .oneOf(['0', '1', '2', '3', '3+'])
    .required('Car parking is required'),
  
  // Facing
  facing: Yup.string()
    .required('Facing direction is required'),
  
  // Project Name
  projectName: Yup.string()
    .max(70, 'Project name cannot exceed 70 characters')
    .required('Project name is required'),
  
  // Ad Title
  adTitle: Yup.string()
    .max(70, 'Ad title cannot exceed 70 characters')
    .required('Ad title is required'),
  
  // Description
  description: Yup.string()
    .max(4096, 'Description cannot exceed 4096 characters')
    .required('Description is required'),
  
  // Price
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  
  // Location
  state: Yup.string()
    .required('State is required'),
  
  // User Details
  name: Yup.string()
    .max(30, 'Name cannot exceed 30 characters')
    .required('Name is required'),
  
  // Mobile
  mobile: Yup.string()
    .matches(/^\+91[0-9]{10}$/, 'Phone number must be a valid Indian number')
    .required('Mobile number is required'),
  
  // Images
  images: Yup.array()
    .min(1, 'At least one image is required')
    .max(20, 'Maximum 20 images allowed')
});
