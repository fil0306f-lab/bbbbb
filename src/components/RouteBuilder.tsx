import { useState } from 'react';
import { places, Place } from '../data/places';
import { X, Plus, Trash2, Download, Share2, MapPin, Clock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RouteBuilderProps {
  onClose: () => void;
}

export default function RouteBuilder({ onClose }: RouteBuilderProps) {
  const { theme, updateStats } = useApp();
  const [routeName, setRouteName] = useState('Мой маршрут по Пензе');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  const addPlace = (place: Place) => {
    if (!selectedPlaces.find(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const removePlace = (id: string) => {
    setSelectedPlaces(selectedPlaces.filter(p => p.id !== id));
  };

  const movePlace = (index: number, direction: 'up' | 'down') => {
    const newPlaces = [...selectedPlaces];
    if (direction === 'up' && index > 0) {
      [newPlaces[index], newPlaces[index - 1]] = [newPlaces[index - 1], newPlaces[index]];
    } else if (direction === 'down' && index < newPlaces.length - 1) {
      [newPlaces[index], newPlaces[index + 1]] = [newPlaces[index + 1], newPlaces[index]];
    }
    setSelectedPlaces(newPlaces);
  };

  const exportRoute = () => {
    const routeData = {
      name: routeName,
      places: selectedPlaces.map(p => ({
        name: p.name,
        address: p.address,
        lat: p.lat,
        lon: p.lon,
      })),
      createdAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${routeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    updateStats('routesCreated', 1);
    alert('Маршрут экспортирован!');
  };

  const shareRoute = async () => {
    const routeText = `${routeName}\n\n${selectedPlaces.map((p, i) => `${i + 1}. ${p.name} - ${p.address}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: routeName,
          text: routeText,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(routeText);
      alert('Маршрут скопирован в буфер обмена!');
    }
  };

  const totalDistance = selectedPlaces.length > 1
    ? selectedPlaces.slice(0, -1).reduce((acc, place, i) => {
        const next = selectedPlaces[i + 1];
        const distance = Math.sqrt(
          Math.pow(place.lat - next.lat, 2) + Math.pow(place.lon - next.lon, 2)
        ) * 111;
        return acc + distance;
      }, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[600px] max-h-[90vh] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              🗺️ Конструктор маршрута
            </h2>
            <button
              onClick={onClose}
              className={`w-8 h-8 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-full flex items-center justify-center transition-colors`}
            >
              <X size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
            </button>
          </div>

          <input
            type="text"
            value={routeName}
            onChange={e => setRouteName(e.target.value)}
            placeholder="Название маршрута"
            className={`w-full px-3 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'} rounded-xl text-[14px] outline-none focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>

        {/* Stats */}
        {selectedPlaces.length > 0 && (
          <div className={`px-4 py-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'} flex items-center justify-around`}>
            <div className="text-center">
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>{selectedPlaces.length}</p>
              <p className="text-[11px] text-gray-500">Мест</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>{totalDistance.toFixed(1)} км</p>
              <p className="text-[11px] text-gray-500">Расстояние</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`}>~{Math.round(totalDistance / 5 * 60)} мин</p>
              <p className="text-[11px] text-gray-500">Время</p>
            </div>
          </div>
        )}

        {/* Places List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {selectedPlaces.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
              <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Добавьте места в маршрут</p>
            </div>
          ) : (
            selectedPlaces.map((place, index) => (
              <div
                key={place.id}
                className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl`}
              >
                <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-full flex items-center justify-center text-[13px] font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {index + 1}
                </div>
                <img src={place.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{place.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{place.address}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => movePlace(index, 'up')}
                    disabled={index === 0}
                    className={`w-7 h-7 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'} rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePlace(index, 'down')}
                    disabled={index === selectedPlaces.length - 1}
                    className={`w-7 h-7 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'} rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors`}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removePlace(place.id)}
                    className="w-7 h-7 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
          <button
            onClick={() => setShowPlacePicker(true)}
            className={`w-full py-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl text-[14px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'} flex items-center justify-center gap-2 transition-colors`}
          >
            <Plus size={16} /> Добавить место
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportRoute}
              disabled={selectedPlaces.length === 0}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={16} /> Экспорт
            </button>
            <button
              onClick={shareRoute}
              disabled={selectedPlaces.length === 0}
              className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 size={16} /> Поделиться
            </button>
          </div>
        </div>

        {/* Place Picker Modal */}
        {showPlacePicker && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowPlacePicker(false)}>
            <div
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[500px] max-h-[70vh] shadow-2xl overflow-hidden flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Выберите место</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {places.map(place => (
                  <button
                    key={place.id}
                    onClick={() => {
                      addPlace(place);
                      setShowPlacePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-2xl transition-colors text-left`}
                  >
                    <img src={place.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{place.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{place.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
