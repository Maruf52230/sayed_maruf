

---

```markdown
# 📖 Al-Quran Offline Web App

This is an **offline Al-Quran web app** built with **HTML, CSS, and JavaScript**. It provides the full Quran text along with **English** and **Bangla** translations. The app supports **offline functionality** by using local JSON files and font files. It also includes **online audio playback** for each verse using the [Quran.com API](https://api.quran.com/api) — with fallback messaging when offline.

---

## 🚀 **Project Setup**

### 📂 **Folder Structure**
```
📁 al-quran-app
├── 📁 assets
│   ├── quran.json              # Quran text and translations (English & Bangla)
│   ├── fonts/                  # Custom Arabic font
├── index.html                  # Main HTML file
├── style.css                   # Styling file
├── script.js                   # JavaScript functionality
└── README.md                   # Project documentation
```

---

## 📋 **Features**
✅ Fully offline text and translation  
✅ English and Bangla translations  
✅ Audio streaming via Quran.com API (online)  
✅ Offline fallback message for audio  
✅ LocalStorage support for last-read Surah  

---

## 🌍 **1. Quran Data Format**  
Create `quran.json` inside the `assets/` folder. Ensure the following format:

```json
{
  "surahs": [
    {
      "number": 1,
      "name": "Al-Fatiha",
      "translation_en": "The Opening",
      "translation_bn": "সূচনা",
      "ayahs": [
        {
          "number": 1,
          "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "translation_en": "In the name of Allah, the Most Gracious, the Most Merciful",
          "translation_bn": "আল্লাহ্‌র নামে শুরু করছি, যিনি পরম করুণাময়, অসীম দয়ালু।"
        }
      ]
    }
  ]
}
```

---

## 🌐 **2. Audio Source (Quran.com API)**
- Use the Quran.com API to stream audio:
  - Endpoint:  
    ```
    https://api.quran.com/v4/verses/{verse_id}/audio
    ```
  - If offline, display the message:  
    `"Connect to the internet for audio."`

---

## 🖋️ **3. Font Setup**
- Place your custom Arabic font file (e.g., `quran-font.ttf`) inside `assets/fonts/`.
- Include it in `style.css`:
```css
@font-face {
  font-family: 'QuranFont';
  src: url('./assets/fonts/quran-font.ttf');
}
```

---

## 🏗️ **4. HTML Structure**
- Create a list of Surahs.
- On click, display the Surah and Ayahs.
- Include buttons for:
    - **Play audio** (if online)  
    - **Offline message** if audio fails  

---

## 🎨 **5. CSS Styling**
- Style using **TailwindCSS** or your own custom CSS.
- Use grid or flexbox for layout.
- Ensure the Arabic font is applied properly.

---

## 🧠 **6. JavaScript Logic**
### ✅ Load Quran Data
- Use `fetch()` to load `quran.json`.

### ✅ Display Surah List
- Create a button for each Surah.

### ✅ Display Surah Details
- Display Ayahs when a Surah is clicked.

### ✅ Handle Audio Playback
- Check online status:
  - If online → Play audio using API  
  - If offline → Show error message  

### ✅ Save Last Surah
- Use `localStorage` to store the last opened Surah.

---

## 🚀 **7. Commands**
### 🏗️ **Development**
- To start development, open `index.html` in a browser:
```
file://path-to-project/index.html
```

### 🔎 **Check JSON Validity**
- Ensure `quran.json` is valid using:
```
https://jsonlint.com/
```

### ✅ **Code Linting**
- Check code formatting using:
```
eslint . --fix
```

---

## 🌟 **8. Future Improvements**
- Add search functionality  
- Add bookmarks  
- Add dark mode  

---

## ✅ **Progress Checklist**
| Step | Description | Status |
|------|-------------|--------|
| 1    | Create HTML structure | ✅ Done |
| 2    | Load Quran JSON data | ✅ Done |
| 3    | Display Surah list | ✅ Done |
| 4    | Display Surah details | ✅ Done |
| 5    | Play audio from API | ✅ Done |
| 6    | Handle offline state | ✅ Done |
| 7    | Save last-read Surah | ✅ Done |
| 8    | Apply custom font | ✅ Done |

---

## 📢 **License**
MIT License

---

## 🌍 **Contributing**
Feel free to open an issue or submit a pull request.

---

## 📩 **Contact**
- 📧 Email: [your-email@example.com](mailto:your-email@example.com)

