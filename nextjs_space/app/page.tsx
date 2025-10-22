
import { FlagGrid } from '@/components/flag-grid';

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
        </div>
      </div>

      {/* Flag Grid */}
      <div className="py-12 px-4">
        <FlagGrid />
      </div>
    </div>
  );
}
