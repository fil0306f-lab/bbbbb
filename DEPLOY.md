# 🗺️ Пенза Путеводитель

Интерактивная карта города Пенза с 40+ достопримечательностями в стиле Apple.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск в режиме разработки
```bash
npm run dev
```
Откроется на http://localhost:5173

### 3. Сборка для продакшена
```bash
npm run build
```
Готовые файлы появятся в папке `dist/`

## 🌐 Деплой (получение публичной ссылки)

### Вариант 1: Netlify Drop (самый быстрый - 30 секунд)
1. Выполни `npm install && npm run build`
2. Зайди на https://app.netlify.com/drop
3. Перетащи папку `dist/` на страницу
4. Получишь ссылку вида `https://random-name.netlify.app`
5. Готово! Ссылка работает бесплатно навсегда

### Вариант 2: Vercel (2 минуты)
1. Зайди на https://vercel.com
2. Войди через GitHub
3. Нажми "Add New Project" → "Upload"
4. Перетащи папку `dist/`
5. Получишь ссылку вида `penza-guide.vercel.app`

### Вариант 3: GitHub Pages (автоматическая сборка)
Создай файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install & Build
        run: |
          npm install
          npm run build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

После push в ветку `main` GitHub Actions автоматически соберет и задеплоит проект.

## ✨ Возможности

- 🗺️ Интерактивная карта с 40 достопримечательностями
- 🎨 Дизайн в стиле Apple (светлая/темная тема)
- 📱 Полная мобильная адаптация
- ⭐ Система рейтингов и отзывов
- ❤️ Избранное (сохраняется в localStorage)
- 🗺️ Конструктор маршрутов с экспортом
- ⚖️ Сравнение мест
- 🏆 Система достижений и уровней
- 🔔 Уведомления
- 👤 Профиль пользователя
- 🔍 Поиск и фильтры
- 📍 Геолокация
- 📤 Поделиться через Web Share API

## 🛠️ Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- Leaflet (карты)
- Lucide React (иконки)

## 📦 Структура проекта

```
src/
├── components/       # React компоненты
├── context/         # Context API
├── data/            # Данные о местах
├── App.tsx          # Главный компонент
├── main.tsx         # Точка входа
└── index.css        # Стили
```

## 📄 Лицензия

MIT

---

Сделано с ❤️ для города Пенза
