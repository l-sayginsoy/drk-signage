
import React, { type FC } from 'react';
import { Sun, Cloud, CloudRain, CloudFog, Zap, Snowflake } from 'lucide-react';
import { WeatherData, WeatherType } from '../types';

interface WeatherForecastWidgetProps {
  weather: WeatherData;
  layout?: 'horizontal' | 'vertical';
  mode?: 'light' | 'dark'; // 'light' = white text (for dark bg), 'dark' = dark text (for light bg)
}

// Helper to get styled, filled icons
const getWeatherIcon = (type: WeatherType, sizeClass: string) => {
  // Common props for "filled" look
  const strokeWidth = 1.5;

  switch (type) {
    case 'sunny':
      return (
        <Sun 
          className={`${sizeClass} text-yellow-500`} 
          fill="#fbbf24" // Amber-400 fill
          strokeWidth={strokeWidth} 
        />
      );
    case 'rainy':
      return (
        <CloudRain 
          className={`${sizeClass} text-blue-500`} 
          fill="#dbeafe" // Blue-100 fill (subtle)
          strokeWidth={strokeWidth} 
        />
      );
    case 'snow':
      return (
        <Snowflake 
          className={`${sizeClass} text-cyan-400`} 
          fill="#cffafe" // Cyan-100 fill
          strokeWidth={strokeWidth} 
        />
      );
    case 'cloudy':
      return (
        <Cloud 
          className={`${sizeClass} text-gray-500`} 
          fill="#e5e7eb" // Gray-200 fill
          strokeWidth={strokeWidth} 
        />
      );
    case 'stormy':
      return (
        <Zap 
          className={`${sizeClass} text-yellow-600`} 
          fill="#ca8a04" // Yellow-600 fill
          strokeWidth={strokeWidth} 
        />
      );
    default:
      return (
        <CloudFog 
          className={`${sizeClass} text-gray-400`} 
          fill="#f3f4f6" 
          strokeWidth={strokeWidth} 
        />
      );
  }
};

const WeatherForecastWidget: FC<WeatherForecastWidgetProps> = ({ weather, layout = 'horizontal', mode = 'dark' }) => {
  const isVertical = layout === 'vertical';
  const textColor = mode === 'light' ? 'text-white' : 'text-[#34495e]';
  const dividerColor = mode === 'light' ? 'bg-white' : 'bg-[#34495e]';
  const iconColorSunny = mode === 'light' ? 'text-yellow-300' : 'text-yellow-500'; 
  // We can keep icon colors mostly same, maybe tweak sunny for contrast

  if (isVertical) {
     // ... (Vertical layout code - not currently used but keep for safety) ...
     return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 py-2">
        <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-2">
                 {getWeatherIcon(weather.type, 'w-12 h-12')}
            </div>
            <span className={`font-black leading-none tracking-tighter ${textColor} text-4xl`}>
                {weather.temperature}°
            </span>
            <span className={`font-bold uppercase tracking-wide mt-1 ${textColor} text-xs`}>
                LUDWIGSHAFEN
            </span>
        </div>
        <div className={`w-16 h-[1px] ${dividerColor} opacity-30 rounded-full`}></div>
        <div className="flex items-center justify-between w-full px-2">
          {weather.forecast.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-1">
              <span className={`font-bold ${textColor} leading-none text-xs`}>
                  {day.day}
              </span>
              {getWeatherIcon(day.type, 'w-6 h-6')}
              <span className={`font-bold ${textColor} leading-none text-sm`}>
                  {day.maxTemp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Layout
  return (
    <div className="flex items-center justify-end h-full w-full px-[1vw]">
      {/* Current Weather Section - Right Aligned */}
      <div className="flex flex-col items-start justify-center flex-shrink-0 h-full py-[1vh]">
        
        {/* Icon + Temp - Top Row */}
        <div className="flex items-center mb-[0.2vh]">
            <div className="mr-[0.8vw]">
                 {getWeatherIcon(weather.type, 'w-[3.5vh] h-[3.5vh]')}
            </div>
            <span className={`font-black tracking-tighter leading-none ${textColor}`} style={{ fontSize: '4vh' }}>
                {weather.temperature}°
            </span>
        </div>

        {/* Location - Bottom */}
        <span className={`font-bold uppercase tracking-wide ${textColor}`} style={{ fontSize: '1.2vh' }}>
            LUDWIGSHAFEN
        </span>
      </div>
      
      {/* Vertical Divider */}
      <div className={`w-[1px] h-[50%] ${dividerColor} opacity-20 rounded-full mx-[1.5vw] hidden md:block flex-shrink-0`}></div>
      
      {/* Forecast Section */}
      <div className="flex items-center justify-end space-x-[1.5vw] h-full">
        {weather.forecast.map((day) => (
          <div key={day.day} className="flex flex-col items-center justify-center gap-[0.3vh] h-full">
            <span className={`font-bold ${textColor} leading-none`} style={{ fontSize: '1.2vh' }}>
                {day.day}
            </span>
            {getWeatherIcon(day.type, 'w-[2.5vh] h-[2.5vh]')}
            <span className={`font-bold ${textColor} leading-none`} style={{ fontSize: '1.6vh' }}>
                {day.maxTemp}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastWidget;
