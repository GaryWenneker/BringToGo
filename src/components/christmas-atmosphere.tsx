import type { CSSProperties } from 'react';

// Fixed positions avoid hydration differences and keep snowfall extremely lightweight.
const flakes = Array.from({ length: 38 }, (_, index) => {
  const left = (index * 37 + 11) % 100;
  const size = 2 + ((index * 7) % 6);
  const drift = ((index * 17) % 90) - 45;
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.28 + ((index * 13) % 55) / 100,
    animationDelay: `-${(index * 11) % 23}s`,
    animationDuration: `${13 + ((index * 7) % 19)}s`,
    '--drift': `${drift}px`,
  } as CSSProperties;
});

export default function ChristmasAtmosphere() {
  return (
    <div className="christmas-atmosphere" aria-hidden="true">
      <div className="christmas-garland" />
      <div className="christmas-lights">
        {Array.from({ length: 14 }, (_, i) => (
          <span className="light-drop" key={i} style={{ '--bulb': i % 3 === 0 ? '#ffe5b4' : '#ffd18a', '--twinkle-delay': `${-i * 0.43}s` } as CSSProperties}>
            <i />
          </span>
        ))}
      </div>
      <span className="hanging-star star-left">✦</span>
      <span className="hanging-star star-right">★</span>
      <div className="falling-snow">
        {flakes.map((style, index) => <i className="snow-particle" style={style} key={index} />)}
      </div>
    </div>
  );
}
