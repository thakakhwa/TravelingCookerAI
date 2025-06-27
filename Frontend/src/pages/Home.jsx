import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ChatSidebar from '../components/ChatSidebar';
import TravelPlannerForm from '../components/TravelPlannerForm';
import TravelPlanResults from '../components/TravelPlanResults';

const Home = ({ sidebarCollapsed, onToggleSidebar, onNewChat }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [planData, setPlanData] = useState(null);

  const handleTravelPlanSubmit = async (formData) => {
    console.log('Travel plan submitted:', formData);
    // Store the form data and show results
    setPlanData(formData);
    setShowResults(true);
    
    // Scroll to results after a brief delay to ensure the results component is rendered
    setTimeout(() => {
      const resultsElement = document.querySelector('.travel-plan-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        // Fallback: scroll to top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        } else {
          // Final fallback: scroll to top of page
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 100);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  const handleNewPlan = () => {
    setShowResults(false);
    setPlanData(null);
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                ? t('welcomeMessages.welcomeBack', { username: user?.username })
                : t('welcomeMessages.planTrip')
              }
            </h1>
            <p className="welcome-subtitle">
              {isAuthenticated 
                ? t('welcomeMessages.nextAdventure')
                : t('welcomeMessages.dreamDestination')
              }
            </p>
          </div>
        </section>

        {/* Travel Planner Form or Results */}
        {!showResults ? (
          <TravelPlannerForm onSubmit={handleTravelPlanSubmit} />
        ) : (
          <TravelPlanResults 
            formData={planData} 
            onBack={handleBackToForm}
            onNewPlan={handleNewPlan}
          />
        )}

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
