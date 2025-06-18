import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'partnership',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Business inquiry data:', formData);
    // Here we would typically send the data to an API
    setSubmitted(true);
  };
  
  return (
    <div className="contact-container">
      <div className="page-header">
        <h1>Partner With Us</h1>
        <p className="lead">Join forces with TravelingCooker to grow your business and reach more travelers</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h2>Business Partnerships & Opportunities</h2>
            <p>
              TravelingCooker is always looking for strategic partnerships with hotels, airlines, 
              restaurants, tour operators, and other travel-related businesses. We also welcome 
              sponsorship opportunities and investment inquiries.
            </p>
          </div>
          
          <div className="ai-benefits">
            <h3>Partnership Benefits</h3>
            <ul className="benefits-list">
              <li>Access to our growing customer base</li>
              <li>Featured placement in our AI recommendations</li>
              <li>Revenue sharing opportunities</li>
              <li>Co-marketing and promotional campaigns</li>
              <li>Analytics and customer insights</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h3>Contact Information</h3>
            <p>Business Email: partnerships@travelingcooker.com</p>
            <p>Phone: (555) 123-4567</p>
            <p>Business Hours: Monday-Friday, 9am-6pm EST</p>
            <p>Response Time: We typically respond within 24-48 hours</p>
          </div>
        </div>
        
        <div className="contact-form-container">
          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <span className="ai-form-badge">Business Inquiry</span>
                <p>Tell us about your business and how we can work together</p>
              </div>
            
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Business Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">Company/Organization</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your business name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="inquiryType">Type of Inquiry *</label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                >
                  <option value="partnership">Business Partnership</option>
                  <option value="sponsorship">Sponsorship Opportunity</option>
                  <option value="investment">Investment Inquiry</option>
                  <option value="supplier">Become a Service Provider</option>
                  <option value="media">Media & Press</option>
                  <option value="other">Other Business Inquiry</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Proposal or Inquiry *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Please describe your business, partnership idea, or inquiry in detail. Include any relevant information about your company, services, or proposal."
                  required
                />
              </div>
              
              <button type="submit" className="submit-button">
                <span className="ai-icon">🤝</span>
                Submit Business Inquiry
              </button>
            </form>
          ) : (
            <div className="success-message">
              <h2>Inquiry Received!</h2>
              <p>Thank you for your interest in partnering with TravelingCooker. Our business development team will review your inquiry and get back to you within 24-48 hours.</p>
              <button onClick={() => setSubmitted(false)} className="reset-button">
                Submit Another Inquiry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact; 