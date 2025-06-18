import React, { useState, useEffect } from 'react';

const Home = () => {
  const [destination, setDestination] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (destination.trim()) {
      setIsSearching(true);
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800));
      alert(`Searching for trips to ${destination}...`);
      setIsSearching(false);
    }
  };

  // Animation for placeholder text
  const placeholderTexts = [
    "Enter your dream destination and preferences...",
    "Example: Weekend in Paris under $2000",
    "Example: Tokyo food tour with local guides",
    "Example: Bali beach resort with spa",
    "Example: Family trip to Disney World",
    "Example: Hiking in Swiss Alps, need gear rental",
    "Example: Greek islands, 2 weeks, local cuisine",
    "Example: Dubai luxury shopping & desert safari",
    "Example: Costa Rica eco-tour, wildlife focus",
    "Example: Northern lights trip to Iceland"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (!isSearchFocused) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSearchFocused]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Complete Trip Planning, Start to Finish</h1>
          <p className="tagline">The easiest way to plan your perfect trip</p>
          <p className="hero-description">
            We handle every detail of your journey - flights, hotels, activities, and restaurants. From the moment you tell us your destination to the day you return home, we've got everything covered.
          </p>
          
          <form className="search-form" onSubmit={handleSearch}>
            <div className={`search-container ${isSearchFocused ? 'focused' : ''} ${isSearching ? 'searching' : ''}`}>
              <input
                type="text"
                className="search-input"
                placeholder={placeholderTexts[placeholderIndex]}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                disabled={isSearching}
                aria-label="Search destination"
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={!destination.trim() || isSearching}
                aria-label={isSearching ? 'Searching...' : 'Search'}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Everything You Need</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">✈️</div>
            <h3>Flights</h3>
            <p>Best deals and perfect timing for your journey</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏨</div>
            <h3>Hotels</h3>
            <p>Handpicked accommodations for every budget</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>Activities</h3>
            <p>Curated experiences and must-see attractions</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🍽️</div>
            <h3>Restaurants</h3>
            <p>Local favorites and hidden gems</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Tell us your destination</h3>
            <p>Share where you want to go and your preferences</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>We plan everything</h3>
            <p>Our experts handle all the details and bookings</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Enjoy your trip</h3>
            <p>Relax and experience your perfectly planned journey</p>
          </div>
        </div>
        
        <div className="cta-container">
          <a href="/" className="cta-button">Start Planning Your Trip</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
