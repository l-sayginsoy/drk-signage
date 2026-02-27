
import React from 'react';
import { WeatherType } from '../types';
import './WeatherBackground.css';

interface WeatherBackgroundProps {
  weatherType: WeatherType;
  hour: number;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType, hour }) => {
  const timeOfDay = (hour >= 6 && hour < 20) ? 'day' : 'night';
  const backgroundClass = `weather-bg ${weatherType} ${timeOfDay}`;

  return <div className={backgroundClass}></div>;
};

export default WeatherBackground;