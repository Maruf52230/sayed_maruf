/**
 * API integration for DeepSeek R1 Zero via OpenRouter
 * Sends extracted text to AI for note generation
 */

// OpenRouter API key (replace with your actual API key in production)
const OPENROUTER_API_KEY = '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';

// Maximum number of retries for API calls
const MAX_RETRIES = 2;

// Flag to track if an API request is in progress
let apiRequestInProgress = false;

// Function to generate notes from extracted text
async function generateNotes(extractedText) {
    // Check if another request is already in progress
    if (apiRequestInProgress) {
        console.warn('Another API request is already in progress');
        return 'Processing previous request, please wait...';
    }

    if (!extractedText || extractedText.trim() === '') {
        return 'Please extract text first before generating notes.';
    }
    
    // Set the flag to indicate a request is in progress
    apiRequestInProgress = true;
    
    try {
        console.log('Sending text to DeepSeek R1 Zero API...');

        // Limit text size to prevent API errors (typically 4096 tokens max)
        const trimmedText = extractedText.length > 700 ? 
            extractedText.substring(0, 700) + "... (text truncated due to length)" : 
            extractedText;
        
        // Set up error tracking
        let error = null;
        let retries = 0;
        let response = null;
        
        // Attempt the API call with retries
        while (retries <= MAX_RETRIES) {
            try {
                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': window.location.href,
                        'X-Title': 'Note Maker App'
                    },
                    body: JSON.stringify({
                        model: "deepseek/deepseek-r1-zero:free",
                        messages: [{ 
                            role: "user", 
                            content: `Summarize the following text clearly and concisely:
    - Provide a brief summary capturing the core message and important details.
    - Identify the keylines from the text and explain them in simple language for better understanding.
    - Format the output as well-structured bullet points or numbered lists.
    - Highlight important terms or keywords using bold formatting.
    - Ensure the explanation is easy to understand and retains the original meaning accurately.

    Text:
                            "${trimmedText}"`
                        }],
                        temperature: 0.3,
                        max_tokens: 700
                    })
                });
                
                // If response is successful, break the retry loop
                if (response.ok) {
                    break;
                }
                
                // If we get here, the response had an error status
                const errorData = await response.json();
                error = new Error(`API error: ${errorData.error || response.status}`);
                console.warn('API error response:', errorData);
                
            } catch (err) {
                error = err;
                console.warn(`API call attempt ${retries + 1} failed:`, err);
            }
            
            // Increment retry counter
            retries++;
            
            // Wait before retrying (exponential backoff)
            if (retries <= MAX_RETRIES) {
                const backoffMs = Math.pow(2, retries) * 1000;
                console.log(`Retrying in ${backoffMs/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, backoffMs));
            }
        }
        
        // If we exhausted all retries and still have an error, throw it
        if (!response || !response.ok) {
            throw error || new Error('Failed to get a valid response after multiple attempts');
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid response format from API');
        }
        
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error generating notes:', error);
        return `Error generating notes: ${error.message}. Please try again later.`;
    } finally {
        // Reset the flag regardless of success or failure
        apiRequestInProgress = false;
    }
}

// Function to create a PDF from the generated notes
function saveNotesAsPDF(notes) {
    if (!notes || notes.trim() === '') {
        alert('Please generate notes first before saving as PDF.');
        return false;
    }
    
    try {
        console.log('Generating multi-page PDF...');
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            throw new Error('jsPDF library not loaded. Check script includes.');
        }
        
        const doc = new jsPDF();
        
        // Page dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20; // Margins in mm
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);
        
        // Document title
        const title = 'Generated Notes';
        const currentDate = new Date().toLocaleDateString();
        
        // Process HTML content (remove HTML tags if present)
        const processedNotes = notes.replace(/<[^>]*>/g, '')
                                    .replace(/Error generating notes:.+?\. Please try again later\./g, '')
                                    .replace(/API error:.+?$/gm, '')
                                    .trim();
        
        // Set document metadata
        doc.setProperties({
            title: title,
            subject: 'AI-Generated Notes',
            creator: 'Note Maker App',
            author: 'User',
            keywords: 'notes, ai, pdf',
            creationDate: new Date()
        });
        
        // Set font and size
        doc.setFont('helvetica');
        doc.setFontSize(11);
        
        // Split the text into lines that fit the width
        const textLines = doc.splitTextToSize(processedNotes, contentWidth);
        
        // Add title to the first page
        doc.setFontSize(18);
        doc.text(title, margin, margin + 5);
        doc.setFontSize(11);
        doc.text(`Date: ${currentDate}`, margin, margin + 12);
        
        // Start position for content
        let yPosition = margin + 20;
        const lineHeight = 7; // Height of each line in mm
        
        // Add text content with pagination
        for (let i = 0; i < textLines.length; i++) {
            // Check if we need to start a new page
            if (yPosition + lineHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin + 10; // Reset Y position for new page
                
                // Add page header
                doc.setFontSize(10);
                doc.text(`${title} - Page ${doc.internal.getNumberOfPages()}`, margin, margin);
                doc.setFontSize(11);
            }
            
            // Add the current line of text
            doc.text(textLines[i], margin, yPosition);
            yPosition += lineHeight;
        }
        
        // Add page numbers to all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10);
        }
        
        // Save the PDF
        doc.save('generated-notes.pdf');
        
        console.log(`Generated PDF with ${totalPages} pages`);
        return true;
    } catch (error) {
        console.error('Error creating PDF:', error);
        alert(`Error creating PDF: ${error.message}`);
        return false;
    }
} 