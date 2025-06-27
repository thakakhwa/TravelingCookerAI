import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './TravelPlannerForm.css';

const TravelPlannerForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    destination: '',
    customCity: '',
    customCountry: '',
    startDate: '',
    endDate: '',
    budget: 3500,
    travelers: '1',
    travelStyle: '',
    activities: '',
    foodPreferences: '',
    accommodationType: '',
    specialRequests: '',
    interests: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Static options for dropdowns
  const destinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Rome, Italy',
    'Barcelona, Spain',
    'Dubai, UAE',
    'Bali, Indonesia',
    'Sydney, Australia',
    'Bangkok, Thailand',
    'Istanbul, Turkey',
    'Amsterdam, Netherlands',
    'Prague, Czech Republic',
    'Santorini, Greece',
    'Machu Picchu, Peru',
    'Other'
  ];

  const formatBudget = (amount) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k JOD`;
    }
    return `${amount} JOD`;
  };



  const travelStyles = [
    { key: 'luxury', label: t('travelForm.travelStyles.luxury') },
    { key: 'midRange', label: t('travelForm.travelStyles.midRange') },
    { key: 'budget', label: t('travelForm.travelStyles.budget') },
    { key: 'adventure', label: t('travelForm.travelStyles.adventure') },
    { key: 'relaxation', label: t('travelForm.travelStyles.relaxation') },
    { key: 'cultural', label: t('travelForm.travelStyles.cultural') },
    { key: 'family', label: t('travelForm.travelStyles.family') },
    { key: 'business', label: t('travelForm.travelStyles.business') },
    { key: 'romantic', label: t('travelForm.travelStyles.romantic') },
    { key: 'solo', label: t('travelForm.travelStyles.solo') }
  ];

  const accommodationTypes = [
    { key: 'hotel', label: t('travelForm.accommodationTypes.hotel') },
    { key: 'resort', label: t('travelForm.accommodationTypes.resort') },
    { key: 'boutique', label: t('travelForm.accommodationTypes.boutique') },
    { key: 'hostel', label: t('travelForm.accommodationTypes.hostel') },
    { key: 'airbnb', label: t('travelForm.accommodationTypes.airbnb') },
    { key: 'bnb', label: t('travelForm.accommodationTypes.bnb') },
    { key: 'camping', label: t('travelForm.accommodationTypes.camping') },
    { key: 'cruise', label: t('travelForm.accommodationTypes.cruise') },
    { key: 'other', label: t('travelForm.accommodationTypes.other') }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyDown = (e) => {
    // Prevent Enter key from submitting form unless on final step
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < totalSteps && isStepValid()) {
        handleNext();
      } else if (currentStep === totalSteps) {
        handleFinalSubmit();
      }
    }
  };



  const scrollToTop = () => {
    const formElement = document.querySelector('.travel-planner-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to window scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Removed complex animation function that was causing refresh issues

  const handleNext = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('handleNext called, currentStep:', currentStep);
    
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setCurrentStep(nextStep);
      // Simplified animation - just scroll to top
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('handlePrevious called, currentStep:', currentStep);
    
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      console.log('Moving to step:', prevStep);
      setCurrentStep(prevStep);
      // Simplified animation - just scroll to top
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [currentStep]);

  // Removed unused getStepContentSize function

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent any form submission that's not from the final submit button
    return false;
  };

  const handleFinalSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Final submit button clicked');
    onSubmit(formData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        const hasDestination = formData.destination && 
          (formData.destination !== 'Other' || (formData.destination === 'Other' && formData.customCity.trim() && formData.customCountry.trim()));
        return hasDestination && formData.startDate && formData.endDate;
      case 2:
        return formData.budget && formData.travelers && formData.travelStyle && formData.accommodationType;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h3>✈️ {t('travelForm.step1Title')}</h3>
            
            <div className="form-group">
              <label htmlFor="destination">{t('travelForm.destination')}</label>
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
              >
                <option value="">{t('travelForm.selectDestination')}</option>
                {destinations.map((dest, index) => (
                  <option key={index} value={dest}>{dest === 'Other' ? t('travelForm.other') : dest}</option>
                ))}
              </select>
              
              {formData.destination === 'Other' && (
                <div className="custom-destination-fields">
                  <input
                    type="text"
                    name="customCity"
                    value={formData.customCity}
                    onChange={handleInputChange}
                    placeholder={t('travelForm.enterCity')}
                    className="custom-destination-input"
                    required
                  />
                  <input
                    type="text"
                    name="customCountry"
                    value={formData.customCountry}
                    onChange={handleInputChange}
                    placeholder={t('travelForm.enterCountry')}
                    className="custom-destination-input"
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">{t('travelForm.departureDate')}</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">{t('travelForm.returnDate')}</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h3>💰 {t('travelForm.step2Title')}</h3>
            
            <div className="form-group budget-slider-group">
              <label htmlFor="budget">{t('travelForm.budget')} <span className="budget-value">{formatBudget(formData.budget)}</span></label>
              <div className="budget-slider-container">
                <span className="budget-min">{t('travelForm.budgetMin')}</span>
                <input
                  type="range"
                  id="budget"
                  name="budget"
                  min="350"
                  max="35000"
                  step="350"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="budget-slider"
                  required
                />
                <span className="budget-max">{t('travelForm.budgetMax')}</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="travelers">{t('travelForm.travelers')}</label>
                <select
                  id="travelers"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  required
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? t('travelForm.person') : t('travelForm.people')}</option>
                  ))}
                  <option value="9+">9+ {t('travelForm.people')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="travelStyle">{t('travelForm.travelStyle')}</label>
                <select
                  id="travelStyle"
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleInputChange}
                >
                  <option value="">{t('travelForm.selectTravelStyle')}</option>
                  {travelStyles.map((style, index) => (
                    <option key={index} value={style.key}>{style.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="accommodationType">{t('travelForm.accommodation')}</label>
              <select
                id="accommodationType"
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleInputChange}
              >
                <option value="">{t('travelForm.selectAccommodation')}</option>
                {accommodationTypes.map((type, index) => (
                  <option key={index} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h3>🎯 {t('travelForm.step3Title')}</h3>
            
            <div className="form-group">
              <label htmlFor="activities">{t('travelForm.activities')}</label>
              <textarea
                id="activities"
                name="activities"
                value={formData.activities}
                onChange={handleInputChange}
                placeholder={t('travelForm.activitiesPlaceholder')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="foodPreferences">{t('travelForm.foodPreferences')}</label>
              <textarea
                id="foodPreferences"
                name="foodPreferences"
                value={formData.foodPreferences}
                onChange={handleInputChange}
                placeholder={t('travelForm.foodPlaceholder')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="interests">{t('travelForm.interests')}</label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder={t('travelForm.interestsPlaceholder')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">{t('travelForm.specialRequests')}</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder={t('travelForm.specialRequestsPlaceholder')}
                rows="3"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="travel-planner-form" onKeyDown={handleKeyDown}>
      <div className="form-header">
        <h2>{t('travelForm.title')}</h2>
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
              >
                <span className="step-number">{step}</span>
                <span className="step-label">
                  {step === 1 ? t('travelForm.stepDestination') : step === 2 ? t('travelForm.stepBudget') : t('travelForm.stepPreferences')}
                </span>
              </div>
            ))}
          </div>
          <div className="progress-line">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={`form-content step-${currentStep}`}>
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={(e) => handlePrevious(e)}
              className="btn-secondary"
            >
              {t('travelForm.previous')}
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              onClick={(e) => handleNext(e)}
              disabled={!isStepValid()}
              className="btn-primary"
            >
              {t('travelForm.next')}
            </button>
          ) : (
            <button 
              type="button" 
              onClick={(e) => handleFinalSubmit(e)}
              className="btn-submit"
            >
              {t('travelForm.createPlan')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerForm; 