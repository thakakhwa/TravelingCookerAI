import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Only stop observing if explicitly set to once
          if (options.once === true) {
            observer.unobserve(entry.target);
          }
        } else {
          // Allow re-triggering by default unless once is true
          if (options.once !== true) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px 0px -100px 0px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.once, options.threshold, options.rootMargin]);

  return [ref, isVisible];
};

// Higher-order component for easy use
export const ScrollAnimationWrapper = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  once = false,
  threshold = 0.15,
  rootMargin = '0px 0px -100px 0px',
  ...restOptions 
}) => {
  const [ref, isVisible] = useScrollAnimation({ 
    once, 
    threshold, 
    rootMargin, 
    ...restOptions 
  });

  return (
    <div
      ref={ref}
      className={`scroll-animation ${animation} ${isVisible ? 'visible' : ''}`}
      style={{
        '--animation-delay': `${delay}s`,
        '--animation-duration': `${duration}s`
      }}
    >
      {children}
    </div>
  );
}; 