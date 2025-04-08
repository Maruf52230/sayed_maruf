/**
 * Tesseract.js Implementation for OCR
 * Extracts text from multiple images using Tesseract OCR
 */

// Initialize Tesseract worker
let tesseractWorker = null;

// Initialize the Tesseract worker
async function initTesseract() {
    if (!tesseractWorker) {
        tesseractWorker = Tesseract.createWorker();
        await tesseractWorker.load();
        await tesseractWorker.loadLanguage('eng');
        await tesseractWorker.initialize('eng');
        console.log('Tesseract worker initialized');
    }
    return tesseractWorker;
}

// Process a single image with Tesseract OCR
async function processImage(imageFile) {
    const worker = await initTesseract();
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const imageData = e.target.result;
                const { data } = await worker.recognize(imageData);
                resolve({
                    filename: imageFile.name,
                    text: data.text
                });
            } catch (error) {
                reject(`Error processing image ${imageFile.name}: ${error.message}`);
            }
        };
        
        reader.onerror = () => reject(`Error reading file ${imageFile.name}`);
        reader.readAsDataURL(imageFile);
    });
}

// Process multiple images and extract text
async function extractTextFromImages(imageFiles) {
    if (!imageFiles || imageFiles.length === 0) {
        return '';
    }
    
    try {
        // Create a status message to show processing
        const extractedTextElement = document.getElementById('extracted-text');
        extractedTextElement.innerHTML = '<p>Processing images, please wait...</p>';
        
        // Process each image in parallel
        const results = await Promise.all(
            Array.from(imageFiles).map(file => processImage(file))
        );
        
        // Combine all text results
        let combinedText = '';
        results.forEach(result => {
            combinedText += `--- From ${result.filename} ---\n${result.text}\n\n`;
        });
        
        return combinedText.trim();
    } catch (error) {
        console.error('Error extracting text from images:', error);
        return `Error: ${error.message}`;
    }
}

// Cleanup Tesseract worker when done
async function terminateTesseract() {
    if (tesseractWorker) {
        await tesseractWorker.terminate();
        tesseractWorker = null;
        console.log('Tesseract worker terminated');
    }
}

// Display progress indicators
function updateProgressIndicator(message) {
    const extractedTextElement = document.getElementById('extracted-text');
    extractedTextElement.innerHTML = `<p>${message}</p>`;
} 