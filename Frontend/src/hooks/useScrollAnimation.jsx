import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Always stop observing after first trigger unless explicitly set to repeat
          if (options.repeat !== true) {
            observer.unobserve(entry.target);
          }
        } else if (options.repeat === true && !entry.isIntersecting) {
          // Only allow disappearing if repeat is explicitly true
          setIsVisible(false);
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
  }, [isVisible, options.repeat, options.threshold, options.rootMargin]);

  return [ref, isVisible];
};

// Higher-order component for easy use
export const ScrollAnimationWrapper = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  repeat = false,
  threshold = 0.15,
  rootMargin = '0px 0px -100px 0px',
  ...restOptions 
}) => {
  const [ref, isVisible] = useScrollAnimation({ 
    repeat, 
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