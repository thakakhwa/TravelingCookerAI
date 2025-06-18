import React, { useEffect } from 'react';
import './FlyingAirplanes.css';

const BackgroundAnimations = () => {
  useEffect(() => {
    // Function to generate random position
    const getRandomPosition = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Function to set random positions for all elements
    const setRandomPositions = () => {
      // Orbs
      const orbs = document.querySelectorAll('.floating-orb');
      orbs.forEach((orb, index) => {
        const top = getRandomPosition(5, 85);
        const left = getRandomPosition(5, 85);
        orb.style.top = `${top}%`;
        orb.style.left = `${left}%`;
        // Restart animation
        orb.style.animation = 'none';
        // Trigger reflow
        void orb.offsetWidth;
        orb.style.animation = '';
      });

      // Gradients
      const gradients = document.querySelectorAll('.floating-gradient');
      gradients.forEach((gradient, index) => {
        const top = getRandomPosition(5, 85);
        const left = getRandomPosition(5, 85);
        gradient.style.top = `${top}%`;
        gradient.style.left = `${left}%`;
        // Restart animation
        gradient.style.animation = 'none';
        void gradient.offsetWidth;
        gradient.style.animation = '';
      });

      // Triangles
      const triangles = document.querySelectorAll('.triangle1, .triangle2');
      triangles.forEach((triangle, index) => {
        const top = getRandomPosition(10, 80);
        const left = getRandomPosition(10, 80);
        triangle.style.top = `${top}%`;
        triangle.style.left = `${left}%`;
        // Restart animation
        triangle.style.animation = 'none';
        void triangle.offsetWidth;
        triangle.style.animation = '';
      });

      // Diamonds
      const diamonds = document.querySelectorAll('.diamond1, .diamond2');
      diamonds.forEach((diamond, index) => {
        const top = getRandomPosition(10, 80);
        const left = getRandomPosition(10, 80);
        diamond.style.top = `${top}%`;
        diamond.style.left = `${left}%`;
        // Restart animation
        diamond.style.animation = 'none';
        void diamond.offsetWidth;
        diamond.style.animation = '';
      });

      // Particles
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const top = getRandomPosition(15, 75);
        const left = getRandomPosition(15, 75);
        particle.style.top = `${top}%`;
        particle.style.left = `${left}%`;
        // Restart animation
        particle.style.animation = 'none';
        void particle.offsetWidth;
        particle.style.animation = '';
      });
    };

    // Set random positions when component mounts
    setRandomPositions();
  }, []);

  return (
    <div className="background-animations-container" aria-hidden="true">
      {/* Floating orbs */}
      <div className="floating-orb orb1"></div>
      <div className="floating-orb orb2"></div>
      <div className="floating-orb orb3"></div>
      <div className="floating-orb orb4"></div>
      <div className="floating-orb orb5"></div>
      
      {/* Gradient waves */}
      <div className="floating-gradient gradient1"></div>
      <div className="floating-gradient gradient2"></div>
      <div className="floating-gradient gradient3"></div>
      
      {/* Geometric shapes */}
      <div className="floating-shape triangle1"></div>
      <div className="floating-shape triangle2"></div>
      <div className="floating-shape diamond1"></div>
      <div className="floating-shape diamond2"></div>
      
      {/* Particle dots */}
      <div className="particle particle1"></div>
      <div className="particle particle2"></div>
      <div className="particle particle3"></div>
      <div className="particle particle4"></div>
      <div className="particle particle5"></div>
      <div className="particle particle6"></div>
    </div>
  );
};

export default BackgroundAnimations;
