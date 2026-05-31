import React, { useEffect, useRef } from 'react';

const showroomsData = [
  {
    id: 'sr-hyderabad',
    city: 'Hyderabad',
    address: 'Banjara Hills, Road No. 12',
    phone: '+91 40 2345 6789',
    hours: 'Mon – Sat: 10AM – 8PM',
    tag: 'Flagship',
    image: '/showroom.png',
  },
  {
    id: 'sr-mumbai',
    city: 'Mumbai',
    address: 'Warden Road, Breach Candy',
    phone: '+91 22 2367 4567',
    hours: 'Mon – Sat: 11AM – 8PM',
    tag: 'Boutique',
    image: '/gold_necklace.png',
  },
  {
    id: 'sr-delhi',
    city: 'New Delhi',
    address: 'Taj Mansingh, Connaught Place',
    phone: '+91 11 2301 9876',
    hours: 'Mon – Sun: 10AM – 9PM',
    tag: 'Luxury Suite',
    image: '/craftsmanship_hero.png',
  },
];

const Showrooms = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.sr-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="showrooms" className="sr-section" ref={sectionRef} aria-label="Our Showrooms">
      <div className="sr-inner">
        {/* Header */}
        <div className="sr-header">
          <span className="sr-eyebrow">Visit Us</span>
          <h2 className="sr-title">
            Our <em>Showrooms</em>
          </h2>
          <p className="sr-subtitle">
            Step into the world of VAJR. Each boutique is designed as an immersive
            sanctuary — where every surface reflects our obsession with perfection.
          </p>
        </div>

        {/* Cards */}
        <div className="sr-grid">
          {showroomsData.map((sr, i) => (
            <article
              key={sr.id}
              id={sr.id}
              className="sr-card"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="sr-card-image">
                <img src={sr.image} alt={`VAJR ${sr.city} Showroom`} className="sr-card-img" />
                <div className="sr-card-img-overlay"></div>
                <span className="sr-tag">{sr.tag}</span>
              </div>
              <div className="sr-card-body">
                <h3 className="sr-card-city">{sr.city}</h3>
                <p className="sr-card-address">{sr.address}</p>
                <div className="sr-card-meta">
                  <span className="sr-card-hours">{sr.hours}</span>
                  <a href={`tel:${sr.phone.replace(/\s/g, '')}`} className="sr-card-phone">{sr.phone}</a>
                </div>
                <a href="#" className="sr-card-cta" aria-label={`Get directions to VAJR ${sr.city}`}>
                  Get Directions →
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="sr-cta-banner">
          <div className="sr-cta-text">
            <p className="sr-cta-label">Private Consultations Available</p>
            <h3 className="sr-cta-heading">Book a Personal Viewing</h3>
          </div>
          <a href="#" className="sr-cta-btn" id="showrooms-book-btn">
            Reserve Your Time
          </a>
        </div>
      </div>
    </section>
  );
};

export default Showrooms;
