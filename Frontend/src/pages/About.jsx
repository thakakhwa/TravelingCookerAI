import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollAnimationWrapper } from '../hooks/useScrollAnimation.jsx';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      {/* Page Header */}
      <ScrollAnimationWrapper animation="fadeInDown" duration={0.8} once={true}>
        <div className="page-header">
          <h1>{t('about.title')}</h1>
          <p className="lead">
            {t('about.lead')}
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* What We Do Section */}
      <section className="about-section">
        <ScrollAnimationWrapper animation="fadeInLeft" delay={0.1}>
          <div className="section-content">
            <h3>{t('about.whatWeDo.title')}</h3>
            <p>
              {t('about.whatWeDo.paragraph1')}
            </p>
            <p>
              {t('about.whatWeDo.paragraph2')}
            </p>
          </div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fadeInRight" delay={0.2}>
          <div className="section-image">
            <div className="image-placeholder">🗺️ Complete Trip Planning</div>
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* Why Choose Us Section */}
      <section className="about-section">
        <ScrollAnimationWrapper animation="fadeInLeft" delay={0.1}>
          <div className="section-image">
            <div className="image-placeholder">⭐ Expert Curation</div>
          </div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper animation="fadeInRight" delay={0.2}>
          <div className="section-content">
            <h3>{t('about.whyChoose.title')}</h3>
            <p>
              {t('about.whyChoose.paragraph1')}
            </p>
            <p>
              {t('about.whyChoose.paragraph2')}
            </p>
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* Our Services Grid */}
      <section className="services-section">
        <ScrollAnimationWrapper animation="fadeInUp" delay={0.1}>
          <h2>{t('about.services.title')}</h2>
        </ScrollAnimationWrapper>
        <div className="services-grid">
          <ScrollAnimationWrapper animation="cardSlideUp" delay={0.2}>
            <div className="service-card">
              <div className="service-icon">✈️</div>
              <h3>{t('about.services.flight.title')}</h3>
              <p>{t('about.services.flight.description')}</p>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper animation="cardSlideUp" delay={0.3}>
            <div className="service-card">
              <div className="service-icon">🏨</div>
              <h3>{t('about.services.accommodation.title')}</h3>
              <p>{t('about.services.accommodation.description')}</p>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper animation="cardSlideUp" delay={0.4}>
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>{t('about.services.experiences.title')}</h3>
              <p>{t('about.services.experiences.description')}</p>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper animation="cardSlideUp" delay={0.5}>
            <div className="service-card">
              <div className="service-icon">🍽️</div>
              <h3>{t('about.services.dining.title')}</h3>
              <p>{t('about.services.dining.description')}</p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollAnimationWrapper animation="bounceIn" delay={0.1}>
        <section className="cta-section">
          <h2>{t('about.cta.title')}</h2>
          <p>{t('about.cta.description')}</p>
          <a href="/" className="cta-button">{t('about.cta.button')}</a>
        </section>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default About; 