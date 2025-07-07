import {useEffect, useState} from 'react';
import arrowup from '~/assets/images/arrowup.svg';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-12 z-10 bg-[#2B8C57] hover:bg-[black] p-3 cursor-pointer transition-all duration-500 ease-out 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      aria-label="Scroll to top"
      style={{ transform: 'translateZ(0)' }} // GPU acceleration
    >
      <img
        src={arrowup}
        alt="Scroll to top"
        className="w-4 h-4 hover:scale-110 transition-transform"
      />
    </button>
  );
}
