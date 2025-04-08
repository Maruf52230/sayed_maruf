# 📖 Al-Quran Offline Web App

This is an **offline Al-Quran web app** built with **HTML, CSS, and JavaScript**. It provides the full Quran text along with **English** and **Bangla** translations. The app supports **offline functionality** by using local JSON files and font files. It also includes **online audio playback** for each verse using the [Quran.com API](https://api.quran.com/api) — with fallback messaging when offline.

## 🚀 Features

✅ Fully offline text and translation  
✅ English and Bangla translations  
✅ Audio streaming via Quran.com API (online)  
✅ Offline fallback message for audio  
✅ LocalStorage support for last-read Surah  
✅ Search functionality for Surahs  
✅ Mobile-responsive design

## 📋 Project Structure

```
📁 al-quran-app
├── 📁 asset
│   ├── 📁 chapters        # Chapter metadata in different languages
│   ├── 📁 editions        # Translations in different languages
│   ├── quran.json         # Original Quran text in Arabic
├── 📁 font                # Arabic font files
├── index.html             # Main HTML file
├── style.css              # Styling file
├── script.js              # JavaScript functionality
└── README.md              # Project documentation
```

## 🛠️ How It Works

1. **Offline Data**: The app loads Quran text and translations from local JSON files, making it fully functional offline.
2. **Translations**: English and Bangla translations are included, with the ability to switch between them.
3. **Audio Playback**: When online, you can listen to verse audio via the Quran.com API.
4. **Last Read Position**: The app remembers the last Surah you were reading using localStorage.
5. **Search**: Quickly find Surahs by searching their names.

## 🌟 Usage

1. Simply open `index.html` in your browser to start using the app.
2. Select a Surah from the left sidebar.
3. Read the Arabic text and translation.
4. Click the "Play Audio" button to listen to a verse (requires internet connection).
5. Switch between English and Bangla translations using the language buttons.
6. Use the search box to find Surahs quickly.

## 🔧 Technical Implementation

- **Responsive Design**: Works on both desktop and mobile devices.
- **Custom Arabic Font**: Uses KFGQPC Uthmanic Script HAFS Regular font for proper Arabic text display.
- **API Integration**: Connects to Quran.com API for audio playback when online.
- **Offline Detection**: Automatically detects when you're offline and shows appropriate messages.
- **LocalStorage**: Persists your reading position between sessions.

## 📱 Offline Functionality

This app is designed to work completely offline, except for audio playback which requires an internet connection. All Quran text and translations are loaded from local files.

## 🚀 Future Improvements

- Add bookmarks functionality
- Include more translations
- Add dark mode
- Implement verse tagging
- Add tafsir (interpretations)

## 📝 License

MIT License

## 🙏 Credits

- Quran.com for the audio API
- KFGQPC for the Uthmanic Script font 