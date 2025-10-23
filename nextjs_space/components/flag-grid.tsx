

'use client';

import Link from 'next/link';
import { countries } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function FlagGrid() {
  // Define rows with 4-3-4-3-4-3 pattern
  const rows = [
    countries.slice(0, 4),   // Row 1: 4 flags (US, Russia, China, Germany)
    countries.slice(4, 7),   // Row 2: 3 flags (France, UK, India)
    countries.slice(7, 11),  // Row 3: 4 flags (Turkey, Japan, South Korea, Brazil)
    countries.slice(11, 14), // Row 4: 3 flags (Canada, Australia, Italy)
    countries.slice(14, 18), // Row 5: 4 flags (Spain, Netherlands, Sweden, Switzerland)
    countries.slice(18, 21), // Row 6: 3 flags (Singapore, UAE, Saudi Arabia)
  ];

  return (
    <div className="flex flex-col items-center gap-16 mx-auto max-w-5xl">
      {rows.map((rowCountries, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="flex justify-center gap-16"
        >
          {rowCountries.map((country, countryIndex) => {
            const index = rowIndex * 4 + countryIndex;
            return (
              <motion.div
                key={country?.code || `flag-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={`/country/${country?.code?.toLowerCase()}`}
                  className="group relative block"
                >
                  <div className="w-56 h-56 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:border-blue-400 overflow-hidden">
                    <span className="text-[11rem] leading-none transition-transform duration-300">
                      {country?.flag}
                    </span>
                  </div>
                  
                  {/* Country name tooltip */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                      {country?.name}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
