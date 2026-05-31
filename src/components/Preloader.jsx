import React, { useEffect } from 'react';

const Preloader = () => {
  useEffect(() => {
    // Basic preloader logic: hide after window load
    const handleLoad = () => {
      const preloader = document.getElementById('loading-screen');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div id="loading-screen" style={{ transition: 'opacity 0.5s ease' }}>
      <div className="preloader-inner">
        <div className="preloader-logo-entrance">
          <img src="/vajr-logo-new.jpg" alt="Vajr Jewels" className="preloader-logo-pulse" style={{ mixBlendMode: 'screen' }} />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
