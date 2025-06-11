# 🌱 PlantCare PWA

A comprehensive Progressive Web Application for personal plant care management. Keep track of your plant collection, get care reminders, search for plant information, and maintain a personalized digital garden.

## ✨ Features

### 🏠 Dashboard
- **Weather Integration**: Get weather-based care recommendations
- **Care Overview**: View upcoming tasks and overdue care items
- **Plant Collection**: Quick access to your garden with visual plant cards

### 🌸 My Flower Bed (Personalized Garden)
- **Customizable Garden Name**: Personalize your space
- **Multiple View Modes**: Grid and list layouts
- **Smart Sorting**: By name, date added, or last care date
- **Care Tracking**: Track watering, fertilizing, and more
- **Location Tags**: Organize plants by where you keep them
- **Personal Notes**: Add custom observations and notes

### 🔍 Plant Search & Discovery
- **API Integration**: Search thousands of plants via Perenual API
- **Detailed Information**: Scientific names, care requirements, growth info
- **Easy Addition**: Add plants to your collection with custom details
- **Care Instructions**: Automatic care schedule generation

### 📅 Care Schedule
- **Task Management**: Track watering, fertilizing, pruning tasks
- **Overdue Alerts**: Never miss important plant care
- **Completion Tracking**: Mark tasks complete with optional notes
- **Weekly Overview**: See what needs attention this week

### ⚙️ Settings & Personalization
- **Notifications**: Customize care reminders and alerts
- **Location Settings**: Set your location for weather data
- **Preferences**: Tailor the app to your needs

## 🚀 API Integrations

### Plant Data - Perenual API
- **Plant Search**: Access to 10,000+ plant species
- **Care Information**: Watering, sunlight, temperature requirements
- **Images**: High-quality plant photos
- **Scientific Data**: Family, origin, growth characteristics

### Weather Data - OpenWeatherMap API
- **Current Conditions**: Temperature, humidity, weather status
- **Care Recommendations**: Weather-based plant care suggestions
- **Location-based**: Customized for your area

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **PWA Features**: Service Worker, Web App Manifest
- **State Management**: React Hooks + Local Storage
- **HTTP Client**: Axios
- **Deployment**: Vercel

## 📱 PWA Features

- **Offline Capable**: Works without internet connection
- **Install Prompt**: Add to home screen on mobile devices
- **Fast Loading**: Optimized performance with caching
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Native Feel**: App-like experience across platforms

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+ and npm
- API keys (optional - app works with mock data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gclark0041/PlantCare.git
   cd PlantCare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env file
   REACT_APP_PERENUAL_API_KEY=your_perenual_api_key
   REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to GitHub**
   - Fork/clone this repository
   - Connect your Vercel account to GitHub
   - Import the PlantCare project

2. **Environment Variables**
   - Set `REACT_APP_PERENUAL_API_KEY` in Vercel dashboard
   - Set `REACT_APP_WEATHER_API_KEY` in Vercel dashboard

3. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Custom domain setup available in Vercel dashboard

### GitHub Repository
- Repository: `gclark0041/PlantCare`
- Automatic deployments configured
- Issue tracking and feature requests welcome

## 🔑 API Keys Setup

### Perenual API (Plant Data)
1. Visit [Perenual.com](https://perenual.com/docs/api)
2. Sign up for free API access
3. Get your API key
4. Add to environment: `REACT_APP_PERENUAL_API_KEY`

### OpenWeatherMap API (Weather Data)
1. Visit [OpenWeatherMap.org](https://openweathermap.org/api)
2. Create free account
3. Generate API key
4. Add to environment: `REACT_APP_WEATHER_API_KEY`

*Note: The app includes mock data and works without API keys for development*

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx   # Bottom navigation bar
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Dashboard with overview
│   ├── MyFlowerBed.tsx # Personalized garden view
│   ├── PlantSearch.tsx # Plant discovery and search
│   ├── CareSchedule.tsx# Task management
│   └── Settings.tsx    # User preferences
├── services/           # API and data services
│   ├── plantApi.ts     # External API integration
│   └── localStorage.ts # Local data management
├── types/              # TypeScript definitions
│   └── index.ts        # Type definitions
└── utils/              # Helper functions
```

## 🎨 Design Philosophy

- **Mobile-First**: Designed for touch interactions and small screens
- **Intuitive UX**: Natural plant care workflow integration
- **Visual Appeal**: Green color scheme with plant-focused iconography
- **Accessibility**: ARIA labels, keyboard navigation, contrast ratios
- **Performance**: Optimized loading, efficient re-renders, caching strategies

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components when possible
- Maintain responsive design principles
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Perenual API** for comprehensive plant data
- **OpenWeatherMap** for weather information
- **Material-UI** for beautiful React components
- **React Team** for the amazing framework
- **Plant enthusiasts** who inspired this project

## 🌿 Future Enhancements

- [ ] Plant disease identification with camera
- [ ] Community features and plant sharing
- [ ] Advanced analytics and growth tracking
- [ ] Integration with IoT plant sensors
- [ ] Multi-language support
- [ ] Plant marketplace integration
- [ ] Expert chat and consultation features

---

**Happy Planting! 🌱**

For questions, issues, or feature requests, please open an issue on GitHub or contact the development team.
