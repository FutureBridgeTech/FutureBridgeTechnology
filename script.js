/* -------------------------------------------------------------
   FutureBridge Technologies - Interactive Features script
   Includes: Particle canvas, scroll animations, testimonials,
             before/after toggling, animated stats counters,
             and validation with success simulation.
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. Light Mode Initialization
    // ==========================================
    // Force light theme permanently
    try {
        localStorage.setItem('fb-theme', 'light');
    } catch (e) {
        console.warn('localStorage is not available, skipping theme save.');
    }
    document.body.classList.add('light-mode');


    // ==========================================
    // 0b. Scroll Reveal System
    // ==========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // For stat numbers, trigger count-bounce
                if (entry.target.classList.contains('stat-card')) {
                    const num = entry.target.querySelector('.stat-number');
                    if (num) num.classList.add('animate-in');
                }
                // Reveal gradient text underlines
                const gradText = entry.target.querySelector('.gradient-text');
                if (gradText) gradText.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    // Apply reveal class to all key sections and their children
    document.querySelectorAll('.section-header, .service-card, .stat-card, .step-item, .spotlight-card, .testimonial-slide, .glass-card, .before-card, .after-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Stagger grids
    document.querySelectorAll('.services-grid, .stats-grid, .spotlights-grid').forEach(el => {
        el.classList.add('reveal-stagger');
        revealObserver.observe(el);
        // Remove individual reveal from children since stagger handles it
        el.querySelectorAll('.reveal').forEach(child => {
            child.classList.remove('reveal');
            revealObserver.unobserve(child);
        });
    });


    // ==========================================
    // 1. Navigation Header & Mobile Menu
    // ==========================================
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll class to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting on scroll
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Mobile Hamburger Menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
    });

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('mobile-active');
        });
    });


    // ==========================================
    // 2. Interactive Before/After Toggle
    // ==========================================
    const comparisonToggle = document.getElementById('comparison-toggle');
    const beforeLabel = document.getElementById('toggle-label-before');
    const afterLabel = document.getElementById('toggle-label-after');
    const beforeCard = document.getElementById('card-before');
    const afterCard = document.getElementById('card-after');

    function toggleComparison(showAfter) {
        if (showAfter) {
            comparisonToggle.classList.add('toggled');
            comparisonToggle.setAttribute('aria-checked', 'true');
            beforeLabel.classList.remove('active');
            afterLabel.classList.add('active');
            beforeCard.classList.remove('active-card');
            afterCard.classList.add('active-card');
        } else {
            comparisonToggle.classList.remove('toggled');
            comparisonToggle.setAttribute('aria-checked', 'false');
            beforeLabel.classList.add('active');
            afterLabel.classList.remove('active');
            beforeCard.classList.add('active-card');
            afterCard.classList.remove('active-card');
        }
    }

    comparisonToggle.addEventListener('click', () => {
        const isToggled = comparisonToggle.classList.contains('toggled');
        toggleComparison(!isToggled);
    });

    beforeLabel.addEventListener('click', () => toggleComparison(false));
    afterLabel.addEventListener('click', () => toggleComparison(true));


    // ==========================================
    // 3. Auto-Scrolling Testimonials Carousel (Full-Width Multiple Tiles)
    // ==========================================
    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.getElementById('dynamic-stories-container');
    let slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-arrow');
    const nextBtn = document.getElementById('next-arrow');
    const dotContainer = document.getElementById('slider-dots');
    
    let currentSlide = 0;
    let slideCount = slides.length;
    let autoSlideInterval;

    // Determine slides per page dynamically
    function getSlidesPerPage() {
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    // Number of dots needed is slideCount - slidesPerPage + 1
    function buildDots() {
        dotContainer.innerHTML = '';
        const slidesPerPage = getSlidesPerPage();
        const maxSteps = Math.max(1, slideCount - slidesPerPage + 1);
        
        for (let i = 0; i < maxSteps; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotContainer.appendChild(dot);
        }
    }

    buildDots();
    window.addEventListener('resize', () => {
        buildDots();
        updateSliderPosition();
    });

    function updateSliderPosition() {
        const slidesPerPage = getSlidesPerPage();
        const maxSlide = Math.max(0, slideCount - slidesPerPage);
        if (currentSlide > maxSlide) {
            currentSlide = maxSlide;
        }

        const firstSlide = slides[0];
        if (firstSlide) {
            const slideStyle = window.getComputedStyle(firstSlide);
            const slideWidth = firstSlide.getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(sliderWrapper).gap) || 24;
            
            sliderContainer.scrollTo({
                left: currentSlide * (slideWidth + gap),
                behavior: 'smooth'
            });
        }

        // Highlight active dot
        const dots = dotContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function nextSlide() {
        const slidesPerPage = getSlidesPerPage();
        const maxSlide = Math.max(0, slideCount - slidesPerPage);
        
        if (currentSlide >= maxSlide) {
            currentSlide = 0; // Wrap around to start
        } else {
            currentSlide++;
        }
        updateSliderPosition();
    }

    function prevSlide() {
        const slidesPerPage = getSlidesPerPage();
        const maxSlide = Math.max(0, slideCount - slidesPerPage);
        
        if (currentSlide <= 0) {
            currentSlide = maxSlide; // Wrap around to end
        } else {
            currentSlide--;
        }
        updateSliderPosition();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSliderPosition();
        resetAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Auto slide scroll
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6500);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Listen to manual scrolling to update dot indicator state
    let scrollTimeout;
    sliderContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const firstSlide = slides[0];
            if (firstSlide) {
                const slideWidth = firstSlide.getBoundingClientRect().width;
                const gap = parseFloat(window.getComputedStyle(sliderWrapper).gap) || 24;
                const index = Math.round(sliderContainer.scrollLeft / (slideWidth + gap));
                
                const slidesPerPage = getSlidesPerPage();
                const maxSlide = Math.max(0, slideCount - slidesPerPage);
                currentSlide = Math.min(maxSlide, Math.max(0, index));
                
                const dots = dotContainer.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentSlide);
                });
            }
        }, 100);
    });


    // ==========================================
    // 4. Scrolling Stats Animation (Counter)
    // ==========================================
    const statCards = document.querySelectorAll('.stat-card');
    let countersStarted = false;

    function runCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(numElement => {
            const target = parseFloat(numElement.getAttribute('data-target'));
            const isDecimal = numElement.getAttribute('data-decimal') === 'true';
            let start = 0;
            const duration = 2000; // 2 seconds animation
            const steps = 50;
            const stepVal = target / steps;
            const intervalTime = duration / steps;

            let currentStep = 0;
            const counterInterval = setInterval(() => {
                currentStep++;
                start += stepVal;
                
                if (currentStep >= steps) {
                    clearInterval(counterInterval);
                    // Set final value perfectly
                    if (isDecimal) {
                        numElement.textContent = (target / 10).toFixed(1);
                    } else {
                        numElement.textContent = Math.round(target).toLocaleString() + '+';
                    }
                } else {
                    if (isDecimal) {
                        numElement.textContent = (start / 10).toFixed(1);
                    } else {
                        numElement.textContent = Math.round(start).toLocaleString() + '+';
                    }
                }
            }, intervalTime);
        });
    }

    // Scroll Observer to trigger counter when section is in view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                runCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsGrid = document.getElementById('stats-counter-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }


    // ==========================================
    // 5. Contact Consultation Form & Validation
    // ==========================================
    const form = document.getElementById('placement-form');
    const fileInput = document.getElementById('resume-upload');
    const uploadText = document.getElementById('upload-text');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Display selected file name
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            uploadText.textContent = `Resume: ${fileInput.files[0].name}`;
            uploadText.style.color = '#00F2FE'; // cyan active
        } else {
            uploadText.textContent = "Upload Resume / CV (Optional)";
            uploadText.style.color = '';
        }
    });

    // Form inputs validation helper
    function validateField(inputElement, errorElement, validationFn) {
        const isValid = validationFn(inputElement.value.trim());
        const parent = inputElement.parentElement;
        
        if (!isValid) {
            parent.classList.add('invalid');
        } else {
            parent.classList.remove('invalid');
        }
        return isValid;
    }

    // Input checking functions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[0-9\s\-()]{7,18}$/;

    // Interactive keyup validation triggers
    document.getElementById('candidate-name').addEventListener('input', (e) => {
        validateField(e.target, document.getElementById('name-error'), val => val.length >= 2);
    });
    
    document.getElementById('candidate-email').addEventListener('input', (e) => {
        validateField(e.target, document.getElementById('email-error'), val => emailRegex.test(val));
    });

    document.getElementById('candidate-phone').addEventListener('input', (e) => {
        validateField(e.target, document.getElementById('phone-error'), val => phoneRegex.test(val));
    });

    document.getElementById('visa-status').addEventListener('change', (e) => {
        validateField(e.target, document.getElementById('visa-error'), val => val !== '');
    });

    document.getElementById('target-role').addEventListener('change', (e) => {
        validateField(e.target, document.getElementById('role-error'), val => val !== '');
    });

    // Handle form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('candidate-name');
        const emailInput = document.getElementById('candidate-email');
        const phoneInput = document.getElementById('candidate-phone');
        const visaSelect = document.getElementById('visa-status');
        const roleSelect = document.getElementById('target-role');

        const nameValid = validateField(nameInput, document.getElementById('name-error'), val => val.length >= 2);
        const emailValid = validateField(emailInput, document.getElementById('email-error'), val => emailRegex.test(val));
        const phoneValid = validateField(phoneInput, document.getElementById('phone-error'), val => phoneRegex.test(val));
        const visaValid = validateField(visaSelect, document.getElementById('visa-error'), val => val !== '');
        const roleValid = validateField(roleSelect, document.getElementById('role-error'), val => val !== '');

        if (nameValid && emailValid && phoneValid && visaValid && roleValid) {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const visa = visaSelect.value;
            const role = roleSelect.value;

            // Format WhatsApp pre-filled message
            const textMsg = `Hello FutureBridge Technologies,%0A%0AI would like to book a Free Placement Session.%0A%0A*Full Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Visa Status:* ${encodeURIComponent(visa)}%0A*Target Role:* ${encodeURIComponent(role)}`;

            const whatsappUrl = `https://wa.me/919595579336?text=${textMsg}`;

            // Open WhatsApp directly
            window.open(whatsappUrl, '_blank');

            // Show success popup on the page
            if (typeof successModal !== 'undefined' && successModal) {
                successModal.classList.remove('hide');
            }

            // Reset form values
            form.reset();
            if (uploadText) {
                uploadText.textContent = "Upload Resume / CV (Optional)";
                uploadText.style.color = '';
            }
        }
    });

    // Close Modal event handler
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.add('hide');
    });

    // Click outside modal content to close it
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.add('hide');
        }
    });

    // ==========================================
    // 5.5 Detailed Success Stories Modals Logic
    // ==========================================
    const successStories = [
        {
            name: "Anisha Mehta",
            title: "Cloud Solutions Architect @ Oracle",
            visa: "STEM OPT Candidate",
            image: "assets/headshot2.png",
            rating: "5.0",
            videoUrl: "https://www.youtube.com/embed/PjU5cxGVMeY",
            situation: "Anisha completed her MS in Computer Science but was struggling to get callbacks. With only 20 days left on her F-1 OPT unemployment clock, she was feeling highly stressed and overwhelmed by automated ATS rejections.",
            approach: "The FutureBridge team completely engineered her resume, matching it to enterprise cloud parameters. We enrolled her in our specialized systems design cohort and directly marketed her profile to Prime Vendors and direct clients in our network.",
            results: [
                "Secured 4 client interviews within the first week of marketing.",
                "Landed and signed a Cloud Solutions Architect role at Oracle.",
                "Achieved an annual baseline package of $130,000.",
                "Full F-1 STEM OPT visa extension compliance guided and verified."
            ]
        },
        {
            name: "Karthik Patel",
            title: "Data Engineer @ Cognizant",
            visa: "H-1B Visa Placed",
            image: "assets/headshot3.png",
            rating: "5.0",
            videoUrl: "https://www.youtube.com/embed/lHGZ7VrMbrE",
            situation: "Karthik wanted to secure a corporate Data Engineering position in the US, but faced repeated barriers finding employers willing to support H-1B visa sponsorships. Many applications ended at the sponsorship questionnaire stage.",
            approach: "We aligned Karthik with our data automation prep tracks. Our submission specialists marketed his profile specifically to H-1B supportive corporate clients and Prime Staffing vendors in our database, bypassing public application filtering.",
            results: [
                "Placed as a Data Engineer at Cognizant in a visa-supportive contract-to-hire arrangement.",
                "H-1B sponsorship petition filed and selected in his first lottery attempt.",
                "Hourly rates structured to equivalent of $122,000 annual compensation.",
                "Smooth corporate transition and H-1B compliance monitoring."
            ]
        },
        {
            name: "Jack Chen",
            title: "Frontend Developer @ Stripe",
            visa: "F-1 OPT Candidate",
            image: "assets/headshot1.png",
            rating: "4.9",
            videoUrl: "https://www.youtube.com/embed/PjU5cxGVMeY",
            situation: "Jack was a talented frontend developer but struggled with technical communication and system design interviews. He was consistently getting rejected at the final round stage, denting his confidence.",
            approach: "Our technical coaches worked 1-on-1 with Jack using recording analytics to isolate communication gaps. We put him through targeted mock interviews using the STAR method for behavioral responses and deep systems architecture.",
            results: [
                "Secured a Frontend Developer position at Stripe in San Francisco.",
                "Successfully negotiated base salary upwards from $110,000 to $135,000.",
                "Received medical, dental, annual bonus, and 401(k) matching.",
                "OPT visa reporting and employer compliance fully aligned."
            ]
        }
    ];

    const storyModal = document.getElementById('story-modal');
    const closeStoryBtn = document.getElementById('close-story-btn');
    const spotlightCards = document.querySelectorAll('.spotlight-card');

    // Modal elements to fill
    const modalImg = document.getElementById('modal-student-img');
    const modalName = document.getElementById('modal-student-name');
    const modalTitle = document.getElementById('modal-student-title');
    const modalVisa = document.getElementById('modal-student-visa');
    const modalRating = document.getElementById('modal-student-rating');
    const modalVideoIframe = document.getElementById('modal-video-iframe');
    const modalSituation = document.getElementById('modal-story-situation');
    const modalApproach = document.getElementById('modal-story-approach');
    const modalResults = document.getElementById('modal-story-results');

    spotlightCards.forEach(card => {
        card.addEventListener('click', () => {
            const studentIdx = parseInt(card.getAttribute('data-student'));
            const story = successStories[studentIdx];

            if (story) {
                // Populate Modal Data
                modalImg.src = story.image;
                modalImg.alt = story.name;
                modalName.textContent = story.name;
                modalTitle.textContent = story.title;
                modalVisa.textContent = story.visa;
                modalRating.innerHTML = `<i class="fa-solid fa-star"></i> ${story.rating}`;
                modalVideoIframe.src = story.videoUrl;
                modalSituation.textContent = story.situation;
                modalApproach.textContent = story.approach;

                // Clear and build results list items
                modalResults.innerHTML = '';
                story.results.forEach(res => {
                    const li = document.createElement('li');
                    li.textContent = res;
                    modalResults.appendChild(li);
                });

                // Display Modal
                storyModal.classList.remove('hide');
            }
        });
    });

    // Close Story Modal
    function closeStory() {
        storyModal.classList.add('hide');
        modalVideoIframe.src = ''; // stop video playing
    }

    closeStoryBtn.addEventListener('click', closeStory);
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) {
            closeStory();
        }
    });

    // Simple 3D Tilt Effect on hover for Spotlight Cards
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max 5 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });


    // ==========================================
    // Removed Particle Canvas and Custom Cursor logic for clean corporate UI

    // ==========================================
    // 8. Scroll Progress Bar
    // ==========================================
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            scrollProgressBar.style.width = scrollPercent + '%';
        });
    }

    // ==========================================
    // 9. Auto-scroll Spotlights
    // ==========================================
    const spotlightsGrid = document.querySelector('.new-spotlights-layout');
    if (spotlightsGrid) {
        let scrollDirection = 1;
        
        // Auto scroll every 4 seconds
        setInterval(() => {
            // Scroll by one card width (approx 300px)
            const scrollAmount = 300 * scrollDirection;
            spotlightsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            
            // Wait for scroll animation to finish, then check if we reached the edge
            setTimeout(() => {
                if (scrollDirection === 1 && (spotlightsGrid.scrollLeft + spotlightsGrid.clientWidth >= spotlightsGrid.scrollWidth - 10)) {
                    scrollDirection = -1; // Reverse direction when reaching the end
                } else if (scrollDirection === -1 && spotlightsGrid.scrollLeft <= 10) {
                    scrollDirection = 1; // Go forward again when reaching the start
                }
            }, 800);
        }, 4000);
    }

    // ==========================================
    // 10. Form Submission & Dual Integration (Web3Forms + WhatsApp)
    // ==========================================
    const placementForm = document.getElementById('placement-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (placementForm) {
        placementForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Basic HTML5 validation check
            if (!this.checkValidity()) {
                // simple loop to show errors
                const inputs = this.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if(!input.validity.valid) {
                        const errorMsg = document.getElementById(input.id.replace('candidate-', '') + '-error');
                        if (errorMsg) errorMsg.style.display = 'block';
                    } else {
                        const errorMsg = document.getElementById(input.id.replace('candidate-', '') + '-error');
                        if (errorMsg) errorMsg.style.display = 'none';
                    }
                });
                return;
            }

            // Hide validation errors if valid
            const allErrors = this.querySelectorAll('.error-msg');
            allErrors.forEach(err => err.style.display = 'none');

            // Show loader
            const btnText = formSubmitBtn.querySelector('.btn-text');
            const btnLoader = formSubmitBtn.querySelector('.btn-loader');
            
            if (btnText && btnLoader) {
                btnText.classList.add('hide');
                btnLoader.classList.remove('hide');
            }

            const formData = new FormData(placementForm);
            
            // 1. Send to Web3Forms for Email Inbox (Async)
            try {
                // The access_key is dynamically pulled from the hidden input in HTML
                await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
            } catch (err) {
                console.error("Web3Forms error", err);
            }

            // 2. Format WhatsApp Message
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const visa = formData.get('visa');
            const role = formData.get('role');
            
            const waNumber = "19177550774"; // Default US number requested by user intent
            const text = `Hello FutureBridge Team! I am interested in your placement services.\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Visa:* ${visa}\n*Target Role:* ${role}`;
            const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(text)}`;

            // Restore button
            if (btnText && btnLoader) {
                btnText.classList.remove('hide');
                btnLoader.classList.add('hide');
            }

            // Show success modal
            if (successModal) {
                successModal.classList.remove('hide');
            }
            
            // Open WhatsApp in new tab
            window.open(waUrl, '_blank');
            
            placementForm.reset();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('hide');
        });
    }

    // ==========================================
    // 11. Pricing Plan Inline Features Logic
    // ==========================================
    const readMoreBtns = document.querySelectorAll('.btn-read-more');

    const planFeatures = {
        'basic': [
            'Interview Preparation (Webinar)',
            'Recorded Technical Training',
            'Resume Preparations',
            'Webinar for Resume Understanding Session',
            'Resume Marketing',
            'Associate Recruiter',
            'Upto 100 Applications (Depend on Daily Market Requirements)',
            'Full Time / W2'
        ],
        'elite': [
            'Live Technical Brush up With Tech Expert',
            'Mock Interview Session',
            'Interview Preparation (Webinar)',
            'Recorded Technical Training',
            'Interview Help',
            'Resume Preparations',
            'Webinar for Resume Understanding Session',
            'One To One Resume Understanding Session',
            'Resume Marketing',
            'Associate Recruiter',
            'Upto 200 Applications (Depend on Daily Market Requirements)',
            'Email / Linkedin Chat Support',
            'Full Time / W2'
        ],
        'premium': [
            'Live Technical Brush up With Tech Expert',
            'Mock Interview Session',
            'Interview Preparation (Webinar)',
            'Recorded Technical Training',
            'Interview Help',
            'Resume Preparations',
            'Webinar for Resume Understanding Session',
            'One To One Resume Understanding Session',
            'Resume Marketing',
            'Associate Recruiter',
            'Personal Recruiter',
            'Upto 200 Applications (Depend on Daily Market Requirements)',
            'Email / Linkedin Chat Support',
            'Automation Tools',
            'Full Time / W2'
        ]
    };

    // Pre-populate the inline containers
    if (readMoreBtns.length > 0) {
        Object.keys(planFeatures).forEach(planKey => {
            const container = document.getElementById(`features-${planKey}`);
            if(container) {
                const ul = container.querySelector('ul');
                ul.innerHTML = planFeatures[planKey].map(feature => `
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                        <i class="fa-solid fa-circle-check" style="color: #10B981; margin-top: 4px;"></i> 
                        <span>${feature}</span>
                    </li>
                `).join('');
            }
        });

        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const planKey = btn.getAttribute('data-plan');
                const container = document.getElementById(`features-${planKey}`);
                if (container) {
                    container.style.display = 'block';
                }
            });
        });

        // Close button logic for inline overlays
        const closeFeaturesBtns = document.querySelectorAll('.close-features-btn');
        closeFeaturesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const container = btn.closest('.plan-features-container');
                if (container) {
                    container.style.display = 'none';
                }
            });
        });
    }

    // ==========================================
    // 12. Candidate Success Story Modal Logic
    // ==========================================
    const fullStoryBtns = document.querySelectorAll('.read-full-story-btn');

    const storiesData = {
        'ayesha': {
            name: 'Ayesha Rashid',
            title: 'Packaging Engineer at Axium Packaging',
            visa: 'OPT',
            rating: '5.0',
            situation: 'Ayesha was struggling to find a role that matched her specific engineering background while navigating tight OPT timelines.',
            approach: 'We redesigned her resume to highlight her manufacturing process experience and initiated a direct marketing campaign to top packaging firms.',
            results: [
                'Secured 4 interviews within 3 weeks',
                'Received an $86k offer from Axium Packaging',
                'Successfully transitioned her OPT status without delays'
            ]
        },
        'aman': {
            name: 'Aman Verma',
            title: 'Software Development Engineer at Microsoft',
            visa: 'H-1B',
            rating: '5.0',
            situation: 'Aman wanted to pivot into a Big Tech role but kept getting rejected at the resume screening phase despite strong coding skills.',
            approach: 'Our technical experts ran 5 intense mock interview sessions and completely overhauled his ATS-optimized resume to highlight his scalable architecture projects.',
            results: [
                'Passed the Microsoft initial screening',
                'Aced 4 rounds of technical system design interviews',
                'Accepted a $138k package with full H-1B sponsorship'
            ]
        },
        'rohan': {
            name: 'Rohan Mehta',
            title: 'Hardware Engineer at Intel',
            visa: 'STEM OPT',
            rating: '4.9',
            situation: 'Rohan was facing a tough market for hardware engineers and needed sponsorship before his STEM OPT expired.',
            approach: 'We leveraged our delivery network to pitch Rohan directly to hiring managers at semiconductor companies, bypassing standard portals.',
            results: [
                'Interviewed directly with a Director of Engineering',
                'Secured a $118k offer at Intel',
                'Received a commitment for future H-1B lottery entry'
            ]
        },
        'hina': {
            name: 'Hina Singh',
            title: 'Financial Analyst at Bank of America',
            visa: 'CPT',
            rating: '5.0',
            situation: 'Hina was an international student needing a CPT-approved internship that could convert to full-time upon graduation.',
            approach: 'We positioned her quantitative modeling skills as a unique asset and trained her on specific banking interview behavioral questions.',
            results: [
                'Landed a CPT role at Bank of America',
                'Converted the role into a full-time $105k offer',
                'Secured Day-1 sponsorship commitment'
            ]
        }
    };

    if (fullStoryBtns.length > 0 && storyModal) {
        fullStoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const storyId = btn.getAttribute('data-id');
                const data = storiesData[storyId];
                
                if (data) {
                    document.getElementById('modal-student-name').textContent = data.name;
                    document.getElementById('modal-student-title').textContent = data.title;
                    document.getElementById('modal-student-visa').textContent = data.visa;
                    document.getElementById('modal-student-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${data.rating}`;
                    
                    document.getElementById('modal-story-situation').textContent = data.situation;
                    document.getElementById('modal-story-approach').textContent = data.approach;
                    
                    const resultsUl = document.getElementById('modal-story-results');
                    resultsUl.innerHTML = '';
                    data.results.forEach(res => {
                        const li = document.createElement('li');
                        li.textContent = res;
                        resultsUl.appendChild(li);
                    });
                    
                    // Hide image and video iframe since we don't have assets for them
                    const img = document.getElementById('modal-student-img');
                    if(img) img.style.display = 'none';
                    const video = document.getElementById('modal-video-box');
                    if(video) video.style.display = 'none';

                    storyModal.classList.remove('hide');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        if (closeStoryBtn) {
            closeStoryBtn.addEventListener('click', () => {
                storyModal.classList.add('hide');
                document.body.style.overflow = '';
            });
        }
        
        storyModal.addEventListener('click', (e) => {
            if (e.target === storyModal) {
                storyModal.classList.add('hide');
                document.body.style.overflow = '';
            }
        });
    }

    // Default fallback data if API server is not running
    const defaultSpotlights = [
        {
            bg_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            company_logo: '<i class="fa-brands fa-microsoft text-cyan" style="margin-right: 6px;"></i> Microsoft',
            name: "Aman Verma",
            company: "Microsoft",
            slogan: "Land Big Tech via ATS optimization & system design mock prep.",
            package: "$138,000",
            data_id: "aman"
        },
        {
            bg_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
            company_logo: '<i class="fa-solid fa-box text-warning" style="margin-right: 6px;"></i> Axium',
            name: "Ayesha Rashid",
            company: "Axium Packaging",
            slogan: "Transformed tight OPT timeline into 4 top engineering interviews.",
            package: "$86,000",
            data_id: "ayesha"
        },
        {
            bg_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            company_logo: '<i class="fa-solid fa-microchip text-info" style="margin-right: 6px;"></i> Intel',
            name: "Rohan Mehta",
            company: "Intel Corporation",
            slogan: "Direct pitch to hiring managers prior to STEM OPT expiration.",
            package: "$118,000",
            data_id: "rohan"
        },
        {
            bg_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
            company_logo: '<i class="fa-solid fa-building-columns text-danger" style="margin-right: 6px;"></i> Bank of America',
            name: "Hina Singh",
            company: "Bank of America",
            slogan: "Converted CPT internship into full-time Day-1 sponsorship.",
            package: "$105,000",
            data_id: "hina"
        }
    ];

    const defaultStories = [
        {
            initials: "AR",
            color_class: "avatar-purple",
            name: "Ayesha Rashid",
            role: "Packaging Engineer",
            company: "Axium Packaging",
            quote: "FutureBridge transformed my job search. Their direct marketing campaign got me 4 interviews in 3 weeks on OPT!"
        },
        {
            initials: "AV",
            color_class: "avatar-blue",
            name: "Aman Verma",
            role: "Software Development Engineer",
            company: "Microsoft",
            quote: "The mock interview prep and ATS resume overhaul were game changers. Accepted a $138k offer at Microsoft with H-1B support!"
        },
        {
            initials: "RM",
            color_class: "avatar-cyan",
            name: "Rohan Mehta",
            role: "Hardware Engineer",
            company: "Intel",
            quote: "Direct outreach to hiring managers helped me bypass job portals and land my role at Intel before STEM OPT expired."
        },
        {
            initials: "HS",
            color_class: "avatar-green",
            name: "Hina Singh",
            role: "Financial Analyst",
            company: "Bank of America",
            quote: "They guided me through CPT approval and helped convert my internship into a full-time $105k offer."
        }
    ];

    async function loadDynamicContent() {
        let spotlights = defaultSpotlights;
        let stories = defaultStories;

        try {
            // Load Spotlights
            const spotlightsRes = await fetch('/api/spotlights');
            if (spotlightsRes.ok) {
                const apiSpotlights = await spotlightsRes.json();
                if (apiSpotlights && apiSpotlights.length > 0) {
                    spotlights = apiSpotlights;
                }
            }
        } catch (e) {
            console.log('Using default spotlights');
        }

        try {
            // Load Stories
            const storiesRes = await fetch('/api/stories');
            if (storiesRes.ok) {
                const apiStories = await storiesRes.json();
                if (apiStories && apiStories.length > 0) {
                    stories = apiStories;
                }
            }
        } catch (e) {
            console.log('Using default stories');
        }

        const spotlightsContainer = document.getElementById('dynamic-spotlights-container');
        if (spotlightsContainer) {
            spotlightsContainer.innerHTML = spotlights.map(sp => `
                <div class="new-spotlight-card premium-spotlight">
                    <div class="premium-banner" style="background-image: url('${sp.bg_image}');">
                        <div class="banner-overlay">
                            <div class="spotlight-header">
                                <span class="live-badge"><span class="live-dot"></span> Live</span>
                                <span class="updated-badge">Recently Updated <i class="fa-solid fa-rotate-right"></i></span>
                            </div>
                            <div class="company-logo-text">${sp.company_logo}</div>
                        </div>
                    </div>
                    <div class="premium-body">
                        <h3 class="candidate-name">${sp.name}</h3>
                        <p class="offer-text">Placed at <span class="text-blue font-bold">${sp.company}</span></p>
                        <p class="company-slogan-text">"${sp.slogan}"</p>
                        
                        <div class="stats-row">
                            <div class="stat-pill justify-content-center">
                                <div class="icon-circle bg-green-light"><i class="fa-solid fa-sack-dollar text-green"></i></div> 
                                <div class="stat-text"><span>${sp.package}</span><small>Package</small></div>
                            </div>
                        </div>
                    </div>
                    <div class="premium-footer">
                        <button class="btn btn-primary w-100 dynamic-story-btn" data-id="${sp.data_id}">Read Full Story <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            `).join('');
        }

        const storiesContainer = document.getElementById('dynamic-stories-container');
        if (storiesContainer) {
            storiesContainer.innerHTML = stories.map(st => `
                <div class="testimonial-slide glass-card">
                    <div class="slide-header">
                        <div class="user-avatar ${st.color_class}">${st.initials}</div>
                        <div class="user-meta">
                            <h4>${st.name}</h4>
                            <p>${st.role} at ${st.company}</p>
                        </div>
                    </div>
                    <p class="slide-text">"${st.quote}"</p>
                    <div class="slide-footer">
                        <span class="slide-rating"><i class="fa-solid fa-star"></i> 5.0</span>
                    </div>
                </div>
            `).join('');
        }
        
        if (storiesContainer) {
            slides = document.querySelectorAll('.testimonial-slide');
            slideCount = slides.length;
            buildDots();
            updateSliderPosition();
        }

        // Bind click events to story buttons
        document.querySelectorAll('.dynamic-story-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if(typeof storyModal !== 'undefined' && storyModal) {
                    const storyId = btn.getAttribute('data-id');
                    const data = typeof storiesData !== 'undefined' ? storiesData[storyId] : null;
                    
                    if (data) {
                        document.getElementById('modal-student-name').textContent = data.name;
                        document.getElementById('modal-student-title').textContent = data.title;
                        document.getElementById('modal-student-visa').textContent = data.visa;
                        document.getElementById('modal-student-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${data.rating}`;
                        document.getElementById('modal-story-situation').textContent = data.situation;
                        document.getElementById('modal-story-approach').textContent = data.approach;
                        
                        const resultsUl = document.getElementById('modal-story-results');
                        resultsUl.innerHTML = '';
                        data.results.forEach(res => {
                            const li = document.createElement('li');
                            li.textContent = res;
                            resultsUl.appendChild(li);
                        });
                        
                        const img = document.getElementById('modal-student-img');
                        if(img) img.style.display = 'none';
                        const video = document.getElementById('modal-video-box');
                        if(video) video.style.display = 'none';
    
                        storyModal.classList.remove('hide');
                        document.body.style.overflow = 'hidden';
                    }
                }
            });
        });
    }

    // Attempt to load dynamic data if the API is available
    loadDynamicContent();

    // ==========================================
    // 14. Admin Panel Modal Logic
    // ==========================================
    const openAdminBtn = document.getElementById('open-admin-modal');
    const adminModal = document.getElementById('admin-iframe-modal');
    const closeAdminBtn = document.getElementById('close-admin-iframe');

    if (openAdminBtn && adminModal) {
        openAdminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            adminModal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeAdminBtn && adminModal) {

        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.add('hide');
            document.body.style.overflow = '';
            
            // Reload dynamic content after closing admin panel
            // in case they made changes!
            loadDynamicContent();
        });
    }

    // ==========================================
    // 15. Floating WhatsApp Chat Widget Logic
    // ==========================================
    const toggleWaBtn = document.getElementById('toggle-wa-chat');
    const waChatBox = document.getElementById('wa-chat-box');
    const closeWaBtn = document.getElementById('close-wa-chat');
    const waInput = document.getElementById('wa-chat-input');
    const waSendBtn = document.getElementById('wa-send-btn');
    const waChips = document.querySelectorAll('.wa-chip');
    const waBadge = document.querySelector('.wa-notification-badge');

    const sendToWhatsApp = (text) => {
        if (!text || !text.trim()) return;
        const encodedText = encodeURIComponent(text.trim());
        const phone = '919595579336';
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
        if (waInput) waInput.value = '';
    };

    if (toggleWaBtn && waChatBox) {
        toggleWaBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waChatBox.classList.toggle('hide');
            if (waBadge) waBadge.style.display = 'none';
        });
    }

    if (closeWaBtn && waChatBox) {
        closeWaBtn.addEventListener('click', () => {
            waChatBox.classList.add('hide');
        });
    }

    if (waSendBtn && waInput) {
        waSendBtn.addEventListener('click', () => {
            sendToWhatsApp(waInput.value);
        });
        waInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendToWhatsApp(waInput.value);
            }
        });
    }

    waChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const msg = chip.getAttribute('data-msg');
            sendToWhatsApp(msg);
        });
    });

    // Auto-popup Chat Box after 3.5 seconds when launching website
    let isWaDismissed = false;
    try {
        isWaDismissed = sessionStorage.getItem('wa-popup-dismissed');
    } catch (e) {
        console.warn('sessionStorage is not available.');
    }
    
    if (waChatBox && !isWaDismissed) {
        setTimeout(() => {
            if (waChatBox.classList.contains('hide')) {
                waChatBox.classList.remove('hide');
                if (waBadge) waBadge.style.display = 'none';
            }
        }, 3500);
    }

    // ==========================================
    // 16. Hero Background Slider Logic
    // ==========================================
    const heroBgElement = document.getElementById('hero-slider-bg');
    if (heroBgElement) {
        const bgImages = [
            'assets/hero_bg_1.png',
            'assets/hero_bg_2.png',
            'assets/hero_bg_3.png'
        ];
        let currentBgIdx = 0;
        setInterval(() => {
            currentBgIdx = (currentBgIdx + 1) % bgImages.length;
            heroBgElement.style.backgroundImage = `url('${bgImages[currentBgIdx]}')`;
        }, 5000); // Change image every 5 seconds
    }
});
