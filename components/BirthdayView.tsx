
import React from 'react';
import { motion } from 'framer-motion';
import { Cake } from 'lucide-react';
import { Resident } from '../types';

interface BirthdayViewProps {
  residents: Resident[];
}

const BirthdayView: React.FC<BirthdayViewProps> = ({ residents }) => {
  // We assume only one or two residents have birthday, we show the first one or map them
  // For simplicity in this layout, we take the first one. 
  // If multiple people have birthdays, one could cycle through them or list them.
  const resident = residents[0];
  
  const birthYear = new Date(resident.birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-center p-8 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20">
         {/* Simple CSS-based pattern dots */}
         <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-yellow-300 animate-bounce" style={{ animationDuration: '3s' }}></div>
         <div className="absolute top-20 right-20 w-6 h-6 rounded-full bg-blue-300 animate-bounce" style={{ animationDuration: '4s' }}></div>
         <div className="absolute bottom-10 left-1/4 w-10 h-10 rounded-full bg-green-300 animate-bounce" style={{ animationDuration: '3.5s' }}></div>
         <div className="absolute bottom-32 right-10 w-5 h-5 rounded-full bg-red-300 animate-bounce" style={{ animationDuration: '2.5s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 bg-white/10 backdrop-blur-md border border-white/30 p-10 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col items-center"
      >
        <div className="bg-white text-purple-600 p-6 rounded-full mb-6 shadow-lg">
            <Cake size={64} />
        </div>

        <h2 className="text-white font-medium uppercase tracking-widest mb-4 text-2xl drop-shadow-md">
            Wir gratulieren herzlich
        </h2>

        <h1 className="text-white font-black leading-tight mb-6 drop-shadow-xl" style={{ fontSize: 'clamp(2.5rem, 5vmin, 4rem)' }}>
            {resident.firstName} {resident.lastName}
        </h1>

        {resident.hideAge ? (
             <div className="text-white font-bold text-3xl drop-shadow-md">
                 zum Geburtstag!
             </div>
        ) : (
             <div className="text-white font-bold text-3xl drop-shadow-md flex flex-col items-center">
                 <span>zum</span>
                 <span className="text-6xl my-2 text-yellow-300 font-black">{age}.</span>
                 <span>Geburtstag!</span>
             </div>
        )}
      </motion.div>
    </div>
  );
};

export default BirthdayView;
