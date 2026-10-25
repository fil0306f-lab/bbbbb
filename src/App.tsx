import { useState, useEffect } from 'react';
import { places, Place, Category } from './data/places';
import MapView from './components/MapView';
import PlaceCard from './components/PlaceCard';
import PlaceDetail from './components/PlaceDetail';
import FilterBar from './components/FilterBar';
import AuthModal from './components/AuthModal';
import ProfilePanel from './components/ProfilePanel';
import NotificationsPanel from './components/NotificationsPanel';
import Toast from './components/Toast';
import { AppProvider, useApp } from './context/AppContext';
import RouteBuilder from './components/RouteBuilder';
import { Map, List, User, Star, Menu, X, Compass, Heart, Moon, Sun, Bell, Trophy, History, TrendingUp, Route } from 'lucide-react';

type ViewMode = 'map' | 'list';

function AppContent() {
  const { theme, toggleTheme, user, achievements, stats, notifications, addToHistory } = useApp();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showOpenNow, setShowOpenNow] = useState(false);
  const [showAccessible, setShowAccessible] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);

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

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('penza-favorites', JSON.stringify(next));
      const place = places.find(p => p.id === id);
      if (place) {
        addToast(
          prev.includes(id) ? `${place.name} удалено из избранного` : `${place.name} добавлено в избранное`,
          'success'
        );
      }
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
    addToHistory(place.id);
    if (isMobile) setShowSidebar(false);
  };

  const topRated = [...places].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const recentlyViewed = places.filter(p => favorites.includes(p.id)).slice(0, 5);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-[#f2f2f7]'} font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Segoe_UI',sans-serif] transition-colors duration-300`}>
      {/* Top Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200/50'} backdrop-blur-xl border-b px-4 py-2.5 flex items-center justify-between shrink-0 z-50`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Compass size={18} className="text-white" />
          </div>
          <div>
            <h1 className={`text-[15px] font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} leading-tight tracking-tight`}>Пенза</h1>
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
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100/80 text-gray-500 hover:text-gray-700'
            }`}
            title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={() => setShowRouteBuilder(true)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100/80 text-gray-500 hover:text-gray-700'
            }`}
            title="Конструктор маршрута"
          >
            <Route size={17} />
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 relative ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100/80 text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell size={17} />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center badge-pulse">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              showFavoritesOnly ? 'bg-red-50 text-red-500' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100/80 text-gray-500 hover:text-red-400'
            }`}
          >
            <Heart size={17} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => user ? setShowProfile(true) : setShowAuth(true)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100/80 hover:bg-gray-200/80'
            }`}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={17} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
            )}
          </button>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100/80 hover:bg-gray-200/80'
            }`}
          >
            {showSidebar ? <X size={17} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} /> : <Menu size={17} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } ${isMobile ? 'absolute inset-0 z-40' : 'relative'} w-full md:w-[380px] lg:w-[420px] ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-[#f2f2f7] border-gray-200/50'} flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] shrink-0 border-r`}
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
                    <p className={`text-[15px] font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Ничего не найдено</p>
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
            <div className={`h-full overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f2f2f7]'}`}>
              <div className="p-4 space-y-6 max-w-6xl mx-auto">
                {/* Top Rated */}
                <div>
                  <h2 className={`text-[22px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2 tracking-tight`}>
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
                  <h2 className={`text-[22px] font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 tracking-tight`}>Все места</h2>
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
            <div className={`${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200/50'} backdrop-blur-xl rounded-2xl shadow-lg p-1 flex border`}>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  viewMode === 'map' ? 'bg-blue-500 text-white shadow-sm' : theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                <Map size={14} /> Карта
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${
                  viewMode === 'list' ? 'bg-blue-500 text-white shadow-sm' : theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                <List size={14} /> Список
              </button>
            </div>
          </div>

          {/* Back button on mobile */}
          {isMobile && !showSidebar && viewMode === 'map' && (
            <button
              onClick={() => setShowSidebar(true)}
              className={`md:hidden absolute top-4 left-4 z-[1000] w-10 h-10 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-full shadow-lg flex items-center justify-center`}
            >
              <Menu size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
      {showRouteBuilder && <RouteBuilder onClose={() => setShowRouteBuilder(false)} />}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-[3000] space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
