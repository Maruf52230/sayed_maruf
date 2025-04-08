# 📝 Note Maker App

A web application that extracts text from images and PDFs, generates AI-based notes using DeepSeek R1 Zero, and allows saving notes as PDFs.

## 🎯 Features

- Extract text from multiple images using OCR (Tesseract.js)
- Extract text from PDFs (PDF.js) with custom page range selection
- Generate AI-based notes using DeepSeek R1 Zero via OpenRouter
- Export notes as PDF files (jsPDF)
- Clean and responsive UI
- Direct text editing

## 🚀 Tech Stack

- HTML5
- CSS3
- JavaScript (vanilla)
- Tesseract.js (OCR engine)
- PDF.js (PDF parsing)
- OpenRouter API (DeepSeek R1 Zero access)
- jsPDF (PDF generation)

## 📋 Usage

1. Open the `index.html` file in your web browser
2. Upload images or a PDF file
3. For PDFs, specify a page range (optional)
4. Click "Extract Text" to process the files
5. Review and edit the extracted text if needed
6. Click "Generate Notes" to create AI-generated notes
7. Review and edit the generated notes if needed
8. Click "Save as PDF" to download the notes as a PDF file

## ⚙️ Setup

No build tools or server setup required. This is a client-side application that runs in the browser.

1. Clone the repository:
```
git clone https://github.com/yourusername/note-maker-app.git
```

2. Open `index.html` in your web browser

## 🔑 API Key

The application uses the OpenRouter API to access the DeepSeek R1 Zero model. The API key is included in the `api.js` file, but you should replace it with your own API key for production use:

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Replace the `OPENROUTER_API_KEY` value in `api.js`

## 📂 Project Structure

```
note-maker-app/
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── script.js          # Main JavaScript file
├── tesseract.js       # OCR functionality
├── pdf-parse.js       # PDF parsing functionality
├── api.js             # DeepSeek R1 Zero API integration
└── README.md          # Project documentation
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/note-maker-app/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgements

- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [OpenRouter](https://openrouter.ai/)
- [DeepSeek R1 Zero](https://deepseek.com/) 