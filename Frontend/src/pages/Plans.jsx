import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { ScrollAnimationWrapper } from '../hooks/useScrollAnimation.jsx';
import './Plans.css';

const Plans = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const getPlans = () => [
    {
      id: 'starter',
      name: t('plans.explorer.name'),
      description: t('plans.explorer.description'),
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      credits: 25,
      features: [
        t('plans.explorer.features.feature1'),
        t('plans.explorer.features.feature2'),
        t('plans.explorer.features.feature3'),
        t('plans.explorer.features.feature4'),
        t('plans.explorer.features.feature5')
      ],
      popular: false,
      color: '#4CAF50'
    },
    {
      id: 'pro',
      name: t('plans.wandererPro.name'),
      description: t('plans.wandererPro.description'),
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      credits: 75,
      features: [
        t('plans.wandererPro.features.feature1'),
        t('plans.wandererPro.features.feature2'),
        t('plans.wandererPro.features.feature3'),
        t('plans.wandererPro.features.feature4'),
        t('plans.wandererPro.features.feature5'),
        t('plans.wandererPro.features.feature6'),
        t('plans.wandererPro.features.feature7'),
        t('plans.wandererPro.features.feature8')
      ],
      popular: true,
      color: '#0066ff'
    },
    {
      id: 'business',
      name: t('plans.businessTraveler.name'),
      description: t('plans.businessTraveler.description'),
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      credits: 200,
      features: [
        t('plans.businessTraveler.features.feature1'),
        t('plans.businessTraveler.features.feature2'),
        t('plans.businessTraveler.features.feature3'),
        t('plans.businessTraveler.features.feature4'),
        t('plans.businessTraveler.features.feature5'),
        t('plans.businessTraveler.features.feature6'),
        t('plans.businessTraveler.features.feature7'),
        t('plans.businessTraveler.features.feature8'),
        t('plans.businessTraveler.features.feature9'),
        t('plans.businessTraveler.features.feature10')
      ],
      popular: false,
      color: '#9C27B0'
    }
  ];

  const plans = getPlans();

  const formatPrice = (monthly, yearly) => {
    if (billingCycle === 'monthly') {
      return `$${monthly}${t('plans.perMonth')}`;
    } else {
      const monthlyEquivalent = yearly / 12;
      return (
        <div>
          <span className="yearly-price">${yearly}${t('plans.perYear')}</span>
          <span className="monthly-equivalent">${monthlyEquivalent.toFixed(2)}${t('plans.perMonth')}</span>
        </div>
      );
    }
  };

  const getCreditsText = (credits) => {
    return `${credits} ${t('plans.aiPlans')}`;
  };

  const getCurrentPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className={`plans-page ${theme}`} data-theme={theme}>
      <div className="plans-container">
        {/* Header Section */}
        <ScrollAnimationWrapper animation="fadeInDown" duration={0.8} once={true}>
          <div className="plans-header">
            <h1>{t('plans.title')}</h1>
            <p className="plans-subtitle">
              {t('plans.subtitle')}
            </p>
            
            {/* Billing Toggle */}
            <div className="billing-toggle">
              <span className={billingCycle === 'monthly' ? 'active' : ''}>{t('plans.monthly')}</span>
              <div className="toggle-switch" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
                <div className={`toggle-slider ${billingCycle}`}></div>
              </div>
              <span className={billingCycle === 'yearly' ? 'active' : ''}>
                {t('plans.yearly')}
                <span className="discount-badge">{t('plans.save17')}</span>
              </span>
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Plans Grid */}
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <ScrollAnimationWrapper key={plan.id} animation="cardSlideUp" delay={index * 0.2}>
              <div className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">{t('plans.mostPopular')}</div>}
              
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
                  <span className="credits-description">{t('plans.aiPoweredTravelPlans')}</span>
                </div>
              </div>

              <div className="plan-features">
                <h4>{t('plans.whatsIncluded')}</h4>
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
                {t('plans.getStarted')}
              </button>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="features-section">
          <ScrollAnimationWrapper animation="fadeInUp" delay={0.1}>
            <h2>{t('plans.whyChoose')}</h2>
          </ScrollAnimationWrapper>
          <div className="features-grid">
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.2}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                </div>
                <h3>{t('plans.smartItinerary.title')}</h3>
                <p>{t('plans.smartItinerary.description')}</p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.3}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3>{t('plans.personalizedRecommendations.title')}</h3>
                <p>{t('plans.personalizedRecommendations.description')}</p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.4}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <h3>{t('plans.realTimeUpdates.title')}</h3>
                <p>{t('plans.realTimeUpdates.description')}</p>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="cardSlideUp" delay={0.5}>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3>{t('plans.detailedGuides.title')}</h3>
                <p>{t('plans.detailedGuides.description')}</p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <ScrollAnimationWrapper animation="fadeInUp" delay={0.1}>
            <h2>{t('plans.faq.title')}</h2>
          </ScrollAnimationWrapper>
          <div className="faq-grid">
            <ScrollAnimationWrapper animation="slideInUp" delay={0.2}>
              <div className="faq-item">
                <h4>{t('plans.faq.question1')}</h4>
                <p>{t('plans.faq.answer1')}</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInUp" delay={0.3}>
              <div className="faq-item">
                <h4>{t('plans.faq.question2')}</h4>
                <p>{t('plans.faq.answer2')}</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInUp" delay={0.4}>
              <div className="faq-item">
                <h4>{t('plans.faq.question3')}</h4>
                <p>{t('plans.faq.answer3')}</p>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slideInUp" delay={0.5}>
              <div className="faq-item">
                <h4>{t('plans.faq.question4')}</h4>
                <p>{t('plans.faq.answer4')}</p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans; 