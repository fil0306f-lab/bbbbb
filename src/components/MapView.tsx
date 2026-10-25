import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place, categoryColors, categoryIcons } from '../data/places';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
}

function createCustomIcon(category: string, isSelected: boolean) {
  const color = categoryColors[category as keyof typeof categoryColors] || '#6b7280';
  const icon = categoryIcons[category as keyof typeof categoryIcons] || '📍';
  const size = isSelected ? 44 : 36;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
      ${isSelected ? 'transform: rotate(-45deg) scale(1.2); box-shadow: 0 6px 20px rgba(0,0,0,0.4);' : ''}
    ">
      <span style="transform: rotate(45deg); font-size: ${isSelected ? '18px' : '14px'};">${icon}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, zoom || 15, { duration: 0.8 });
  }
  return null;
}

export default function MapView({ places, selectedPlace, onPlaceSelect, center, zoom }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.1959, 45.0020]);
  const [mapZoom, setMapZoom] = useState(14);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setMapZoom(16);
        },
        () => alert('Не удалось определить местоположение')
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center || mapCenter}
        zoom={zoom || mapZoom}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} zoom={zoom} />
        
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lon]}
            icon={createCustomIcon(place.category, selectedPlace?.id === place.id)}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-sm text-gray-800">{place.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{place.address}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs font-medium">{place.rating}</span>
                  <span className="text-xs text-gray-400">({place.reviewCount})</span>
                </div>
                <button
                  onClick={() => onPlaceSelect(place)}
                  className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Подробнее →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setMapZoom(z => z + 1)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Приблизить"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setMapZoom(z => Math.max(3, z - 1))}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Отдалить"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Моё местоположение"
        >
          <Navigation size={18} className="text-blue-500" />
        </button>
      </div>

      {/* Weather Widget */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
        <span className="text-2xl">☀️</span>
        <div>
          <p className="text-sm font-medium">+18°C</p>
          <p className="text-xs text-gray-500">Ясно</p>
        </div>
      </div>
    </div>
  );
}
