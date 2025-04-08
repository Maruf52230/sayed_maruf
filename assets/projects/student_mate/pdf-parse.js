/**
 * PDF Parser Implementation
 * Extracts text from multiple PDF files using PDF.js
 */

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Flag to track processing status
let pdfProcessingInProgress = false;

// Extract text from a specific page
async function extractTextFromPage(pdfDoc, pageNum) {
    try {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        return textContent.items.map(item => item.str).join(' ');
    } catch (error) {
        console.error(`Error extracting text from page ${pageNum}:`, error);
        return `[Error on page ${pageNum}: ${error.message}]`;
    }
}

// Parse a page range string like "1-5" or "3,7,9-12"
function parsePageRange(pageRangeStr, totalPages) {
    if (!pageRangeStr || pageRangeStr.trim() === '') {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pageSet = new Set();
    const rangeParts = pageRangeStr.split(',');
    
    for (const part of rangeParts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim()));
            
            if (isNaN(start) || isNaN(end)) continue;
            
            const startPage = Math.max(1, start);
            const endPage = Math.min(totalPages, end);
            
            for (let i = startPage; i <= endPage; i++) {
                pageSet.add(i);
            }
        } else {
            const pageNum = parseInt(part.trim());
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                pageSet.add(pageNum);
            }
        }
    }
    
    return Array.from(pageSet).sort((a, b) => a - b);
}

// Get PDF metadata
async function getPdfMetadata(pdfDoc) {
    try {
        const metadata = await pdfDoc.getMetadata();
        return {
            title: metadata.info?.Title || 'Untitled',
            author: metadata.info?.Author || 'Unknown',
            subject: metadata.info?.Subject || '',
            keywords: metadata.info?.Keywords || '',
            creator: metadata.info?.Creator || '',
            producer: metadata.info?.Producer || '',
            creationDate: metadata.info?.CreationDate ? new Date(metadata.info.CreationDate) : null,
            modificationDate: metadata.info?.ModDate ? new Date(metadata.info.ModDate) : null,
            totalPages: pdfDoc.numPages
        };
    } catch (error) {
        console.error('Error getting PDF metadata:', error);
        return {
            title: 'Untitled',
            author: 'Unknown',
            totalPages: pdfDoc.numPages
        };
    }
}

// Extract text from a single PDF with page range
async function extractTextFromPDF(pdfFile, pageRangeStr = '') {
    if (!pdfFile) return '';

    try {
        // Show loading message
        const extractedTextElement = document.getElementById('extracted-text');
        extractedTextElement.innerHTML = `<p>Processing PDF: ${pdfFile.name}, please wait...</p>`;

        // Read the PDF file
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdfDoc.numPages;
        
        // Get PDF metadata
        const metadata = await getPdfMetadata(pdfDoc);

        // Parse the page range
        const pagesToExtract = parsePageRange(pageRangeStr, totalPages);

        // Start with metadata info
        let extractedText = `--- From PDF: ${pdfFile.name} (${metadata.title}) ---\n`;
        extractedText += `Author: ${metadata.author} | Pages: ${totalPages} | Extracted: ${pagesToExtract.join(', ')}\n\n`;

        // Extract text page by page with progress updates
        let extractedContent = '';
        for (const pageNum of pagesToExtract) {
            // Update UI with current progress
            extractedTextElement.innerHTML = `<p>Processing PDF: ${pdfFile.name}, Page ${pageNum}/${totalPages}...</p>`;
            
            // Extract text from current page
            const pageText = await extractTextFromPage(pdfDoc, pageNum);
            extractedContent += `--- Page ${pageNum} ---\n${pageText}\n\n`;
            
            // Update UI with partial results every 5 pages
            if (pageNum % 5 === 0 || pageNum === pagesToExtract[pagesToExtract.length - 1]) {
                extractedTextElement.innerHTML = `<p>Processing PDF: ${pdfFile.name}, Page ${pageNum}/${totalPages}...</p>
                <div class="partial-text">${extractedText}${extractedContent.substring(0, 500)}...</div>`;
            }
        }

        return extractedText + extractedContent.trim();
    } catch (error) {
        console.error(`Error processing PDF ${pdfFile.name}:`, error);
        return `Error processing PDF ${pdfFile.name}: ${error.message}`;
    }
}

// Handle multiple PDFs with page range
async function extractTextFromMultiplePDFs(pdfFiles, pageRangeStr = '') {
    if (!pdfFiles || pdfFiles.length === 0) {
        return 'Please upload at least one PDF file.';
    }
    
    // Prevent concurrent processing
    if (pdfProcessingInProgress) {
        console.log('PDF processing already in progress');
        return 'PDF processing already in progress. Please wait...';
    }
    
    pdfProcessingInProgress = true;
    const extractedTextElement = document.getElementById('extracted-text');
    
    try {
        let combinedExtractedText = '';
        const totalPDFs = pdfFiles.length;

        // Create a progress indicator
        extractedTextElement.innerHTML = `<p>Starting to process ${totalPDFs} PDF file(s)...</p>`;
        
        // Process each PDF file
        for (let i = 0; i < pdfFiles.length; i++) {
            const pdfFile = pdfFiles[i];
            extractedTextElement.innerHTML = `<p>Processing PDF ${i+1} of ${totalPDFs}: ${pdfFile.name}</p>`;
            
            const extractedText = await extractTextFromPDF(pdfFile, pageRangeStr);
            combinedExtractedText += extractedText;
            
            // Add separator between PDFs
            if (i < pdfFiles.length - 1) {
                combinedExtractedText += '\n\n' + '='.repeat(80) + '\n\n';
            }
        }
        
        // Display final extracted text
        extractedTextElement.innerHTML = combinedExtractedText;
        return combinedExtractedText;
    } catch (error) {
        console.error('Error processing multiple PDFs:', error);
        extractedTextElement.innerHTML = `Error processing PDFs: ${error.message}`;
        return `Error processing PDFs: ${error.message}`;
    } finally {
        pdfProcessingInProgress = false;
    }
}

// Extract text from PDF file(s) - Main function called from script.js
async function processAllPDFs(files, pageRange = '') {
    // Convert FileList to array if needed
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    
    // If only a single PDF is passed (compatibility with old code)
    if (fileArray.length === 1 && typeof extractTextFromPDF === 'function') {
        return await extractTextFromPDF(fileArray[0], pageRange);
    }
    
    // Multiple PDFs
    return await extractTextFromMultiplePDFs(fileArray, pageRange);
}
