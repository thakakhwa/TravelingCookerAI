import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>About TravelingCooker</h1>
        <p className="lead">
          We're passionate about making travel planning effortless and enjoyable for everyone.
        </p>
      </div>

      {/* What We Do Section */}
      <section className="about-section">
        <div className="section-content">
          <h3>What We Do</h3>
          <p>
            TravelingCooker takes the stress out of trip planning by handling every detail of your journey. 
            From finding the perfect flights and accommodations to curating unique experiences and 
            restaurant recommendations, we create complete travel itineraries tailored to your preferences.
          </p>
          <p>
            Our comprehensive approach means you can focus on what matters most - enjoying your trip. 
            We handle the research, bookings, and coordination so you don't have to.
          </p>
        </div>
        <div className="section-image">
          <div className="image-placeholder">🗺️ Complete Trip Planning</div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-section">
        <div className="section-image">
          <div className="image-placeholder">⭐ Expert Curation</div>
        </div>
        <div className="section-content">
          <h3>Why Choose TravelingCooker</h3>
          <p>
            With years of travel experience and industry connections, we know what makes a trip 
            truly special. Our team carefully selects each component of your journey to ensure 
            quality, value, and unforgettable experiences.
          </p>
          <p>
            We believe every traveler is unique, which is why we customize each itinerary to match 
            your interests, budget, and travel style. No cookie-cutter packages - just personalized 
            adventures designed for you.
          </p>
        </div>
      </section>

      {/* Our Services Grid */}
      <section className="services-section">
        <h2>Our Complete Service</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">✈️</div>
            <h3>Flight Planning</h3>
            <p>Best routes, optimal timing, and competitive prices for your journey</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏨</div>
            <h3>Accommodation</h3>
            <p>Handpicked hotels and stays that match your style and budget</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>Experiences</h3>
            <p>Curated activities, tours, and attractions for memorable moments</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🍽️</div>
            <h3>Dining</h3>
            <p>Local favorites, hidden gems, and must-try culinary experiences</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Planning?</h2>
        <p>Let us create the perfect trip for you. Complete planning from start to finish.</p>
        <a href="/" className="cta-button">Get Started</a>
      </section>
    </div>
  );
};

export default About; 