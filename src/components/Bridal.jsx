import React from 'react';

const Bridal = () => {
  return (
    <section id="bridal" className="target-section target-bridal">
      <div className="target-bridal-bg">
        <img alt="Bridal Collection" src="/bridal_collection.png" className="target-img-cover" />
        <div className="target-bridal-overlay"></div>
      </div>
      <div className="target-bridal-content">
        <h2 className="target-bridal-heading">
          The Bridal <br /><span className="target-gold-italic">Collection</span>
        </h2>
        <p className="target-bridal-text">
          For the day you become a legend. Exquisite sets designed to echo through
          generations.
        </p>
        <a href="#appointment" className="target-btn">Explore Bridal</a>
      </div>
    </section>
  );
};

export default Bridal;
