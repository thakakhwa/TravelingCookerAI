import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Plans.css';

const Plans = () => {
  const { theme } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Explorer',
      description: 'Perfect for occasional travelers',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      credits: 25,
      features: [
        '25 AI travel plans per month',
        'Basic destination recommendations',
        'Flight & hotel suggestions',
        'Standard support',
        'Export to PDF'
      ],
      popular: false,
      color: '#4CAF50'
    },
    {
      id: 'pro',
      name: 'Wanderer Pro',
      description: 'For frequent travelers and travel enthusiasts',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      credits: 75,
      features: [
        '75 AI travel plans per month',
        'Advanced AI recommendations',
        'Detailed itineraries with activities',
        'Real-time price comparisons',
        'Priority support',
        'Custom travel preferences',
        'Multiple export formats',
        'Trip sharing features'
      ],
      popular: true,
      color: '#0066ff'
    },
    {
      id: 'business',
      name: 'Business Traveler',
      description: 'For travel agencies and business users',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      credits: 200,
      features: [
        '200 AI travel plans per month',
        'Premium AI models & insights',
        'Multi-destination planning',
        'Corporate travel features',
        'API access',
        'White-label options',
        '24/7 premium support',
        'Team collaboration tools',
        'Advanced analytics',
        'Custom integrations'
      ],
      popular: false,
      color: '#9C27B0'
    }
  ];

  const formatPrice = (monthly, yearly) => {
    if (billingCycle === 'monthly') {
      return `$${monthly}/month`;
    } else {
      const monthlyEquivalent = yearly / 12;
      return (
        <div>
          <span className="yearly-price">${yearly}/year</span>
          <span className="monthly-equivalent">${monthlyEquivalent.toFixed(2)}/month</span>
        </div>
      );
    }
  };

  const getCreditsText = (credits) => {
    return `${credits} AI Plans`;
  };

  const getCurrentPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className={`plans-page ${theme}`} data-theme={theme}>
      <div className="plans-container">
        {/* Header Section */}
        <div className="plans-header">
          <h1>Choose Your AI Travel Planning Experience</h1>
          <p className="plans-subtitle">
            Unlock the power of AI to create perfect travel plans. Each plan includes AI-generated 
            itineraries, personalized recommendations, and smart travel insights.
          </p>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
            <div className="toggle-switch" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
              <div className={`toggle-slider ${billingCycle}`}></div>
            </div>
            <span className={billingCycle === 'yearly' ? 'active' : ''}>
              Yearly 
              <span className="discount-badge">Save 17%</span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <div className="plan-icon" style={{ backgroundColor: plan.color }}>
                  <svg viewBox="0 0 24 24" fill="white">
                    {plan.id === 'starter' && (
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    )}
                    {plan.id === 'pro' && (
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    )}
                    {plan.id === 'business' && (
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                    )}
                  </svg>
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-pricing">
                <div className="price-display">
                  {formatPrice(plan.monthlyPrice, plan.yearlyPrice)}
                </div>
                <div className="credits-info">
                  <span className="credits-count">{getCreditsText(plan.credits)}</span>
                  <span className="credits-description">AI-powered travel plans</span>
                </div>
              </div>

              <div className="plan-features">
                <h4>What's included:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`plan-button ${plan.popular ? 'popular' : ''}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="features-section">
          <h2>Why Choose AI-Powered Travel Planning?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </div>
              <h3>Smart Itinerary Planning</h3>
              <p>AI creates optimized daily schedules based on your preferences, time constraints, and local insights.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3>Personalized Recommendations</h3>
              <p>Get tailored suggestions for accommodations, activities, and dining based on your travel style and budget.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <h3>Real-Time Updates</h3>
              <p>Stay informed with live price tracking, weather updates, and last-minute recommendations.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3>Detailed Travel Guides</h3>
              <p>Access comprehensive guides with local tips, cultural insights, and hidden gems discovered by AI.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do AI travel plan credits work?</h4>
              <p>Each credit allows you to generate one complete AI travel plan including itinerary, accommodations, activities, and recommendations. Credits reset monthly.</p>
            </div>
            <div className="faq-item">
              <h4>Can I upgrade or downgrade my plan?</h4>
              <p>Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle.</p>
            </div>
            <div className="faq-item">
              <h4>What happens if I run out of credits?</h4>
              <p>You can purchase additional credits or upgrade your plan. We'll notify you when you're running low on credits.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer refunds?</h4>
              <p>We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans; 