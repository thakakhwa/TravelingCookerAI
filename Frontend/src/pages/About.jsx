import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t('about.title')}</h1>
        <p className="lead">
          {t('about.lead')}
        </p>
      </div>

      {/* What We Do Section */}
      <section className="about-section">
        <div className="section-content">
          <h3>{t('about.whatWeDo.title')}</h3>
          <p>
            {t('about.whatWeDo.paragraph1')}
          </p>
          <p>
            {t('about.whatWeDo.paragraph2')}
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
          <h3>{t('about.whyChoose.title')}</h3>
          <p>
            {t('about.whyChoose.paragraph1')}
          </p>
          <p>
            {t('about.whyChoose.paragraph2')}
          </p>
        </div>
      </section>

      {/* Our Services Grid */}
      <section className="services-section">
        <h2>{t('about.services.title')}</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">✈️</div>
            <h3>{t('about.services.flight.title')}</h3>
            <p>{t('about.services.flight.description')}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏨</div>
            <h3>{t('about.services.accommodation.title')}</h3>
            <p>{t('about.services.accommodation.description')}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎯</div>
            <h3>{t('about.services.experiences.title')}</h3>
            <p>{t('about.services.experiences.description')}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🍽️</div>
            <h3>{t('about.services.dining.title')}</h3>
            <p>{t('about.services.dining.description')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>{t('about.cta.title')}</h2>
        <p>{t('about.cta.description')}</p>
        <a href="/" className="cta-button">{t('about.cta.button')}</a>
      </section>
    </div>
  );
};

export default About; 