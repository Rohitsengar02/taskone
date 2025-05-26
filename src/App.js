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
            <nav className="navbar">
              <Link to="/listings" className="back-arrow">&lt;</Link>
              
              <h1 className="header-title-h1">Post Your Ad</h1>
          
            </nav>
            <header className="app-header">
              <h1 className="header-title">POST YOUR AD</h1>
            </header>
            <main className="app-content">
              <div className="category-section">
                <div className="category-content">
                  <h2>SELECTED CATEGORY</h2>
                  <div className="category-path">
                    <span className="category-text">Properties / For Sale: Houses & Apartments</span>
                    <Link className="change-link">Change</Link>
                  </div>
                </div>
              </div>
              <div className="form-container">
              <PropertyListingForm />
              </div>
            </main>
          </div>
        } />
        
        <Route path="/listings" element={
          
          <div className="App">
            <nav className="navbar">
              <Link to="/" className="back-arrow">&lt;</Link>
            </nav>
            <main className="app-content">
            <header className="app-header">
              <h1 className="header-title">PROPERTY LISTINGS</h1>
              <Link to="/" className="back-link">+ Post New Ad</Link>
            </header>
            <main className="app-content">
              <ListingsPage />
            </main>
            </main>
          </div>
        } />
        
        <Route path="/listing/:id" element={
          <div className="App">
            <nav className="navbar">
              <Link to="/listings" className="back-arrow">&lt;</Link>
            </nav>
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
