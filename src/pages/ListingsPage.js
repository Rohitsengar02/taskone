import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import './ListingsPage.css';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'propertyListings'));
        const listingData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(listingData);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
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
    <div className="listings-page">
      <div className="page-header">
        <h1>Property Listings</h1>
        <Link to="/" className="add-listing-button">Add New Listing</Link>
      </div>

      {listings.length === 0 ? (
        <div className="no-listings">
          <p>No property listings found. Start by adding a new listing.</p>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map(listing => (
            <Link to={`/listing/${listing.id}`} key={listing.id} className="listing-card">
              <div className="listing-image-container">
                {listing.images && listing.images.length > 0 ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.adTitle} 
                    className="listing-image"
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="listing-info">
                <h2 className="listing-title">{listing.adTitle}</h2>
                <p className="listing-location">{listing.state}</p>
                <div className="listing-details">
                  <span>{listing.bhk} BHK</span>
                  <span>{listing.propertyType}</span>
                </div>
                <p className="listing-price">{formatPrice(listing.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
