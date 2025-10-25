/**
 * Main JavaScript File
 * Tac Visual Prints - Main Application
 */

// Import modules
import { CONFIG, debounce, throttle, getElementById, getElementsBySelector, isValidEmail, preloadImages, prefersReducedMotion } from './modules/utils.js';
import { TVPChatbot } from './modules/chatbot.js';
import { AnimationController } from './modules/animations.js';
import { SocialMediaEnhancer } from './modules/social-media.js';

// ===== MAIN APPLICATION CLASS =====
class TVPApplication {
    constructor() {
        this.chatbot = null;
        this.animationController = null;
        this.socialMediaEnhancer = null;
        this.isInitialized = false;
        this.init();
    }

    // ===== INITIALIZATION =====
    async init() {
        try {
            console.log('Initializing Tac Visual Prints website...');
            
            // Initialize core components
            this.initializeNavbar();
            this.initializeMobileMenu();
            this.initializeSmoothScrolling();
            this.initializeFormHandling();
            this.initializeInteractiveEffects();
            this.initializePerformanceOptimizations();
            this.initializeErrorHandling();
            this.initializeAccessibility();
            
            // Initialize modules
            try {
                this.chatbot = new TVPChatbot();
                console.log('Chatbot initialized successfully');
            } catch (error) {
                console.error('Failed to initialize chatbot:', error);
            }
            
            try {
                this.animationController = new AnimationController();
                console.log('Animation controller initialized successfully');
            } catch (error) {
                console.error('Failed to initialize animation controller:', error);
            }
            
            try {
                this.socialMediaEnhancer = new SocialMediaEnhancer();
                console.log('Social media enhancer initialized successfully');
            } catch (error) {
                console.error('Failed to initialize social media enhancer:', error);
            }
            
            // Preload critical images
            await this.preloadCriticalImages();
            
            // Handle window events
            this.initializeWindowEvents();
            
            this.isInitialized = true;
            console.log('Tac Visual Prints website initialized successfully');
            
            // Test chatbot after initialization
            setTimeout(() => {
                this.testChatbot();
            }, 1000);
            
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }

    // ===== NAVBAR FUNCTIONALITY =====
    initializeNavbar() {
        const navbar = getElementById('navbar');
        if (!navbar) return;
        
        const handleScroll = debounce(() => {
            if (window.scrollY > CONFIG.scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, CONFIG.debounceDelay);
        
        window.addEventListener('scroll', handleScroll);
    }

    // ===== MOBILE MENU =====
    initializeMobileMenu() {
        const mobileMenuBtn = getElementById('mobile-menu-btn');
        const mobileMenu = getElementById('mobile-menu');
        
        if (!mobileMenuBtn || !mobileMenu) return;
        
        let isMenuOpen = false;
        
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                mobileMenu.classList.remove('-translate-y-full');
                mobileMenu.classList.add('translate-y-0');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Close mobile menu');
            } else {
                mobileMenu.classList.add('-translate-y-full');
                mobileMenu.classList.remove('translate-y-0');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Open mobile menu');
            }
        });
        
        // Close menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileMenu.classList.add('-translate-y-full');
                mobileMenu.classList.remove('translate-y-0');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Open mobile menu');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                isMenuOpen = false;
                mobileMenu.classList.add('-translate-y-full');
                mobileMenu.classList.remove('translate-y-0');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                mobileMenuBtn.setAttribute('aria-label', 'Open mobile menu');
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== FORM HANDLING =====
    initializeFormHandling() {
        const contactForm = getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData);
        
        // Validate form
        if (this.validateForm(formObject)) {
            this.showLoadingState(form);
            
            try {
                // Simulate form submission
                await this.simulateFormSubmission();
                this.showSuccessMessage();
                form.reset();
            } catch (error) {
                this.showErrorMessage('Failed to send message. Please try again.');
            } finally {
                this.hideLoadingState(form);
            }
        }
    }

    validateForm(data) {
        const requiredFields = ['name', 'email', 'message'];
        const missingFields = requiredFields.filter(field => 
            !data[field] || data[field].trim() === ''
        );
        
        if (missingFields.length > 0) {
            this.showErrorMessage('Please fill in all required fields.');
            return false;
        }
        
        if (!isValidEmail(data.email)) {
            this.showErrorMessage('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }

    async simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    showLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }
    }

    hideLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }
    }

    showErrorMessage(message) {
        alert(message);
    }

    showSuccessMessage() {
        alert('Thank you for your message! We will get back to you soon.');
    }

    // ===== INTERACTIVE EFFECTS =====
    initializeInteractiveEffects() {
        const serviceCards = getElementsBySelector('.service-card, .portfolio-item');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!prefersReducedMotion()) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    async preloadCriticalImages() {
        const criticalImages = [
            'https://images.unsplash.com/photo-1693031630369-bd429a57f115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1643216671649-3fb0ce4026e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        ];
        
        try {
            await preloadImages(criticalImages);
            console.log('Critical images preloaded');
        } catch (error) {
            console.warn('Some images failed to preload:', error);
        }
    }

    initializePerformanceOptimizations() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    pauseAnimations() {
        if (this.animationController) {
            this.animationController.pauseAnimations();
        }
    }

    resumeAnimations() {
        if (this.animationController) {
            this.animationController.resumeAnimations();
        }
    }

    // ===== ERROR HANDLING =====
    initializeErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // Could send error to analytics service here
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            // Could send error to analytics service here
        });
    }

    // ===== ACCESSIBILITY =====
    initializeAccessibility() {
        // Add keyboard navigation for portfolio items
        const portfolioItems = getElementsBySelector('.portfolio-item');
        
        portfolioItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ===== WINDOW EVENTS =====
    initializeWindowEvents() {
        // Handle window resize
        const handleResize = debounce(() => {
            console.log('Window resized - recalculating layouts');
            
            if (window.innerWidth < 768) {
                // Mobile-specific adjustments
                this.handleMobileLayout();
            } else {
                // Desktop-specific adjustments
                this.handleDesktopLayout();
            }
        }, CONFIG.resizeDelay);
        
        window.addEventListener('resize', handleResize);
    }

    handleMobileLayout() {
        // Mobile-specific layout adjustments
        if (this.chatbot) {
            // Adjust chatbot for mobile
        }
    }

    handleDesktopLayout() {
        // Desktop-specific layout adjustments
    }

    // ===== PUBLIC METHODS =====
    getChatbot() {
        return this.chatbot;
    }

    getAnimationController() {
        return this.animationController;
    }

    isReady() {
        return this.isInitialized;
    }

    // Test chatbot functionality
    testChatbot() {
        if (this.chatbot) {
            console.log('Testing chatbot functionality...');
            console.log('Chatbot visible:', this.chatbot.isVisible());
            console.log('Chatbot message history:', this.chatbot.getMessageHistory());
            return true;
        }
        return false;
    }

    destroy() {
        if (this.animationController) {
            this.animationController.destroy();
        }
        this.isInitialized = false;
    }
}

// ===== INITIALIZATION =====
let app;

document.addEventListener('DOMContentLoaded', function() {
    app = new TVPApplication();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - reducing activity');
    } else {
        console.log('Page visible - resuming activity');
    }
});

// Export for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TVPApplication, CONFIG };
}