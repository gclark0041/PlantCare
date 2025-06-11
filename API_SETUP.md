# 🌱 API Setup Guide for PlantCare PWA

## Getting Your Perenual API Key

To use the full plant database functionality, you need to get your own API key from Perenual.

### Steps:

1. **Visit the Perenual API website**: [https://perenual.com/docs/api](https://perenual.com/docs/api)

2. **Click "GET API KEY & ACCESS"** to sign up for an account

3. **Choose your plan**:
   - Free tier: 100 requests/month 
   - Premium tiers available for more requests

4. **Copy your API key** (it will look like: `sk-xxxxxxxxxxxxxxxxxx`)

## Setting Up Your API Key

### For Local Development:

1. Create a `.env` file in the root directory of your project
2. Add your API key:
```
REACT_APP_PERENUAL_API_KEY=your_actual_api_key_here
```

### For Vercel Deployment:

1. Go to your Vercel dashboard
2. Select your PlantCare project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `REACT_APP_PERENUAL_API_KEY`
   - **Value**: Your actual API key
   - **Environment**: Production (and Preview if needed)

5. **Redeploy** your application for changes to take effect

## API Features Available

With a valid API key, you'll have access to:

- ✅ **10,000+ plant species** from the Perenual database
- ✅ **Advanced filtering**: edible, poisonous, hardiness zones, watering needs
- ✅ **Detailed plant information**: care guides, scientific names, images
- ✅ **Safety information**: toxicity warnings for humans and pets
- ✅ **Climate compatibility**: hardiness zone matching

## Without API Key

If no API key is provided, the app will:
- Show a warning in the console
- Use mock data with ~6 sample plants
- Still function for demonstration purposes

## Troubleshooting

### Getting 500 Errors?
- Check your API key is valid and hasn't expired
- Ensure you haven't exceeded your request limit
- Verify the API key format (should start with `sk-`)

### API Not Working?
- Check the console for detailed error messages
- Verify your environment variable name is exactly: `REACT_APP_PERENUAL_API_KEY`
- Make sure to restart your development server after adding the `.env` file

### Need Help?
- Visit the [Perenual API documentation](https://perenual.com/docs/api)
- Check their Discord community for support
- Review the API logs in your account dashboard

---

## Weather API (Optional)

For weather-based plant care recommendations, you can also set up OpenWeatherMap:

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Add to your environment variables:
```
REACT_APP_WEATHER_API_KEY=your_weather_api_key
```

Without a weather API key, the app will use mock weather data. 