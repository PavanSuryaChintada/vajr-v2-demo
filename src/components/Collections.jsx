import React from 'react';

const Collections = () => {
  const cards = [
    { title: "Diamond Collection", image: "/diamond_rings.png" },
    { title: "Emerald Collection", image: "/collection_featured.png" },
    { title: "Bridal Collection", image: "/bridal_collection.png" },
    { title: "Heritage Collection", image: "/gold_necklace.png" },
    { title: "Daily Luxury", image: "/waist_chain.png" },
    { title: "Signature Collection", image: "/showroom.png" }
  ];

  return (
    <section id="collections" className="target-section target-collections">
      <div className="target-container">
        <div className="target-section-header">
          <span className="target-subheading">Curated Brilliance</span>
          <h2 className="target-heading-center">Featured Collections</h2>
        </div>
        <div className="target-collections-grid">
          {cards.map((card, index) => (
            <div key={index} className="target-collection-card group">
              <div className="target-card-bg">
                <img alt={card.title} src={card.image} className="target-img-cover" />
                <div className="target-card-gradient"></div>
              </div>
              <div className="target-card-border"></div>
              <div className="target-card-content">
                <h3>{card.title}</h3>
                <span className="target-card-explore">Explore &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
