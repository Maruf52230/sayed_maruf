/**
 * Main JavaScript for Note Maker App
 * Connects UI elements with functionality
 */

// Global variables to store state
let extractedText = '';
let generatedNotes = '';
let isProcessing = false; // Flag to prevent multiple concurrent requests
let autoModeEnabled = true; // Auto-generate notes after extraction

// DOM Elements
const imageUploadInput = document.getElementById('image-upload');
const pdfUploadInput = document.getElementById('pdf-upload');
const pageRangeInput = document.getElementById('page-range');
const extractTextBtn = document.getElementById('extract-text-btn');
const generateNotesBtn = document.getElementById('generate-notes-btn');
const savePdfBtn = document.getElementById('save-pdf-btn');
const extractedTextElement = document.getElementById('extracted-text');
const generatedNotesElement = document.getElementById('generated-notes');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if all elements exist before adding listeners
    if (extractTextBtn) {
        extractTextBtn.addEventListener('click', handleExtractText);
    }
    
    if (generateNotesBtn) {
        generateNotesBtn.addEventListener('click', handleGenerateNotes);
    }
    
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', handleSavePDF);
    }
    
    if (extractedTextElement) {
        extractedTextElement.addEventListener('input', () => {
            extractedText = extractedTextElement.innerHTML;
        });
    }
    
    if (generatedNotesElement) {
        generatedNotesElement.addEventListener('input', () => {
            generatedNotes = generatedNotesElement.innerHTML;
        });
    }
    
    // Update PDF upload label to show multiple files are allowed
    if (pdfUploadInput) {
        pdfUploadInput.setAttribute('multiple', 'true');
        const pdfLabel = document.querySelector('label[for="pdf-upload"]');
        if (pdfLabel) {
            pdfLabel.textContent = 'Select PDFs';
        }
    }
    
    // Add Auto-mode indicator to the interface
    addAutoModeIndicator();
    
    // Ensure auto mode is enabled by default
    autoModeEnabled = true;
    console.log('Auto-generate mode is enabled by default');
});

// Add Auto-mode indicator
function addAutoModeIndicator() {
    const inputSection = document.querySelector('.input-section');
    const autoModeIndicator = document.createElement('div');
    autoModeIndicator.className = 'auto-mode';
    autoModeIndicator.textContent = 'Auto-Generate Enabled';
    autoModeIndicator.title = 'Notes will be automatically generated after text extraction';
    autoModeIndicator.id = 'auto-mode-indicator';
    
    // Add toggle functionality
    autoModeIndicator.addEventListener('click', toggleAutoMode);
    
    inputSection.appendChild(autoModeIndicator);
}

// Toggle Auto-mode
function toggleAutoMode() {
    autoModeEnabled = !autoModeEnabled;
    const indicator = document.getElementById('auto-mode-indicator');
    
    if (autoModeEnabled) {
        indicator.textContent = 'Auto-Generate Enabled';
        indicator.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
        indicator.style.color = 'var(--primary)';
        showNotification('Auto-generate mode enabled');
    } else {
        indicator.textContent = 'Auto-Generate Disabled';
        indicator.style.backgroundColor = 'rgba(160, 174, 192, 0.1)';
        indicator.style.color = '#718096';
        showNotification('Auto-generate mode disabled');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.success-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Handle Extract Text button click
async function handleExtractText() {
    // Prevent multiple concurrent extractions
    if (isProcessing) {
        console.log('Text extraction already in progress');
        return;
    }
    
    if (!imageUploadInput || !pdfUploadInput || !pageRangeInput || !extractTextBtn || !extractedTextElement) {
        console.error('Required DOM elements not found');
        return;
    }
    
    const imageFiles = imageUploadInput.files;
    const pdfFiles = pdfUploadInput.files;
    const pageRange = pageRangeInput.value;
    
    if (!imageFiles.length && !pdfFiles.length) {
        alert('Please upload at least one image or PDF file.');
        return;
    }
    
    try {
        isProcessing = true;
        extractTextBtn.disabled = true;
        extractTextBtn.textContent = 'Extracting...';
        
        let text = '';
        
        // Process images if any
        if (imageFiles.length > 0) {
            updateProgressStatus('Processing images...');
            const imagesText = await extractTextFromImages(imageFiles);
            text += imagesText;
        }
        
        // Process PDFs if any
        if (pdfFiles.length > 0) {
            if (text) {
                text += '\n\n' + '='.repeat(80) + '\n\n';
            }
            
            updateProgressStatus('Processing PDFs...');
            // Use the new processAllPDFs function that handles multiple files
            const pdfText = await processAllPDFs(pdfFiles, pageRange);
            text += pdfText;
        }
        
        // Update the extracted text
        extractedText = text;
        extractedTextElement.innerHTML = text;
        
        // Show success notification
        showNotification('Text extracted successfully!');
        
        // Log auto-mode status to debug
        console.log('Auto-mode enabled status:', autoModeEnabled);
        
        // If auto-mode is enabled, automatically generate notes
        if (autoModeEnabled && text.trim() !== '') {
            console.log('Auto-generating notes...');
            // Reduced delay to ensure it runs quickly
            setTimeout(() => {
                // Direct call to generate notes with the extracted text
                if (typeof generateNotes === 'function') {
                    console.log('Calling generateNotes function...');
                    handleGenerateNotes();
                } else {
                    console.error('generateNotes function not found');
                }
            }, 300);
        } else {
            console.log('Auto-generate not triggered:', 
                        autoModeEnabled ? 'Text is empty' : 'Auto-mode disabled');
        }
        
    } catch (error) {
        console.error('Error during text extraction:', error);
        extractedTextElement.innerHTML = `Error: ${error.message}`;
        showNotification('Error during text extraction', 'error');
    } finally {
        // Re-enable the button and reset processing flag
        extractTextBtn.disabled = false;
        extractTextBtn.textContent = 'Extract Text';
        isProcessing = false;
    }
}

// Helper function to update status
function updateProgressStatus(message) {
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    progressIndicator.appendChild(spinner);
    progressIndicator.appendChild(text);
    
    extractedTextElement.innerHTML = '';
    extractedTextElement.appendChild(progressIndicator);
}

// Helper function to split the text into chunks of 700 tokens
function splitTextIntoChunks(text, maxTokens = 700) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (let i = 0; i < words.length; i++) {
        currentChunk.push(words[i]);
        currentLength += words[i].length + 1; // Adding 1 for space

        // When chunk reaches maximum tokens, start a new chunk
        if (currentLength > maxTokens) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
            currentLength = 0;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' ')); // Add the last chunk
    }

    return chunks;
}

// Handle Generate Notes button click
async function handleGenerateNotes() {
    // Prevent multiple concurrent note generations
    if (isProcessing) {
        console.log('Note generation already in progress');
        return;
    }
    
    if (!extractedTextElement || !generatedNotesElement || !generateNotesBtn) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Get text from the extracted text area
    const text = extractedTextElement.innerHTML;
    
    if (!text || text.trim() === '') {
        showNotification('Please extract text first before generating notes', 'error');
        return;
    }
    
    try {
        isProcessing = true;
        generateNotesBtn.disabled = true;
        generateNotesBtn.textContent = 'Generating...';
        
        // First check if the API object and function exists
        if (typeof generateNotes !== 'function') {
            throw new Error('API function not found. Check if api.js is properly loaded.');
        }
        
        // Update the UI to show progress
        updateNoteGenerationProgress('Starting note generation, please wait...');
        
        // Split the text into chunks of 700 tokens or less
        const textChunks = splitTextIntoChunks(text, 700);
        let allGeneratedNotes = '';
        
        // Display chunk count
        updateNoteGenerationProgress(`Processing ${textChunks.length} text chunks...`);
        
        // Process each chunk and generate notes
        for (let i = 0; i < textChunks.length; i++) {
            const chunk = textChunks[i];
            
            // Update progress
            updateNoteGenerationProgress(`Processing chunk ${i+1} of ${textChunks.length}...`, 
                                      `${Math.round((i/textChunks.length) * 100)}%`);
            
            try {
                const notes = await generateNotes(chunk); // Send each chunk to the API
                allGeneratedNotes += notes + "\n\n"; // Append the response with spacing
                
                // Update UI with partial results
                updateNoteGenerationProgress(`Processed ${i+1} of ${textChunks.length} chunks`, 
                                          `${Math.round(((i+1)/textChunks.length) * 100)}%`, 
                                          allGeneratedNotes);
            } catch (chunkError) {
                console.error(`Error processing chunk ${i+1}:`, chunkError);
                allGeneratedNotes += `[Error in chunk ${i+1}: ${chunkError.message}]\n\n`;
            }
        }
        
        // Update the generated notes
        generatedNotes = allGeneratedNotes;
        generatedNotesElement.innerHTML = allGeneratedNotes;
        
        // Show success notification
        showNotification('Notes generated successfully!');
        
    } catch (error) {
        console.error('Error during note generation:', error);
        generatedNotesElement.innerHTML = `Error: ${error.message}`;
        showNotification('Error generating notes', 'error');
    } finally {
        // Re-enable the button and reset processing flag
        generateNotesBtn.disabled = false;
        generateNotesBtn.textContent = 'Generate Notes';
        isProcessing = false;
    }
}

// Helper function to update note generation progress
function updateNoteGenerationProgress(message, progress = '', content = '') {
    const progressElement = document.createElement('div');
    progressElement.className = 'progress-indicator';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const statusText = document.createElement('div');
    statusText.style.display = 'flex';
    statusText.style.justifyContent = 'space-between';
    statusText.style.width = '100%';
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    const progressSpan = document.createElement('span');
    progressSpan.textContent = progress;
    progressSpan.style.fontWeight = 'bold';
    
    statusText.appendChild(messageSpan);
    if (progress) {
        statusText.appendChild(progressSpan);
    }
    
    progressElement.appendChild(spinner);
    progressElement.appendChild(statusText);
    
    generatedNotesElement.innerHTML = '';
    generatedNotesElement.appendChild(progressElement);
    
    if (content) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'generated-content';
        contentDiv.innerHTML = content;
        generatedNotesElement.appendChild(contentDiv);
    }
}

// Handle Save PDF button click
function handleSavePDF() {
    if (!generatedNotesElement || !savePdfBtn) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Get notes from the generated notes area
    const notes = generatedNotesElement.innerHTML;
    
    if (!notes || notes.trim() === '') {
        showNotification('Please generate notes first before saving as PDF', 'error');
        return;
    }
    
    try {
        savePdfBtn.disabled = true;
        savePdfBtn.textContent = 'Saving...';
        
        // First check if the API object and function exists
        if (typeof saveNotesAsPDF !== 'function') {
            throw new Error('PDF save function not found. Check if api.js is properly loaded.');
        }
        
        // Call the PDF save function
        const success = saveNotesAsPDF(notes);
        
        if (success) {
            showNotification('PDF saved successfully!');
        }
        
    } catch (error) {
        console.error('Error saving PDF:', error);
        showNotification(`Error saving PDF: ${error.message}`, 'error');
    } finally {
        // Re-enable the button
        savePdfBtn.disabled = false;
        savePdfBtn.textContent = 'Save as Multi-page PDF';
    }
}

// Helper function to show file details for uploads
function showFileDetails(fileInput, infoElement) {
    const files = fileInput.files;
    if (files.length > 0) {
        let fileInfo = '';
        for (let i = 0; i < files.length; i++) {
            fileInfo += `${files[i].name} (${formatFileSize(files[i].size)})<br>`;
        }
        infoElement.innerHTML = fileInfo;
    } else {
        infoElement.innerHTML = 'No file selected';
    }
}

// Format file size in KB or MB
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}
