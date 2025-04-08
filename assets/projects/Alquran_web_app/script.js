// DOM Elements
const surahListContainer = document.getElementById('surah-list-container');
const versesContainer = document.getElementById('verses-container');
const surahTitle = document.getElementById('surah-title');
const surahInfo = document.getElementById('surah-info');
const searchInput = document.getElementById('search-surah');
const audioPlayer = document.getElementById('audio-player');
const languageButtons = document.querySelectorAll('.lang-btn');
const connectionStatus = document.getElementById('connection-status');
const surahListScreen = document.getElementById('surah-list-screen');
const surahDetailsScreen = document.getElementById('surah-details-screen');
const backButton = document.getElementById('back-button');
const reciteSurahBtn = document.getElementById('recite-surah-btn');
const stopRecitationBtn = document.getElementById('stop-recitation-btn');
const menuButton = document.getElementById('menu-button');
const menuButtonDetails = document.getElementById('menu-button-details');
const drawer = document.getElementById('app-drawer');
const overlay = document.getElementById('drawer-overlay');
const closeDrawerBtn = document.getElementById('close-drawer');
const themeButtons = document.querySelectorAll('.theme-btn');
const lastReadBtn = document.getElementById('last-read-btn');
const lastViewedBtn = document.getElementById('last-viewed-btn');

// App State
let quranData = {};
let chapterData = [];
let translationData = {};
let currentSurah = null;
let currentLanguage = 'en';
let lastLoadedSurah = localStorage.getItem('lastSurah') || '1';
let lastReadVerse = localStorage.getItem('lastReadVerse');
let isOnline = navigator.onLine;
let currentlyPlayingVerse = null;
let recitationQueue = [];
let isRecitingFullSurah = false;

// Helper Functions
function showOfflineStatus() {
    if (!isOnline) {
        connectionStatus.textContent = 'You are offline. Audio playback unavailable.';
        connectionStatus.style.display = 'block';
        setTimeout(() => {
            connectionStatus.style.display = 'none';
        }, 5000);
    }
}

// Screen Navigation
function showScreen(screenToShow, screenToHide) {
    screenToHide.classList.remove('active');
    screenToShow.classList.add('active');
}

// Check online status
window.addEventListener('online', () => {
    isOnline = true;
    connectionStatus.style.display = 'none';
});

window.addEventListener('offline', () => {
    isOnline = false;
    showOfflineStatus();
});

// Initialize the app
async function initApp() {
    try {
        // Load Quran text
        const quranResponse = await fetch('./asset/quran.json');
        quranData = await quranResponse.json();
        
        // Load chapter data (English first)
        const chaptersResponse = await fetch('./asset/chapters/en.json');
        chapterData = await chaptersResponse.json();
        
        // Load English translation
        const translationEnResponse = await fetch('./asset/editions/en.json');
        translationData['en'] = await translationEnResponse.json();
        
        // Make sure lastLoadedSurah is properly initialized
        lastLoadedSurah = localStorage.getItem('lastSurah') || '1';
        lastReadVerse = localStorage.getItem('lastReadVerse');
        console.log('Last surah from localStorage:', lastLoadedSurah);
        
        // Set up Surah list
        displaySurahList();
        
        // Set up back button
        backButton.addEventListener('click', () => {
            showScreen(surahListScreen, surahDetailsScreen);
        });
        
        // Set up search functionality
        searchInput.addEventListener('input', handleSearch);
        
        // Set up recitation buttons
        reciteSurahBtn.addEventListener('click', startSurahRecitation);
        stopRecitationBtn.addEventListener('click', stopSurahRecitation);
        
        // Set up drawer functionality
        menuButton.addEventListener('click', openDrawer);
        menuButtonDetails.addEventListener('click', openDrawer);
        closeDrawerBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);
        
        // Set up theme buttons
        themeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.dataset.theme;
                document.documentElement.style.setProperty('--primary-color', `var(--${theme}-theme)`);
                localStorage.setItem('selected-theme', theme);
            });
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('selected-theme') || 'blue';
        document.documentElement.style.setProperty('--primary-color', `var(--${savedTheme}-theme)`);
        
        // Set up audio player events
        audioPlayer.addEventListener('ended', () => {
            if (isRecitingFullSurah) {
                playNextVerseInQueue();
            }
        });
        
        // Check if offline
        showOfflineStatus();
        
        // Set up last read button
        lastReadBtn.addEventListener('click', () => {
            if (lastReadVerse) {
                const [surahId] = lastReadVerse.split(':');
                loadSurah(parseInt(surahId), true);
            }
        });
        
        // Set up last viewed button
        lastViewedBtn.addEventListener('click', () => {
            const surahId = parseInt(lastLoadedSurah);
            console.log('Last viewed button clicked, loading surah:', surahId);
            loadSurah(surahId, true);
        });
        
        // Update button visibility and text
        updateLastReadButton();
        updateLastViewedButton();
        
        // Load the last viewed Surah if there was one
        if (lastLoadedSurah) {
            loadSurah(parseInt(lastLoadedSurah), false); // Don't navigate automatically
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading Quran data. Please reload the page.');
    }
}

// Display the list of Surahs
function displaySurahList() {
    surahListContainer.innerHTML = '';
    
    chapterData.forEach(surah => {
        const surahElement = document.createElement('div');
        surahElement.className = 'surah-item';
        surahElement.dataset.id = surah.id;
        
        surahElement.innerHTML = `
            <div class="surah-info-container">
                <span class="surah-number">${surah.id}</span>
                <div class="surah-details">
                    <div class="surah-name-container">
                        <span class="surah-name-latin">${surah.transliteration}</span>
                        <span class="surah-verses">${surah.total_verses} verses</span>
                    </div>
                </div>
            </div>
            <div class="surah-name">${surah.name}</div>
        `;
        
        surahElement.addEventListener('click', () => {
            loadSurah(surah.id, true);
        });
        
        surahListContainer.appendChild(surahElement);
    });
}

// Load a specific Surah
function loadSurah(surahId, navigateToDetails = true) {
    // Find the surah data
    const surah = chapterData.find(s => s.id === surahId);
    if (!surah) {
        console.error('Surah not found:', surahId);
        return;
    }
    
    console.log('Loading surah:', surahId);
    currentSurah = surahId;
    
    // Save to localStorage
    localStorage.setItem('lastSurah', surahId.toString());
    lastLoadedSurah = surahId.toString();
    
    // Update surah header
    surahTitle.textContent = `${surah.transliteration}`;
    surahInfo.textContent = `${surah.translation} • ${surah.total_verses} Verses`;
    
    // Display verses
    displayVerses(surahId);
    
    // Navigate to details screen if needed
    if (navigateToDetails) {
        showScreen(surahDetailsScreen, surahListScreen);
    }
    
    // Scroll to top
    versesContainer.scrollTop = 0;
    
    // Reset recitation state
    stopSurahRecitation();
    
    // Update both buttons
    updateLastReadButton();
    updateLastViewedButton();
}

// Display verses for a specific Surah
function displayVerses(surahId) {
    versesContainer.innerHTML = '';
    
    // Get verses for this surah
    const verses = quranData[surahId];
    if (!verses) return;
    
    // Get translations for this language
    const translations = translationData[currentLanguage][surahId];
    
    verses.forEach(verse => {
        const translation = translations.find(t => t.verse === verse.verse);
        const verseId = `${verse.chapter}:${verse.verse}`;
        
        const verseElement = document.createElement('div');
        verseElement.className = 'verse-container';
        verseElement.dataset.verse = verseId;
        
        // Add last-read class if this is the last read verse
        if (lastReadVerse === verseId) {
            verseElement.classList.add('last-read');
        }
        
        verseElement.innerHTML = `
            <div class="verse-header">
                <span class="verse-number">${verse.verse}</span>
            </div>
            <div class="verse-text-arabic">${verse.text}</div>
            <div class="verse-translation">
                <div class="translation-text">${translation ? translation.text : ''}</div>
                <div class="translation-lang">${currentLanguage === 'en' ? 'English' : 'বাংলা'}</div>
            </div>
            <button class="audio-btn" data-verse="${verseId}">
                <i class="fas fa-play"></i> Play Audio
            </button>
        `;
        
        // Add audio functionality
        const audioBtn = verseElement.querySelector('.audio-btn');
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent verse click when clicking audio button
            playAudio(e.currentTarget);
        });
        
        // Add click event to save last read position
        verseElement.addEventListener('click', () => {
            // Remove last-read class from all verses
            document.querySelectorAll('.verse-container').forEach(v => v.classList.remove('last-read'));
            // Add last-read class to clicked verse
            verseElement.classList.add('last-read');
            // Save last read position
            handleVerseClick(verseId);
        });
        
        versesContainer.appendChild(verseElement);
    });

    // Scroll to last read verse if exists
    if (lastReadVerse) {
        const [lastSurah, lastVerse] = lastReadVerse.split(':');
        if (parseInt(lastSurah) === surahId) {
            const verseElement = document.querySelector(`.verse-container[data-verse="${lastReadVerse}"]`);
            if (verseElement) {
                verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
}

// Start recitation of the whole surah
function startSurahRecitation() {
    if (!isOnline) {
        showOfflineStatus();
        return;
    }
    
    // Stop any current playback
    stopSurahRecitation();
    
    // Get all verses for the current surah
    const verses = quranData[currentSurah];
    if (!verses || verses.length === 0) return;
    
    // Set up the recitation queue
    recitationQueue = verses.map(verse => `${verse.chapter}:${verse.verse}`);
    isRecitingFullSurah = true;
    
    // Update UI
    reciteSurahBtn.style.display = 'none';
    stopRecitationBtn.style.display = 'flex';
    
    // Start playing the first verse
    playNextVerseInQueue();
}

// Play the next verse in the queue
function playNextVerseInQueue() {
    // If queue is empty or recitation was stopped, exit
    if (recitationQueue.length === 0 || !isRecitingFullSurah) {
        stopSurahRecitation();
        return;
    }
    
    // Get the next verse ID
    const nextVerseId = recitationQueue.shift();
    
    // Remove playing class from previous verse
    if (currentlyPlayingVerse) {
        const prevVerseElement = document.querySelector(`.verse-container[data-verse="${currentlyPlayingVerse}"]`);
        if (prevVerseElement) {
            prevVerseElement.classList.remove('playing');
        }
    }
    
    // Find the verse element and mark it as playing
    const verseElement = document.querySelector(`.verse-container[data-verse="${nextVerseId}"]`);
    if (verseElement) {
        verseElement.classList.add('playing');
        
        // Scroll to the verse
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Update current playing verse
    currentlyPlayingVerse = nextVerseId;
    
    // Get verse details
    const [chapter, verse] = nextVerseId.split(':');
    
    // Play the audio
    playVerseAudio(chapter, verse);
}

// Play audio for a specific verse (used by recitation feature)
async function playVerseAudio(chapter, verse) {
    try {
        // Use updated Quran.com API endpoint format
        const audioUrl = `https://verses.quran.com/Alafasy/mp3/${chapter}${verse.padStart(3, '0')}.mp3`;
        
        audioPlayer.src = audioUrl;
        
        audioPlayer.onloadeddata = () => {
            audioPlayer.play();
        };
        
        audioPlayer.onerror = () => {
            // If first attempt fails, try an alternative API endpoint
            const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${getVerseNumber(chapter, verse)}.mp3`;
            audioPlayer.src = fallbackUrl;
            
            audioPlayer.onloadeddata = () => {
                audioPlayer.play();
            };
            
            audioPlayer.onerror = () => {
                // If both attempts fail, move to the next verse
                console.error('Error playing verse audio:', chapter, verse);
                playNextVerseInQueue();
            };
        };
    } catch (error) {
        console.error('Error playing verse audio:', error);
        playNextVerseInQueue();
    }
}

// Stop surah recitation
function stopSurahRecitation() {
    isRecitingFullSurah = false;
    recitationQueue = [];
    audioPlayer.pause();
    
    // Update UI
    reciteSurahBtn.style.display = 'flex';
    stopRecitationBtn.style.display = 'none';
    
    // Remove playing class from current verse
    if (currentlyPlayingVerse) {
        const verseElement = document.querySelector(`.verse-container[data-verse="${currentlyPlayingVerse}"]`);
        if (verseElement) {
            verseElement.classList.remove('playing');
        }
        currentlyPlayingVerse = null;
    }
}

// Handle audio playback for individual verses
async function playAudio(button) {
    // Stop any ongoing surah recitation
    stopSurahRecitation();
    
    if (!isOnline) {
        button.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline, audio unavailable';
        button.classList.add('error');
        showOfflineStatus();
        return;
    }
    
    const verseId = button.dataset.verse;
    const [chapter, verse] = verseId.split(':');
    
    try {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.classList.add('loading');
        
        // Use updated Quran.com API endpoint format
        // First try with the newer V4 API
        // Using recitation ID 7 which is Mishari Rashid al-`Afasy
        const audioUrl = `https://verses.quran.com/Alafasy/mp3/${chapter}${verse.padStart(3, '0')}.mp3`;
        
        audioPlayer.src = audioUrl;
        
        audioPlayer.onloadeddata = () => {
            button.innerHTML = '<i class="fas fa-volume-up"></i> Playing...';
            audioPlayer.play();
        };
        
        audioPlayer.onended = () => {
            button.innerHTML = '<i class="fas fa-play"></i> Play Audio';
            button.classList.remove('loading');
        };
        
        audioPlayer.onerror = () => {
            // If first attempt fails, try an alternative API endpoint
            const fallbackUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${getVerseNumber(chapter, verse)}.mp3`;
            audioPlayer.src = fallbackUrl;
            
            audioPlayer.onloadeddata = () => {
                button.innerHTML = '<i class="fas fa-volume-up"></i> Playing...';
                audioPlayer.play();
            };
            
            audioPlayer.onended = () => {
                button.innerHTML = '<i class="fas fa-play"></i> Play Audio';
                button.classList.remove('loading');
            };
            
            audioPlayer.onerror = () => {
                button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error loading audio';
                button.classList.remove('loading');
                button.classList.add('error');
            };
        };
    } catch (error) {
        console.error('Error playing audio:', error);
        button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error loading audio';
        button.classList.remove('loading');
        button.classList.add('error');
    }
}

// Helper function to calculate absolute verse number
function getVerseNumber(chapter, verse) {
    // This is a simplified approach - for a complete solution
    // we would need to calculate based on the actual verse counts
    // But for our demo, we'll use this simplified version
    const chapterVerses = [
        7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111,
        43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64,
        77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83,
        182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29,
        18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
        14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28,
        20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25,
        22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19,
        5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
        6, 3, 5, 4, 5, 6
    ];
    
    let verseNum = parseInt(verse);
    for (let i = 0; i < parseInt(chapter) - 1; i++) {
        verseNum += chapterVerses[i];
    }
    
    return verseNum;
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    document.querySelectorAll('.surah-item').forEach(item => {
        const surahName = item.textContent.toLowerCase();
        if (surahName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Handle language switching
async function switchLanguage(lang) {
    if (lang === currentLanguage) return;
    
    // Update UI for language buttons
    languageButtons.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load translation data if not loaded yet
    if (!translationData[lang]) {
        try {
            const translationResponse = await fetch(`./asset/editions/${lang}.json`);
            translationData[lang] = await translationResponse.json();
            
            // Also update chapter data for the new language
            const chaptersResponse = await fetch(`./asset/chapters/${lang}.json`);
            chapterData = await chaptersResponse.json();
            
            // Update surah list with new language
            displaySurahList();
        } catch (error) {
            console.error(`Error loading ${lang} translation:`, error);
            alert(`Failed to load ${lang} translation. Reverting to English.`);
            
            // Revert to English
            languageButtons.forEach(btn => {
                if (btn.dataset.lang === 'en') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            return;
        }
    } else {
        // If translation is already loaded, just update chapter data
        const chaptersResponse = await fetch(`./asset/chapters/${lang}.json`);
        chapterData = await chaptersResponse.json();
        
        // Update surah list with new language
        displaySurahList();
    }
    
    // Update current language
    currentLanguage = lang;
    
    // Reload current surah with new language
    if (currentSurah) {
        loadSurah(currentSurah, false); // Don't navigate again
    }
}

// Set up language button event listeners
languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.dataset.lang);
    });
});

// Add swipe gesture for going back
let touchStartX = 0;
let touchEndX = 0;

surahDetailsScreen.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

surahDetailsScreen.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    // Swipe right (to go back)
    if (touchEndX - touchStartX > 100) {
        showScreen(surahListScreen, surahDetailsScreen);
    }
}

// Drawer functions
function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Handle verse click to save last read position
function handleVerseClick(verseId) {
    lastReadVerse = verseId;
    localStorage.setItem('lastReadVerse', verseId);
    updateLastReadButton(); // Update the button text immediately
}

// Update last read button visibility and information
function updateLastReadButton() {
    if (lastReadVerse) {
        // Show the surah and verse number in the button
        const [surahId, verseNum] = lastReadVerse.split(':');
        
        // Get the surah name
        const surah = chapterData.find(s => s.id === parseInt(surahId));
        if (surah) {
            lastReadBtn.innerHTML = `
                <i class="fas fa-bookmark"></i>
                <span>${surah.transliteration}: ${verseNum}</span>
            `;
        } else {
            lastReadBtn.innerHTML = `
                <i class="fas fa-bookmark"></i>
                <span>Surah ${surahId}: ${verseNum}</span>
            `;
        }
        
        lastReadBtn.style.display = 'flex';
    } else {
        lastReadBtn.style.display = 'none';
    }
}

// Update last viewed button visibility and information
function updateLastViewedButton() {
    if (lastLoadedSurah) {
        // Get the surah name
        const surah = chapterData.find(s => s.id === parseInt(lastLoadedSurah));
        if (surah) {
            lastViewedBtn.innerHTML = `
                <i class="fas fa-history"></i>
                <span>${surah.transliteration}</span>
            `;
        } else {
            lastViewedBtn.innerHTML = `
                <i class="fas fa-history"></i>
                <span>Surah ${lastLoadedSurah}</span>
            `;
        }
        
        lastViewedBtn.style.display = 'flex';
    } else {
        lastViewedBtn.style.display = 'none';
    }
    console.log('Last viewed surah set to:', lastLoadedSurah);
}

// Start the app
initApp(); 