import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place, categoryColors, categoryIcons } from '../data/places';
import { Navigation, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  center?: [number, number];
  zoom?: number;
  favorites?: string[];
}

function createCustomIcon(category: string, isSelected: boolean, isFavorite: boolean) {
  const color = categoryColors[category as keyof typeof categoryColors] || '#007AFF';
  const icon = categoryIcons[category as keyof typeof categoryIcons] || '📍';
  const size = isSelected ? 48 : 38;
  
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
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      ${isSelected ? 'transform: rotate(-45deg) scale(1.15); box-shadow: 0 8px 24px rgba(0,0,0,0.35);' : ''}
      ${isFavorite ? 'box-shadow: 0 4px 16px rgba(255,59,48,0.4);' : ''}
    ">
      <span style="transform: rotate(45deg); font-size: ${isSelected ? '20px' : '15px'};">${icon}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 15, { duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ places, selectedPlace, onPlaceSelect, center, zoom, favorites = [] }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => alert('Не удалось определить местоположение. Проверьте настройки доступа.')
      );
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center || [53.1959, 45.0020]}
        zoom={zoom || 14}
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
            icon={createCustomIcon(place.category, selectedPlace?.id === place.id, favorites.includes(place.id))}
            eventHandlers={{
              click: () => onPlaceSelect(place),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <h3 className="font-semibold text-[14px] text-gray-900 leading-tight">{place.name}</h3>
                <p className="text-[12px] text-gray-500 mt-1">{place.address}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-yellow-500 text-[12px]">★</span>
                  <span className="text-[12px] font-medium text-gray-700">{place.rating}</span>
                  <span className="text-[11px] text-gray-400">({place.reviewCount})</span>
                </div>
                <button
                  onClick={() => onPlaceSelect(place)}
                  className="mt-2.5 w-full text-[13px] bg-blue-500 text-white px-3 py-2 rounded-xl font-medium hover:bg-blue-600 active:scale-[0.98] transition-all"
                >
                  Подробнее →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="
                width: 20px;
                height: 20px;
                background: #007AFF;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,122,255,0.5);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all border border-gray-200/50 dark:border-gray-700"
          title="Приблизить"
          onClick={() => {
            const map = document.querySelector('.leaflet-container');
            if (map) {
              const event = new WheelEvent('wheel', { deltaY: -100 });
              map.dispatchEvent(event);
            }
          }}
        >
          <ZoomIn size={18} className="text-gray-700" />
        </button>
        <button
          className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all border border-gray-200/50"
          title="Отдалить"
          onClick={() => {
            const map = document.querySelector('.leaflet-container');
            if (map) {
              const event = new WheelEvent('wheel', { deltaY: 100 });
              map.dispatchEvent(event);
            }
          }}
        >
          <ZoomOut size={18} className="text-gray-700" />
        </button>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-all border border-gray-200/50"
          title="Моё местоположение"
        >
          <LocateFixed size={18} className="text-blue-500" />
        </button>
      </div>

      {/* Weather Widget */}
      <div className="absolute bottom-20 sm:bottom-4 left-4 z-[1000] bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3 border border-gray-200/50 dark:border-gray-700">
        <span className="text-2xl">☀️</span>
        <div>
          <p className="text-[14px] font-semibold text-gray-900 dark:text-white">+18°C</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Ясно, Пенза</p>
        </div>
      </div>
    </div>
  );
}
