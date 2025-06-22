import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatSidebar from '../components/ChatSidebar';
import TravelPlannerForm from '../components/TravelPlannerForm';

const Home = ({ sidebarCollapsed, onToggleSidebar, onNewChat }) => {
  const { user, isAuthenticated } = useAuth();

  const handleTravelPlanSubmit = async (formData) => {
    console.log('Travel plan submitted:', formData);
    // Here you would typically send the data to your backend API
    // For now, we'll just show an alert with the data
    const destination = formData.destination === 'Other' 
      ? `${formData.customCity}, ${formData.customCountry}` 
      : formData.destination;
    alert(`Thank you! We're creating your travel plan for ${destination}. 
Budget: ${formData.budget.toLocaleString()} JOD
Dates: ${formData.startDate} to ${formData.endDate}
Travelers: ${formData.travelers}
Activities: ${formData.activities || 'Not specified'}
Food preferences: ${formData.foodPreferences || 'Not specified'}`);
  };

  return (
    <div className="home-container">
      {/* Chat Sidebar for logged in users */}
      {isAuthenticated && (
        <ChatSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          onNewChat={onNewChat}
        />
      )}
      
      {/* Main content with adjusted margin when sidebar is visible */}
      <div className={`main-content ${isAuthenticated ? (sidebarCollapsed ? 'sidebar-collapsed' : 'with-sidebar') : ''}`}>
        {/* Compact Welcome Section */}
        <section className="hero-section-compact">
          <div className="hero-content-compact">
            <h1 className="welcome-title">
              {isAuthenticated 
                ? `Welcome back, ${user?.username}! 🌍`
                : "Plan Your Perfect Trip 🌍"
              }
            </h1>
            <p className="welcome-subtitle">
              {isAuthenticated 
                ? "Let's create your next amazing adventure!"
                : "Tell us about your dream destination and we'll create a personalized itinerary"
              }
            </p>
          </div>
        </section>

        {/* Travel Planner Form */}
        <TravelPlannerForm onSubmit={handleTravelPlanSubmit} />

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
              <h3>Answer our questions</h3>
              <p>Tell us your destination, dates, budget, and preferences</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI creates your plan</h3>
              <p>Our AI analyzes your answers and creates a personalized itinerary</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Enjoy your adventure</h3>
              <p>Follow your custom plan and make unforgettable memories</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
