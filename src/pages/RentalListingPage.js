import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './RentalListingPage.css';

const RentalListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'propertyListings', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!listing) {
    return <div className="error-container">Listing not found</div>;
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="rental-listing-page">
      <div className="listing-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-container">
            {listing.images && listing.images.length > 0 ? (
              <img 
                src={listing.images[activeImageIndex]} 
                alt={`Property ${activeImageIndex + 1}`}
                className="main-image"
              />
            ) : (
              <div className="no-image">No images available</div>
            )}
          </div>
          
          {listing.images && listing.images.length > 1 && (
            <div className="thumbnail-container">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div className="listing-details">
          <h1 className="listing-title">{listing.adTitle}</h1>
          <p className="listing-location">{listing.state}</p>
          <div className="listing-price">{formatPrice(listing.price)}</div>
          
          <div className="property-details">
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{listing.propertyType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">BHK:</span>
              <span className="detail-value">{listing.bhk}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Bathrooms:</span>
              <span className="detail-value">{listing.bathrooms}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Furnishing:</span>
              <span className="detail-value">{listing.furnishing}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Project Status:</span>
              <span className="detail-value">{listing.projectStatus}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Listed by:</span>
              <span className="detail-value">{listing.listedBy}</span>
            </div>
          </div>

          <div className="area-details">
            <div className="detail-item">
              <span className="detail-label">Super Builtup Area:</span>
              <span className="detail-value">{listing.superBuiltupArea} sq ft</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Carpet Area:</span>
              <span className="detail-value">{listing.carpetArea} sq ft</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Maintenance:</span>
              <span className="detail-value">₹{listing.maintenance}/month</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Floor:</span>
              <span className="detail-value">{listing.floorNo} of {listing.totalFloors}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Car Parking:</span>
              <span className="detail-value">{listing.carParking}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Facing:</span>
              <span className="detail-value">{listing.facing}</span>
            </div>
          </div>

          <div className="project-info">
            <h2>Project Details</h2>
            <p className="project-name">{listing.projectName}</p>
            <div className="description">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="contact-details">
          <h2>Contact Details</h2>
          <div className="owner-profile">
            {listing.profileImage ? (
              <img src={listing.profileImage} alt="Owner" className="owner-image" />
            ) : (
              <div className="owner-initial">{listing.name ? listing.name.charAt(0).toUpperCase() : 'U'}</div>
            )}
            <div className="owner-info">
              <div className="owner-name">{listing.name}</div>
              <div className="owner-contact">{listing.mobile}</div>
            </div>
          </div>
          <button className="contact-button">Contact Owner</button>
        </div>
      </div>
    </div>
  );
};

export default RentalListingPage;
