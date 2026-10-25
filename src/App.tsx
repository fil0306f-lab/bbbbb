import { useState, useMemo } from 'react';
import { places, Place, Category } from './data/places';
import MapView from './components/MapView';
import PlaceCard from './components/PlaceCard';
import PlaceDetail from './components/PlaceDetail';
import FilterBar from './components/FilterBar';
import { Map, List, User, Star, Menu, X, Compass } from 'lucide-react';

type ViewMode = 'map' | 'list';

export default function App() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showOpenNow, setShowOpenNow] = useState(false);
  const [showAccessible, setShowAccessible] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !place.name.toLowerCase().includes(q) &&
          !place.address.toLowerCase().includes(q) &&
          !place.tags.some(t => t.toLowerCase().includes(q))
        ) return false;
      }
      if (showFreeOnly && !place.isFree) return false;
      if (showOpenNow && !place.isOpenNow) return false;
      if (showAccessible && !place.accessible) return false;
      return true;
    });
  }, [selectedCategories, searchQuery, showFreeOnly, showOpenNow, showAccessible]);

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const topRated = [...places].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">Пенза Путеводитель</h1>
            <p className="text-xs text-gray-400">Интерактивная карта города</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              <Map size={14} /> Карта
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
              }`}
            >
              <List size={14} /> Список
            </button>
          </div>

          {/* Auth Button */}
          <button
            onClick={() => setShowAuth(true)}
            className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <User size={18} className="text-gray-500" />
          </button>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            {showSidebar ? <X size={18} className="text-gray-500" /> : <Menu size={18} className="text-gray-500" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } absolute md:relative z-30 w-80 md:w-96 h-full bg-gray-50 border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out`}
        >
          {selectedPlace ? (
            <PlaceDetail
              place={selectedPlace}
              onBack={() => setSelectedPlace(null)}
              onPlaceSelect={handlePlaceSelect}
            />
          ) : (
            <>
              <FilterBar
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                showFreeOnly={showFreeOnly}
                onFreeToggle={() => setShowFreeOnly(!showFreeOnly)}
                showOpenNow={showOpenNow}
                onOpenNowToggle={() => setShowOpenNow(!showOpenNow)}
                showAccessible={showAccessible}
                onAccessibleToggle={() => setShowAccessible(!showAccessible)}
              />

              {/* Places List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {filteredPlaces.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm text-gray-500">Ничего не найдено</p>
                    <p className="text-xs text-gray-400 mt-1">Попробуйте изменить фильтры</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        Найдено: {filteredPlaces.length} {filteredPlaces.length === 1 ? 'место' : filteredPlaces.length < 5 ? 'места' : 'мест'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {filteredPlaces.map(place => (
                        <PlaceCard
                          key={place.id}
                          place={place}
                          onClick={() => handlePlaceSelect(place)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {viewMode === 'map' ? (
            <MapView
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelect}
              center={selectedPlace ? [selectedPlace.lat, selectedPlace.lon] : undefined}
              zoom={selectedPlace ? 16 : undefined}
            />
          ) : (
            <div className="h-full overflow-y-auto p-4 bg-gray-50">
              {/* Top Rated Section */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Star size={20} className="text-yellow-400" /> Лучшие места Пензы
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topRated.map(place => (
                    <PlaceCard key={place.id} place={place} onClick={() => handlePlaceSelect(place)} />
                  ))}
                </div>
              </div>

              {/* All Places */}
              <h2 className="text-lg font-bold text-gray-800 mb-3">Все достопримечательности</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPlaces.map(place => (
                  <PlaceCard key={place.id} place={place} onClick={() => handlePlaceSelect(place)} />
                ))}
              </div>
            </div>
          )}

          {/* Mobile View Toggle */}
          <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-white rounded-full shadow-lg p-1 flex">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'map' ? 'bg-blue-500 text-white' : 'text-gray-500'
                }`}
              >
                <Map size={14} /> Карта
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500'
                }`}
              >
                <List size={14} /> Список
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Вход в аккаунт</h2>
              <button onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                📧 Войти по Email
              </button>
              <button className="w-full py-3 bg-[#0077FF] text-white rounded-xl font-medium hover:bg-[#0066DD] transition-colors">
                Войти через VK ID
              </button>
              <button className="w-full py-3 bg-[#000000] text-white rounded-xl font-medium hover:bg-[#333333] transition-colors">
                Войти через Яндекс ID
              </button>
              <button className="w-full py-3 bg-[#2AABEE] text-white rounded-xl font-medium hover:bg-[#229ED9] transition-colors">
                Войти через Telegram
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Нажимая «Войти», вы соглашаетесь с{' '}
              <a href="#" className="text-blue-500 hover:underline">пользовательским соглашением</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
