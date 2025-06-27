import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
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
        <h1>{t('contact.title')}</h1>
        <p className="lead">{t('contact.lead')}</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-section">
            <h2>{t('contact.partnerships.title')}</h2>
            <p>
              {t('contact.partnerships.description')}
            </p>
          </div>
          
          <div className="ai-benefits">
            <h3>{t('contact.benefits.title')}</h3>
            <ul className="benefits-list">
              <li>{t('contact.benefits.benefit1')}</li>
              <li>{t('contact.benefits.benefit2')}</li>
              <li>{t('contact.benefits.benefit3')}</li>
              <li>{t('contact.benefits.benefit4')}</li>
              <li>{t('contact.benefits.benefit5')}</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h3>{t('contact.contactInfo.title')}</h3>
            <p>{t('contact.contactInfo.email')}</p>
            <p>{t('contact.contactInfo.phone')}</p>
            <p>{t('contact.contactInfo.hours')}</p>
            <p>{t('contact.contactInfo.response')}</p>
          </div>
        </div>
        
        <div className="contact-form-container">
          {!submitted ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <span className="ai-form-badge">{t('contact.form.title')}</span>
                <p>{t('contact.form.description')}</p>
              </div>
            
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('contact.form.fullName')}</label>
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
                  <label htmlFor="email">{t('contact.form.businessEmail')}</label>
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
                  <label htmlFor="phone">{t('contact.form.phoneNumber')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">{t('contact.form.company')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('contact.form.companyPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="inquiryType">{t('contact.form.inquiryType')}</label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                >
                  <option value="partnership">{t('contact.form.inquiryOptions.partnership')}</option>
                  <option value="sponsorship">{t('contact.form.inquiryOptions.sponsorship')}</option>
                  <option value="investment">{t('contact.form.inquiryOptions.investment')}</option>
                  <option value="supplier">{t('contact.form.inquiryOptions.supplier')}</option>
                  <option value="media">{t('contact.form.inquiryOptions.media')}</option>
                  <option value="other">{t('contact.form.inquiryOptions.other')}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('contact.form.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder={t('contact.form.messagePlaceholder')}
                  required
                />
              </div>
              
              <button type="submit" className="submit-button">
                <span className="ai-icon">🤝</span>
                {t('contact.form.submit')}
              </button>
            </form>
          ) : (
            <div className="success-message">
              <h2>{t('contact.form.success.title')}</h2>
              <p>{t('contact.form.success.description')}</p>
              <button onClick={() => setSubmitted(false)} className="reset-button">
                {t('contact.form.success.button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact; 