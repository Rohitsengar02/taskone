import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PropertyListingForm from './components/PropertyListingForm';
import ListingsPage from './pages/ListingsPage';
import RentalListingPage from './pages/RentalListingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="app-header">
              <h1 className="header-title">POST YOUR AD</h1>
            </header>
            <main className="app-content">
              <div className="category-section">
                <div className="category-content">
                  <h2>SELECTED CATEGORY</h2>
                  <div className="category-path">
                    <span className="category-text">Properties / For Sale: Houses & Apartments</span>
                    <Link to="/listings" className="change-link">View All Listings</Link>
                  </div>
                </div>
              </div>
              <PropertyListingForm />
            </main>
          </div>
        } />
        
        <Route path="/listings" element={
          <div className="App">
            <header className="app-header">
              <h1 className="header-title">PROPERTY LISTINGS</h1>
              <Link to="/" className="back-link">+ Post New Ad</Link>
            </header>
            <main className="app-content">
              <ListingsPage />
            </main>
          </div>
        } />
        
        <Route path="/listing/:id" element={
          <div className="App">
            <header className="app-header">
              <h1 className="header-title">PROPERTY DETAILS</h1>
              <Link to="/listings" className="back-link">Back to Listings</Link>
            </header>
            <main className="app-content">
              <RentalListingPage />
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
