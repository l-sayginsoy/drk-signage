
import React, { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/display');
    }, 10000); // 10 seconds

    // Cleanup function to clear the timeout if the component unmounts
    // or if the user navigates away manually by clicking a button.
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    // pb-32 moves the vertical center upwards, effectively moving the logo higher
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center pb-32">
      <div className="text-center flex flex-col items-center">
        {/* Vertical Stack for Logo and Title */}
        {/* Changed items-center to items-start so logo aligns with the start of the text */}
        <div className="flex flex-col items-start justify-center space-y-10 mb-12">
            {/* Logo container */}
            <div className="h-14 flex items-center justify-center">
                <img src="/assets/drk-logo.png" alt="DRK Logo" className="h-full w-auto object-contain"/>
            </div>
            {/* Reduced text size from text-5xl to text-3xl */}
            <h1 className="text-3xl font-bold text-gray-800 text-center">Pflegeheim In der Melm</h1>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/display')}
            className="px-10 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors text-xl"
          >
            Zur Anzeige
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-10 py-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors text-xl"
          >
            Zum Admin-Bereich
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
