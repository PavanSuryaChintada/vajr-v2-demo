import React from 'react';
import { PenTool, Diamond, Hammer, ShieldCheck } from 'lucide-react';

const Craftsmanship = () => {
  const processSteps = [
    {
      icon: <PenTool className="target-icon" size={32} />,
      title: "The Vision",
      desc: "Every masterpiece begins as a hand-drawn sketch, inspired by nature, architecture, and heritage."
    },
    {
      icon: <Diamond className="target-icon" size={32} />,
      title: "Stone Selection",
      desc: "We source only the top 1% of diamonds and gemstones, rigorously checked for cut, color, clarity, and carat."
    },
    {
      icon: <Hammer className="target-icon" size={32} />,
      title: "Master Crafting",
      desc: "Artisans with decades of experience mold gold and platinum, setting each stone by hand with microscopic precision."
    },
    {
      icon: <ShieldCheck className="target-icon" size={32} />,
      title: "Perfection",
      desc: "A rigorous 50-point inspection ensures the final piece meets the uncompromising VAJR standard."
    }
  ];

  return (
    <section id="craftsmanship" className="target-section target-craftsmanship">
      <div className="target-container">
        <div className="target-section-header">
          <span className="target-subheading">The Process</span>
          <h2 className="target-heading-center">Artistry in Motion</h2>
        </div>
        <div className="target-craft-grid">
          <div className="target-craft-line"></div>
          {processSteps.map((step, idx) => (
            <div key={idx} className="target-craft-item">
              <div className="target-craft-icon-wrap">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;
