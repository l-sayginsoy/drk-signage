import { type FC } from 'react';
import { WeatherType } from '../types';
import './WeatherEffect.css';

interface WeatherEffectProps {
  weatherType: WeatherType;
}

const WeatherEffect: FC<WeatherEffectProps> = ({ weatherType }) => {
  const renderEffect = () => {
    switch (weatherType) {
      case 'rainy':
        return (
          <div className="rain">
            {/* Mehr Regentropfen für realistischeren Effekt */}
            {Array.from({ length: 150 }).map((_, i) => (
              <i key={i} className="drop"></i>
            ))}
          </div>
        );
      case 'snow':
         return (
          <div className="snow">
            {/* Mehr Schneeflocken mit verschiedenen Größen */}
            {Array.from({ length: 100 }).map((_, i) => (
              <i key={i} className="flake"></i>
            ))}
          </div>
        );
      case 'stormy':
        return (
          <div className="storm">
            {/* Schwerer Regen + gelegentliche Blitze */}
            {Array.from({ length: 200 }).map((_, i) => (
              <i key={i} className="storm-drop"></i>
            ))}
            <div className="lightning-container">
              <div className="lightning"></div>
            </div>
          </div>
        );
      case 'sunny':
        return (
          <div className="sunny-effect">
            {/* Subtile Lichtstrahlen und schwebende Partikel */}
            <div className="sunrays"></div>
            <div className="dust-particles">
              {Array.from({ length: 20 }).map((_, i) => (
                <i key={i} className="particle"></i>
              ))}
            </div>
          </div>
        );
      case 'cloudy':
        // Bei bewölktem Wetter minimale schwebende Partikel
        return (
          <div className="cloudy-effect">
            <div className="mist-particles">
              {Array.from({ length: 10 }).map((_, i) => (
                <i key={i} className="mist"></i>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="weather-effect-container">{renderEffect()}</div>;
};

export default WeatherEffect;
