import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ChatSidebar from '../components/ChatSidebar';
import ChatInterface from '../components/ChatInterface';
import TravelPlannerForm from '../components/TravelPlannerForm';
import TravelPlanResults from '../components/TravelPlanResults';
import { chatApi } from '../services/chatApi';
import { ScrollAnimationWrapper } from '../hooks/useScrollAnimation.jsx';
import './Home.css';

const Home = ({ sidebarCollapsed, onToggleSidebar, onNewChat }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [currentChatSession, setCurrentChatSession] = useState(null);

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

  const handleOpenChat = async () => {
    if (!isAuthenticated) {
      // Could trigger auth modal here
      return;
    }

    try {
      // Create a new chat session or use existing one
      let sessionId;
      if (currentChatSession) {
        sessionId = currentChatSession;
      } else {
        const newSession = await chatApi.createSession({
          title: 'Travel Planning Chat'
        });
        sessionId = newSession.id;
        setCurrentChatSession(sessionId);
      }
      
      setShowChat(true);
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
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
          <ScrollAnimationWrapper animation="fadeInDown" duration={0.8}>
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
          </ScrollAnimationWrapper>
        </section>

        {/* Travel Planner Form or Results */}
        {!showResults ? (
          <ScrollAnimationWrapper animation="fadeInUp" delay={0.2} duration={0.8}>
            <TravelPlannerForm onSubmit={handleTravelPlanSubmit} />
          </ScrollAnimationWrapper>
        ) : (
          <ScrollAnimationWrapper animation="fadeInUp" duration={0.8}>
            <TravelPlanResults 
              formData={planData} 
              onBack={handleBackToForm}
              onNewPlan={handleNewPlan}
            />
          </ScrollAnimationWrapper>
        )}

        {/* Services Section */}
        <section className="services-section">
          <ScrollAnimationWrapper animation="fadeInUp" delay={0.1}>
            <h2>Everything You Need</h2>
          </ScrollAnimationWrapper>
          <div className="services-grid scroll-animation-grid">
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.2}>
              <div className="service-card">
                <div className="service-icon">✈️</div>
                <h3>Flights</h3>
                <p>Best deals and perfect timing for your journey</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.3}>
              <div className="service-card">
                <div className="service-icon" style={{height:37}}>🏨</div>
                <h3>Hotels</h3>
                <p>Handpicked accommodations for every budget</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.4}>
              <div className="service-card">
                <div className="service-icon">🎯</div>
                <h3>Activities</h3>
                <p>Curated experiences and must-see attractions</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.5}>
              <div className="service-card">
                <div className="service-icon">🍽️</div>
                <h3>Restaurants</h3>
                <p>Local favorites and hidden gems</p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <ScrollAnimationWrapper animation="fadeInUp" delay={0.1}>
            <h2>How It Works</h2>
          </ScrollAnimationWrapper>
          <div className="steps">
            <ScrollAnimationWrapper animation="slideInUp" delay={0.2}>
              <div className="step">
                <div className="step-number">1</div>
                <h3>Answer our questions</h3>
                <p>Tell us your destination, dates, budget, and preferences</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInUp" delay={0.3}>
              <div className="step">
                <div className="step-number">2</div>
                <h3>AI creates your plan</h3>
                <p>Our AI analyzes your answers and creates a personalized itinerary</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInUp" delay={0.4}>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Enjoy your adventure</h3>
                <p>Follow your custom plan and make unforgettable memories</p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      </div>


    </div>
  );
};

export default Home;
