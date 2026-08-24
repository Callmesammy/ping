import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Compass, ThumbsUp } from 'lucide-react';

interface MapVenue {
  id: string;
  name: string;
  category: string;
  address: string;
  votes: number;
  lat: number;
  lng: number;
  tag: string;
  price: string;
}

const VENUE_COORDINATES: MapVenue[] = [
  {
    id: 'v1',
    name: 'Overstory Rooftop Lounge',
    category: 'Cocktails & Sunset Views',
    address: '152 Pine Street, Downtown',
    votes: 5,
    lat: 40.7081,
    lng: -74.0089,
    tag: 'LEADER',
    price: '$$$',
  },
  {
    id: 'v2',
    name: 'Tacos & Mezcal Social',
    category: 'Late Night Tacos & Birria',
    address: '88 Mercado Way',
    votes: 4,
    lat: 40.7128,
    lng: -74.0060,
    tag: 'HOT',
    price: '$$',
  },
  {
    id: 'v3',
    name: 'Neon Arcade & Underground Bar',
    category: 'Pinball & Draft Beer',
    address: '404 Cyber Lane',
    votes: 3,
    lat: 40.7150,
    lng: -73.9980,
    tag: 'VIBES',
    price: '$',
  },
];

interface InteractiveMapProps {
  onSelectVenue?: (id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onSelectVenue }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<MapVenue | null>(VENUE_COORDINATES[0]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map on downtown NYC coordinates
    const map = L.map(mapContainerRef.current, {
      center: [40.7128, -74.0060],
      zoom: 14,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Clean CartoDB Voyager map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    // Add sleek flat markers for each venue
    VENUE_COORDINATES.forEach((venue) => {
      const isLeader = venue.tag === 'LEADER';

      const customIcon = L.divIcon({
        className: 'custom-flat-marker',
        html: `
          <div style="
            background-color: ${isLeader ? '#00E676' : '#F04C7E'};
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            border: 2px solid #ffffff;
            box-shadow: 0px 4px 14px rgba(0,0,0,0.18);
            font-family: 'Inter', sans-serif;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            <span>📍</span>
            <span>${venue.name} (${venue.votes})</span>
          </div>
        `,
        iconSize: [140, 32],
        iconAnchor: [70, 16],
      });

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedVenue(venue);
        if (onSelectVenue) onSelectVenue(venue.id);
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onSelectVenue]);

  return (
    <div className="bg-white text-[#0A542E] p-6 sm:p-8 rounded-[36px] border border-white/40 shadow-2xl space-y-6 my-8">
      
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-sans font-bold text-[#F04C7E] uppercase tracking-widest block mb-1">
            CARTE INTERACTIVE • SPOTS
          </span>
          <h3 className="font-foudre font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0A542E] flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#F04C7E]" />
            EXPLORE NEIGHBORHOOD VENUES
          </h3>
        </div>

        <span className="px-4 py-2 bg-[#FCEEE9] text-[#0A542E] font-sans font-bold text-xs rounded-full border border-[#F04C7E]/20">
          Live Interactive Pins
        </span>
      </div>

      {/* Clean Full-Width Map Canvas Container (No black borders or artificial dark boxes) */}
      <div className="relative w-full h-[440px] rounded-[28px] overflow-hidden border border-black/10 shadow-lg">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Selected Venue Details Popup Overlay */}
        {selectedVenue && (
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-white text-[#0A542E] p-5 rounded-[24px] border border-black/10 shadow-2xl z-20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-0.5 bg-[#00E676] text-[#0A542E] font-sans font-black text-[10px] uppercase rounded-full">
                {selectedVenue.tag}
              </span>
              <span className="text-xs font-mono font-bold text-[#F04C7E]">
                {selectedVenue.price}
              </span>
            </div>

            <h4 className="font-foudre font-black text-2xl uppercase text-[#0A542E] leading-none">
              {selectedVenue.name}
            </h4>
            <p className="text-xs font-sans font-semibold text-[#0A542E]/70 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0A542E]" /> {selectedVenue.address}
            </p>

            <div className="flex items-center justify-between pt-2.5 border-t border-black/10">
              <span className="text-xs font-sans font-bold text-[#0A542E]">
                {selectedVenue.votes} Votes Cast
              </span>
              <button
                onClick={() => onSelectVenue && onSelectVenue(selectedVenue.id)}
                className="px-4 py-2 bg-[#F04C7E] text-white font-sans font-bold text-xs rounded-xl shadow-md hover:bg-[#F04C7E]/90 transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Vote from Map
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
