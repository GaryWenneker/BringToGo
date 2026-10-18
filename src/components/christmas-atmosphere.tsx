import type { CSSProperties } from 'react';

/**
 * Photographic-feeling snowfall uses three layers of flakes: far-away points,
 * soft near-camera snow and visibly shaped ice crystals. All positions and
 * durations are deterministic to prevent hydration differences.
 */
const flakes = Array.from({ length: 112 }, (_, index) => {
  const lane = (index * 47.31 + (index % 9) * 7.1) % 100;
  const layer = index % 9;
  const crystal = layer === 3 || layer === 8;
  const soft = layer === 1 || layer === 6;
  const size = crystal ? 11 + (index % 4) * 3 : soft ? 9 + (index % 5) * 3 : 3 + (index % 6);
  const drift = ((index * 23) % 170) - 85;
  const duration = (soft ? 8 : crystal ? 12 : 16) + (index * 11) % 16;
  return {
    className: `snow-particle ${crystal ? 'snow-crystal' : soft ? 'snow-soft' : 'snow-small'}`,
    style: {
      left: `${lane}%`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: crystal ? 0.65 + (index % 3) * .1 : soft ? .30 + (index % 4) * .10 : .52 + (index % 5) * .09,
      animationDelay: `-${(index * 13) % 27}s`,
      animationDuration: `${duration}s`,
      '--drift': `${drift}px`,
      '--sway': `${24 + (index * 5) % 64}px`,
      '--spin': `${((index * 37) % 160) - 80}deg`,
      '--rest-top': `${5 + ((index * 31) % 89)}vh`,
    } as CSSProperties,
  };
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
        {flakes.map((flake, index) => <i className={flake.className} style={flake.style} key={index} />)}
      </div>
    </div>
  );
}
