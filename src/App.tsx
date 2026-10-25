import { useState, useEffect } from 'react';
import { places, Place, Category } from './data/places';
import MapView from './components/MapView';
import PlaceCard from './components/PlaceCard';
import PlaceDetail from './components/PlaceDetail';
import FilterBar from './components/FilterBar';
import AuthModal from './components/AuthModal';
import { Map, List, User, Star, Menu, X, Compass, ChevronLeft, Heart } from 'lucide-react';

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('penza-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('penza-favorites', JSON.stringify(next));
      return next;
    });
  };

  const filteredPlaces = places.filter(place => {
    if (showFavoritesOnly && !favorites.includes(place.id)) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(place.category)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !place.name.toLowerCase().includes(q) &&
        !place.address.toLowerCase().includes(q) &&
        !place.tags.some(t => t.toLowerCase().includes(q)) &&
        !place.description.toLowerCase().includes(q)
      ) return false;
    }
    if (showFreeOnly && !place.isFree) return false;
    if (showOpenNow && !place.isOpenNow) return false;
    if (showAccessible && !place.accessible) return false;
    return true;
  });

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    if (isMobile) setShowSidebar(false);
  };

  const topRated = [...places].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f2f2f7] font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Segoe_UI',sans-serif]">
      {/* Top Header - Apple Style */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-2.5 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Compass size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 leading-tight tracking-tight">Пенза</h1>
            <p className="text-[11px] text-gray-500 leading-tight">Путеводитель</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex bg-gray-100/80 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map size={14} /> Карта
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={14} /> Список
            </button>
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              showFavoritesOnly ? 'bg-red-50 text-red-500' : 'bg-gray-100/80 text-gray-500 hover:text-red-400'
            }`}
          >
            <Heart size={17} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => setShowAuth(true)}
            className="w-9 h-9 bg-gray-100/80 rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-colors"
          >
            <User size={17} className="text-gray-500" />
          </button>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden w-9 h-9 bg-gray-100/80 rounded-full flex items-center justify-center hover:bg-gray-200/80 transition-colors"
          >
            {showSidebar ? <X size={17} className="text-gray-500" /> : <Menu size={17} className="text-gray-500" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } ${isMobile ? 'absolute inset-0 z-40' : 'relative'} w-full md:w-[380px] lg:w-[420px] bg-[#f2f2f7] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] shrink-0 border-r border-gray-200/50`}
        >
          {selectedPlace ? (
            <PlaceDetail
              place={selectedPlace}
              onBack={() => setSelectedPlace(null)}
              onPlaceSelect={handlePlaceSelect}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
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

              <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
                {filteredPlaces.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-[15px] font-medium text-gray-800">Ничего не найдено</p>
                    <p className="text-[13px] text-gray-500 mt-1">Попробуйте изменить фильтры</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[13px] text-gray-500 font-medium">
                        {filteredPlaces.length} {filteredPlaces.length === 1 ? 'место' : filteredPlaces.length < 5 ? 'места' : 'мест'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {filteredPlaces.map(place => (
                        <PlaceCard
                          key={place.id}
                          place={place}
                          onClick={() => handlePlaceSelect(place)}
                          isFavorite={favorites.includes(place.id)}
                          onToggleFavorite={() => toggleFavorite(place.id)}
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
              favorites={favorites}
            />
          ) : (
            <div className="h-full overflow-y-auto bg-[#f2f2f7]">
              <div className="p-4 space-y-6 max-w-6xl mx-auto">
                {/* Top Rated */}
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-3 flex items-center gap-2 tracking-tight">
                    <Star size={22} className="text-yellow-500" fill="currentColor" /> Лучшие места
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {topRated.map(place => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onClick={() => handlePlaceSelect(place)}
                        isFavorite={favorites.includes(place.id)}
                        onToggleFavorite={() => toggleFavorite(place.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* All Places */}
                <div>
                  <h2 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">Все места</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredPlaces.map(place => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onClick={() => handlePlaceSelect(place)}
                        isFavorite={favorites.includes(place.id)}
                        onToggleFavorite={() => toggleFavorite(place.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile View Toggle */}
          <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-1 flex border border-gray-200/50">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  viewMode === 'map' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <Map size={14} /> Карта
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  viewMode === 'list' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                <List size={14} /> Список
              </button>
            </div>
          </div>

          {/* Back button on mobile when sidebar is hidden */}
          {isMobile && !showSidebar && viewMode === 'map' && (
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden absolute top-4 left-4 z-[1000] w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center"
            >
              <Menu size={18} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}
