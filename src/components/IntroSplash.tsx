import React from 'react';

const IntroSplash: React.FC = () => {
  return (
    <div className="intro-banner">
      <div className="intro-text">
        <span className="char-wrapper" style={{ transform: 'rotate(-25deg) translateY(25px)' }}>
          <span className="letter">C</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(-15deg) translateY(10px)' }}>
          <span className="letter">h</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(-5deg) translateY(2px)' }}>
          <span className="letter">a</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(0deg) translateY(0px)' }}>
          <span className="letter">r</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(5deg) translateY(2px)' }}>
          <span className="letter">t</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(15deg) translateY(10px)' }}>
          <span className="letter">i</span>
        </span>
        <span className="char-wrapper" style={{ transform: 'rotate(25deg) translateY(25px)' }}>
          <span className="letter">x</span>
        </span>
      </div>
    </div>
  );
};

export default IntroSplash;
