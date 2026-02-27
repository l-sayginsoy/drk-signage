
import React from 'react';
import WeatherForecastWidget from './WeatherWidget';
import { WeatherData } from '../types';

interface BottomBarProps {
  weather: WeatherData;
  quote: string;
}

const BottomBar: React.FC<BottomBarProps> = ({ weather, quote }) => {
  return (
    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center px-[3.5vmin] bg-white text-black h-[10vmin] min-h-[60px] max-h-[100px]">
      <div className="flex justify-start">
        <WeatherForecastWidget weather={weather} />
      </div>
      <div className="min-w-0 px-4">
        <p className="font-semibold text-gray-700 text-center truncate" style={{ fontSize: 'clamp(0.8rem, 2.2vmin, 1.5rem)', lineHeight: '1.2' }}>"{quote}"</p>
      </div>
      <div className="flex justify-end">
        <img src="/assets/drk-logo.png" alt="Deutsches Rotes Kreuz Logo" className="h-[4.5vmin] min-h-[30px] max-h-[50px]" />
      </div>
    </div>
  );
};

export default BottomBar;
