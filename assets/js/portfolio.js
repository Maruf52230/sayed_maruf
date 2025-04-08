// Portfolio Section Generator Script
document.addEventListener('DOMContentLoaded', function() {
    // Find insertion point - just before the Resume Section
    const resumeSection = document.querySelector('#resume');
    
    if (resumeSection) {
        // Create portfolio section
        const portfolioSection = document.createElement('section');
        portfolioSection.id = 'portfolio';
        portfolioSection.className = 'section bg-light';
        
        // Portfolio content
        portfolioSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">My Portfolio</h2>
                <p class="section-subtitle">Explore my latest projects and see how I've helped clients achieve their goals.</p>
                
                <div class="portfolio-filter text-center mb-5">
                    <button class="btn btn-outline-primary mx-1 mb-2 active" data-filter="*">All</button>
                    <button class="btn btn-outline-primary mx-1 mb-2" data-filter=".web">Web Development</button>
                    <button class="btn btn-outline-primary mx-1 mb-2" data-filter=".app">Applications</button>
                    <button class="btn btn-outline-primary mx-1 mb-2" data-filter=".ai">AI Projects</button>
                </div>
                
                <div class="row portfolio-container">
                    <!-- Project 1: GPT Clone -->
                    <div class="col-md-6 col-lg-4 mb-4 portfolio-item ai web">
                        <div class="portfolio-card">
                            <div class="portfolio-item">
                                <img src="assets/imgs/web-1.jpg" alt="GPT Clone" class="img-fluid portfolio-img">
                                <div class="portfolio-overlay">
                                    <h4>GPT Clone</h4>
                                    <p>An AI-powered chatbot interface similar to ChatGPT</p>
                                    <div class="portfolio-buttons">
                                        <a href="assets/projects/gpt_clone/index.html" class="portfolio-button" target="_blank"><i class="ti-link"></i></a>
                                        <a href="#portfolio-modal-1" data-toggle="modal" class="portfolio-button"><i class="ti-search"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Project 2: Al-Quran Web App -->
                    <div class="col-md-6 col-lg-4 mb-4 portfolio-item web app">
                        <div class="portfolio-card">
                            <div class="portfolio-item">
                                <img src="assets/imgs/web-2.jpg" alt="Al-Quran Web App" class="img-fluid portfolio-img">
                                <div class="portfolio-overlay">
                                    <h4>Al-Quran Web App</h4>
                                    <p>A digital Quran application with search and recitation features</p>
                                    <div class="portfolio-buttons">
                                        <a href="assets/projects/Alquran_web_app/index.html" class="portfolio-button" target="_blank"><i class="ti-link"></i></a>
                                        <a href="#portfolio-modal-2" data-toggle="modal" class="portfolio-button"><i class="ti-search"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Project 3: Student Mate -->
                    <div class="col-md-6 col-lg-4 mb-4 portfolio-item app">
                        <div class="portfolio-card">
                            <div class="portfolio-item">
                                <img src="assets/imgs/web-3.jpg" alt="Student Mate" class="img-fluid portfolio-img">
                                <div class="portfolio-overlay">
                                    <h4>Student Mate</h4>
                                    <p>An educational platform designed to help students organize their studies</p>
                                    <div class="portfolio-buttons">
                                        <a href="assets/projects/student_mate/index.html" class="portfolio-button" target="_blank"><i class="ti-link"></i></a>
                                        <a href="#portfolio-modal-3" data-toggle="modal" class="portfolio-button"><i class="ti-search"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create portfolio modals
        const modalsDiv = document.createElement('div');
        modalsDiv.className = 'portfolio-modals';
        modalsDiv.innerHTML = `
            <!-- Portfolio Modal 1: GPT Clone -->
            <div class="modal fade" id="portfolio-modal-1" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">GPT Clone Project</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-4 mb-md-0">
                                    <img src="assets/imgs/web-1.jpg" alt="GPT Clone" class="img-fluid rounded">
                                </div>
                                <div class="col-md-6">
                                    <h4>Project Overview</h4>
                                    <p>A functional clone of ChatGPT that demonstrates my ability to work with modern AI APIs and create intuitive user interfaces.</p>
                                    
                                    <h5 class="mt-4">Technologies Used</h5>
                                    <div class="mb-3">
                                        <span class="badge badge-primary mr-2">HTML5</span>
                                        <span class="badge badge-primary mr-2">CSS3</span>
                                        <span class="badge badge-primary mr-2">JavaScript</span>
                                        <span class="badge badge-primary mr-2">API Integration</span>
                                    </div>
                                    
                                    <h5 class="mt-4">Project Features</h5>
                                    <ul>
                                        <li>Natural language conversation</li>
                                        <li>History tracking</li>
                                        <li>Responsive design</li>
                                        <li>Support for markdown formatting</li>
                                    </ul>
                                    
                                    <div class="mt-4">
                                        <a href="assets/projects/gpt_clone/index.html" class="btn btn-primary" target="_blank">View Project</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Portfolio Modal 2: Al-Quran Web App -->
            <div class="modal fade" id="portfolio-modal-2" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Al-Quran Web App</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-4 mb-md-0">
                                    <img src="assets/imgs/web-2.jpg" alt="Al-Quran Web App" class="img-fluid rounded">
                                </div>
                                <div class="col-md-6">
                                    <h4>Project Overview</h4>
                                    <p>A digital Quran application designed to help users read, search, and listen to Quranic verses, with translation support.</p>
                                    
                                    <h5 class="mt-4">Technologies Used</h5>
                                    <div class="mb-3">
                                        <span class="badge badge-primary mr-2">HTML5</span>
                                        <span class="badge badge-primary mr-2">CSS3</span>
                                        <span class="badge badge-primary mr-2">JavaScript</span>
                                        <span class="badge badge-primary mr-2">RESTful APIs</span>
                                    </div>
                                    
                                    <h5 class="mt-4">Project Features</h5>
                                    <ul>
                                        <li>Complete Quran text with translations</li>
                                        <li>Audio recitation</li>
                                        <li>Search functionality</li>
                                        <li>Bookmark system</li>
                                    </ul>
                                    
                                    <div class="mt-4">
                                        <a href="assets/projects/Alquran_web_app/index.html" class="btn btn-primary" target="_blank">View Project</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Portfolio Modal 3: Student Mate -->
            <div class="modal fade" id="portfolio-modal-3" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Student Mate</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-4 mb-md-0">
                                    <img src="assets/imgs/web-3.jpg" alt="Student Mate" class="img-fluid rounded">
                                </div>
                                <div class="col-md-6">
                                    <h4>Project Overview</h4>
                                    <p>An educational platform designed to help students organize their studies, track assignments, and collaborate with classmates.</p>
                                    
                                    <h5 class="mt-4">Technologies Used</h5>
                                    <div class="mb-3">
                                        <span class="badge badge-primary mr-2">HTML5</span>
                                        <span class="badge badge-primary mr-2">CSS3</span>
                                        <span class="badge badge-primary mr-2">JavaScript</span>
                                        <span class="badge badge-primary mr-2">Backend Integration</span>
                                    </div>
                                    
                                    <h5 class="mt-4">Project Features</h5>
                                    <ul>
                                        <li>Task management</li>
                                        <li>Study timer with Pomodoro technique</li>
                                        <li>Note-taking with rich text formatting</li>
                                        <li>Calendar integration</li>
                                    </ul>
                                    
                                    <div class="mt-4">
                                        <a href="assets/projects/student_mate/index.html" class="btn btn-primary" target="_blank">View Project</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS for portfolio section
        const portfolioStyles = document.createElement('style');
        portfolioStyles.textContent = `
            .portfolio-filter .btn.active {
                background-color: var(--primary);
                color: white;
            }
            
            .portfolio-item .portfolio-img {
                transition: transform 0.6s ease;
                width: 100%;
                height: 220px;
                object-fit: cover;
            }
            
            .portfolio-item:hover .portfolio-img {
                transform: scale(1.08);
            }
        `;
        
        document.head.appendChild(portfolioStyles);
        
        // Insert the portfolio section before the resume section
        resumeSection.parentNode.insertBefore(portfolioSection, resumeSection);
        document.body.appendChild(modalsDiv);
        
        // Initialize Isotope for portfolio filtering
        const portfolioContainer = document.querySelector('.portfolio-container');
        
        if (portfolioContainer) {
            // Initialize Isotope after all images are loaded
            const iso = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            // Filter items on button click
            const filterButtons = document.querySelectorAll('.portfolio-filter button');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to current button
                    this.classList.add('active');
                    
                    // Filter items
                    iso.arrange({
                        filter: filterValue === '*' ? '*' : filterValue
                    });
                });
            });
        }

        // Project slider functionality
        const slides = document.querySelectorAll('.project-slide');
        const indicators = document.querySelectorAll('.project-slide-indicator');
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');
        let currentSlide = 0;

        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Show the selected slide
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentSlide = index;
        }

        // Event listeners for controls
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                showSlide(newIndex);
            });

            nextButton.addEventListener('click', () => {
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            });
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Auto-advance the slider every 5 seconds
        setInterval(() => {
            if (slides.length > 0) {
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                showSlide(newIndex);
            }
        }, 5000);
    }
}); 