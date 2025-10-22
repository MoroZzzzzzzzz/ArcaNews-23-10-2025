
'use client';

import Link from 'next/link';
import { countries } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function FlagGrid() {
  // Define the flag layout based on the photo - staggered pattern
  const flagPositions = [
    // Row 1 (top)
    { country: countries[0], gridArea: '1 / 8 / 2 / 9' }, // US
    
    // Row 2
    { country: countries[1], gridArea: '2 / 6 / 3 / 7' }, // Russia
    { country: countries[2], gridArea: '2 / 9 / 3 / 10' }, // China
    { country: countries[3], gridArea: '2 / 11 / 3 / 12' }, // Germany
    
    // Row 3
    { country: countries[4], gridArea: '3 / 4 / 4 / 5' }, // France
    { country: countries[5], gridArea: '3 / 7 / 4 / 8' }, // UK
    { country: countries[6], gridArea: '3 / 10 / 4 / 11' }, // India
    { country: countries[7], gridArea: '3 / 12 / 4 / 13' }, // Turkey
    
    // Row 4
    { country: countries[8], gridArea: '4 / 2 / 5 / 3' }, // Japan
    { country: countries[9], gridArea: '4 / 5 / 5 / 6' }, // South Korea
    { country: countries[10], gridArea: '4 / 8 / 5 / 9' }, // Brazil
    { country: countries[11], gridArea: '4 / 11 / 5 / 12' }, // Canada
    { country: countries[12], gridArea: '4 / 13 / 5 / 14' }, // Australia
    
    // Row 5
    { country: countries[13], gridArea: '5 / 1 / 6 / 2' }, // Italy
    { country: countries[14], gridArea: '5 / 4 / 6 / 5' }, // Spain
    { country: countries[15], gridArea: '5 / 6 / 6 / 7' }, // Netherlands
    { country: countries[16], gridArea: '5 / 9 / 6 / 10' }, // Sweden
    { country: countries[17], gridArea: '5 / 12 / 6 / 13' }, // Switzerland
    { country: countries[18], gridArea: '5 / 14 / 6 / 15' }, // Singapore
    
    // Row 6 (bottom)
    { country: countries[19], gridArea: '6 / 3 / 7 / 4' }, // UAE
    { country: countries[20], gridArea: '6 / 7 / 7 / 8' }, // Saudi Arabia
  ];

  return (
    <div 
      className="grid gap-4 mx-auto"
      style={{
        gridTemplateColumns: 'repeat(15, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        maxWidth: '900px',
        height: '400px'
      }}
    >
      {flagPositions.map(({ country, gridArea }, index) => (
        <motion.div
          key={country?.code || `flag-${index}`}
          style={{ gridArea }}
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href={`/country/${country?.code?.toLowerCase()}`}
            className="group relative"
          >
            <div className="w-16 h-12 sm:w-20 sm:h-16 bg-white border-2 border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:border-blue-300">
              <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">
                {country?.flag}
              </span>
            </div>
            
            {/* Country name tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                {country?.name}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
