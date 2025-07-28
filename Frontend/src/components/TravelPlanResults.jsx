import React from 'react';
import { useTranslation } from 'react-i18next';
import './TravelPlanResults.css';

const TravelPlanResults = ({ formData, onBack, onNewPlan }) => {
  const { t } = useTranslation();
  
  // Handle both AI-generated plans and fallback data
  const hasAIPlan = formData.travelPlan && formData.travelPlan.plan;
  const aiPlan = hasAIPlan ? formData.travelPlan.plan : null;
  
  // Debug: Log the REAL data from backend
  console.log('🎯 REAL AI Data from Backend:', aiPlan);
  
  // Extract destination first to avoid reference issues
  const destination = formData.destination === 'Other' ? `${formData.customCity}, ${formData.customCountry}` : formData.destination;
  const duration = Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24));
  const budget = parseInt(formData.budget);

  // SAFE parsing functions to prevent crashes
  const safeParseAirport = (airportString) => {
    if (!airportString || typeof airportString !== 'string') {
      return { code: 'N/A', city: 'Unknown' };
    }
    
    // If format is "City (CODE)" 
    if (airportString.includes('(') && airportString.includes(')')) {
      const parts = airportString.split('(');
      const city = parts[0].trim();
      const code = parts[1]?.replace(')', '').trim() || 'N/A';
      return { code, city };
    }
    
    // If it's just a code like "AMM" or "NRT"
    if (airportString.length === 3 && airportString === airportString.toUpperCase()) {
      return { code: airportString, city: airportString };
    }
    
    // Fallback
    return { code: airportString.substring(0, 3).toUpperCase(), city: airportString };
  };

  const getAirlineLogo = (airlineName) => {
    return `https://via.placeholder.com/40x40/667eea/ffffff?text=${airlineName?.charAt(0) || 'A'}`;
  };

  const getScrapedImage = (item, type) => {
    if (item && item.imageUrl) {
      return item.imageUrl;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop';
  };
  
  const plan = {
    destination: destination,
    duration: duration,
    travelers: parseInt(formData.travelers) || 1,
    budget: budget,
    flights: hasAIPlan && aiPlan.flights && aiPlan.flights.length >= 2 ? {
      outbound: {
        airline: aiPlan.flights[0].airline,
        flight: aiPlan.flights[0].flightNumber,
        from: aiPlan.flights[0].origin,
        to: aiPlan.flights[0].destination,
        departure: aiPlan.flights[0].departureTime,
        arrival: aiPlan.flights[0].arrivalTime,
        duration: aiPlan.flights[0].duration,
        price: aiPlan.flights[0].price
      },
      return: {
        airline: aiPlan.flights[1].airline,
        flight: aiPlan.flights[1].flightNumber,
        from: aiPlan.flights[1].destination,
        to: aiPlan.flights[1].origin,
        departure: aiPlan.flights[1].departureTime,
        arrival: aiPlan.flights[1].arrivalTime,
        duration: aiPlan.flights[1].duration,
        price: aiPlan.flights[1].price
      },
      allOptions: aiPlan.flights // Keep all options for later use
    } : {
      outbound: {
        airline: 'Royal Jordanian',
        flight: 'RJ 183',
        from: 'Amman (AMM)',
        to: destination.split(',')[0] + ' (' + destination.split(',')[0].substring(0, 3).toUpperCase() + ')',
        departure: '14:30',
        arrival: '17:45',
        duration: '6h 30m',
        price: Math.round(budget * 0.3)
      },
      return: {
        airline: 'Royal Jordanian',
        flight: 'RJ 184',
        from: destination.split(',')[0] + ' (' + destination.split(',')[0].substring(0, 3).toUpperCase() + ')',
        to: 'Amman (AMM)',
        departure: '18:20',
        arrival: '21:35',
        duration: '6h 30m',
        price: Math.round(budget * 0.3)
      }
    },
    hotel: hasAIPlan && aiPlan.hotels && aiPlan.hotels.length > 0 ? {
      name: aiPlan.hotels[0].name,
      rating: aiPlan.hotels[0].rating,
      location: aiPlan.hotels[0].location,
      pricePerNight: aiPlan.hotels[0].pricePerNight,
      totalPrice: aiPlan.hotels[0].totalPrice,
      amenities: aiPlan.hotels[0].amenities || ['WiFi', 'Restaurant']
    } : {
      name: `${destination.split(',')[0]} Grand Hotel`,
      rating: 4.5,
      location: `Central ${destination.split(',')[0]}`,
      pricePerNight: Math.round((budget * 0.4) / duration),
      totalPrice: Math.round(budget * 0.4),
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant']
    },
    activities: hasAIPlan && aiPlan.attractions ? aiPlan.attractions.slice(0, 4).map(attraction => ({
      name: attraction.name,
      type: attraction.category,
      duration: attraction.duration,
      price: attraction.price,
      description: attraction.description
    })) : [
      {
        name: `${destination.split(',')[0]} Walking Tour`,
        type: 'Cultural',
        duration: '3 hours',
        price: Math.round(budget * 0.1),
        description: `Explore ${destination.split(',')[0]} with a professional guide`
      },
      {
        name: 'Local Food Experience',
        type: 'Culinary', 
        duration: '4 hours',
        price: Math.round(budget * 0.15),
        description: 'Taste authentic local cuisine'
      }
    ]
  };

  // Calculate total cost based on data structure
  const calculateTotalCost = () => {
    let flightCost = 0;
    if (Array.isArray(plan.flights)) {
      flightCost = plan.flights.reduce((sum, flight) => sum + (flight.price || 0), 0);
    } else {
      flightCost = (plan.flights.outbound?.price || 0) + (plan.flights.return?.price || 0);
    }
    
    const hotelCost = plan.hotel.totalPrice || 0;
    const activitiesCost = plan.activities.reduce((sum, a) => sum + (a.price || 0), 0);
    
    return flightCost + hotelCost + activitiesCost;
  };
  
  const totalCost = calculateTotalCost();
  const formatPrice = (price) => `${price?.toLocaleString() || 0} JOD`;
  
  // Get AI recommendations if available
  const aiRecommendations = hasAIPlan ? formData.travelPlan.recommendations : null;
  const weatherInfo = hasAIPlan && aiPlan.weather ? aiPlan.weather : null;



  return (
    <div className="travel-plan-results">
      <div className="results-header">
        <h2>{t('travelResults.title')}</h2>
        <div className="trip-summary">
          <div className="trip-info">
            <span className="destination-name">{plan.destination}</span>
            <span className="trip-duration">{plan.duration} {t('travelResults.days')} • {plan.travelers} {t('travelResults.travelers')}</span>
          </div>
          <div className="total-cost">
            <span className="cost-label">{t('travelResults.totalCost')}</span>
            <span className="cost-amount">{formatPrice(totalCost)}</span>
          </div>
        </div>
      </div>

      <div className="plan-sections">
        {/* Flights Section */}
        <div className="plan-section flights-section">
          <div className="section-header">
            <div className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <h3>{t('travelResults.flights')}</h3>
            </div>
            <div className="section-cost">{formatPrice(plan.flights.outbound.price + plan.flights.return.price)}</div>
          </div>
          
          <div className="flights-container">
            {/* Outbound Flight */}
            <div className="flight-card">
              <div className="flight-header">
                <div className="airline-info">
                  <div className="airline-logo">
                    <img src={getAirlineLogo(plan.flights.outbound.airline)} alt={plan.flights.outbound.airline} className="airline-image" />
                  </div>
                  <div className="airline-details">
                    <span className="airline">{plan.flights.outbound.airline}</span>
                    <span className="flight-number">{plan.flights.outbound.flight}</span>
                  </div>
                </div>
                <span className="flight-price">{formatPrice(plan.flights.outbound.price)}</span>
              </div>
              <div className="flight-route">
                <div className="airport-info">
                  <span className="airport-code">{safeParseAirport(plan.flights.outbound.from).code}</span>
                  <span className="city">{safeParseAirport(plan.flights.outbound.from).city}</span>
                  <span className="time">{plan.flights.outbound.departure}</span>
                </div>
                <div className="flight-duration">
                  <span className="duration">{plan.flights.outbound.duration}</span>
                  <div className="flight-line"></div>
                </div>
                <div className="airport-info">
                  <span className="airport-code">{safeParseAirport(plan.flights.outbound.to).code}</span>
                  <span className="city">{safeParseAirport(plan.flights.outbound.to).city}</span>
                  <span className="time">{plan.flights.outbound.arrival}</span>
                </div>
              </div>
            </div>

            {/* Return Flight */}
            <div className="flight-card">
              <div className="flight-header">
                <div className="airline-info">
                  <div className="airline-logo">
                    <img src={getAirlineLogo(plan.flights.return.airline)} alt={plan.flights.return.airline} className="airline-image" />
                  </div>
                  <div className="airline-details">
                    <span className="airline">{plan.flights.return.airline}</span>
                    <span className="flight-number">{plan.flights.return.flight}</span>
                  </div>
                </div>
                <span className="flight-price">{formatPrice(plan.flights.return.price)}</span>
              </div>
              <div className="flight-route">
                <div className="airport-info">
                  <span className="airport-code">{safeParseAirport(plan.flights.return.from).code}</span>
                  <span className="city">{safeParseAirport(plan.flights.return.from).city}</span>
                  <span className="time">{plan.flights.return.departure}</span>
                </div>
                <div className="flight-duration">
                  <span className="duration">{plan.flights.return.duration}</span>
                  <div className="flight-line"></div>
                </div>
                <div className="airport-info">
                  <span className="airport-code">{safeParseAirport(plan.flights.return.to).code}</span>
                  <span className="city">{safeParseAirport(plan.flights.return.to).city}</span>
                  <span className="time">{plan.flights.return.arrival}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Section */}
        <div className="plan-section hotel-section">
          <div className="section-header">
            <div className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
              </svg>
              <h3>{t('travelResults.hotel')}</h3>
            </div>
            <div className="section-cost">{formatPrice(plan.hotel.totalPrice)}</div>
          </div>
          
          <div className="hotel-card">
            <div className="hotel-image-container">
              <img src={getScrapedImage(plan.hotel, 'hotel')} alt={plan.hotel.name} className="hotel-image" />
            </div>
            <div className="hotel-content">
              <div className="hotel-details">
                <h4 className="hotel-name">{plan.hotel.name}</h4>
                <div className="hotel-rating">
                  <div className="stars">
                    {[...Array(Math.floor(plan.hotel.rating))].map((_, i) => (
                      <svg key={i} className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="rating-number">{plan.hotel.rating}</span>
                </div>
                <div className="hotel-location">
                  <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {plan.hotel.location}
                </div>
              </div>
            
                          <div className="hotel-pricing">
                <div className="price-per-night">
                  <span className="price">{formatPrice(plan.hotel.pricePerNight)}</span>
                  <span className="period">{t('travelResults.pricePerNight')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="plan-section activities-section">
          <div className="section-header">
            <div className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3>{t('travelResults.activities')}</h3>
            </div>
            <div className="section-cost">{formatPrice(plan.activities.reduce((sum, a) => sum + a.price, 0))}</div>
          </div>
          
          <div className="activities-grid">
            {plan.activities.map((activity, index) => (
              <div key={index} className="activity-card">
                              <div className="activity-image-container">
                <img src={getScrapedImage(activity, 'activity')} alt={activity.name} className="activity-image" />
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4 className="activity-name">{activity.name}</h4>
                    <span className="activity-price">{formatPrice(activity.price)}</span>
                  </div>
                  <div className="activity-details">
                    <span className="activity-type">{activity.type}</span>
                    <div className="activity-duration">
                      <svg className="clock-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                      </svg>
                      {activity.duration}
                    </div>
                    <p className="activity-description">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={onBack} className="btn-secondary">
          ← {t('travelResults.backToForm')}
        </button>
        <button onClick={onNewPlan} className="btn-primary">
          {t('travelResults.newPlan')}
        </button>
      </div>
    </div>
  );
};

export default TravelPlanResults; 