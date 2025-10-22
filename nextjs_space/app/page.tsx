
import { FlagGrid } from '@/components/flag-grid';
import { getTranslation } from '@/lib/i18n';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Calligraphic Banner */}
      <div className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-black mb-4 tracking-wide">
            <span 
              className="inline-block" 
              style={{
                fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "0.05em"
              }}
            >
              Arcadia News
            </span>
          </h1>
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
            Global News from Every Corner of the World
          </p>
        </div>
      </div>

      {/* Flag Grid */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-700 text-lg mb-12">
            Select a country to view news
          </p>
          <FlagGrid />
        </div>
      </div>

      {/* Additional Info */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Discover News in Your Language
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Arcadia News brings you authentic journalism from 21 countries in multiple languages. 
            Engage with content through our blockchain-powered system and earn ACD tokens for your participation.
          </p>
        </div>
      </div>
    </div>
  );
}
