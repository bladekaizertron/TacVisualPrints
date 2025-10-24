
/**
 * Animation Module
 * Tac Visual Prints - Animation Controller
 */

import { CONFIG, debounce, throttle, isInViewport, prefersReducedMotion } from './utils.js';

// ===== ANIMATION CONTROLLER =====
export class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationElements = new Set();
        this.isReducedMotion = prefersReducedMotion();
        this.init();
    }

    init() {
        this.initializeScrollAnimations();
        this.initializeCounterAnimations();
        this.initializeParallaxEffects();
        this.initializePaintSplash();
    }

    // ===== SCROLL ANIMATIONS =====
    initializeScrollAnimations() {
        if (this.isReducedMotion) return;

        const fadeElements = document.querySelectorAll('.fade-in, [data-aos]');
        if (!fadeElements.length) return;

        const observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animationElements.add(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set('scroll', observer);
    }

    // ===== COUNTER ANIMATIONS =====
    initializeCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        this.observers.set('counter', counterObserver);
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Add animation class
        counter.classList.add('animate');
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Add + symbol for display
                if (target >= 100) {
                    counter.textContent = target + '+';
                } else {
                    counter.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    }

    // ===== PARALLAX EFFECTS =====
    initializeParallaxEffects() {
        if (this.isReducedMotion) return;

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Update CSS custom property for parallax offset
            document.documentElement.style.setProperty('--parallax-offset', scrolled + 'px');
            
            // Update hero background parallax
            const hero = document.querySelector('#home');
            if (hero) {
                const heroHeight = hero.offsetHeight;
                const parallaxOffset = scrolled * 0.5;
                hero.style.backgroundPosition = `center ${parallaxOffset}px`;
            }
            
            // Update individual parallax elements
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Throttled scroll event for better performance
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Initial call
        updateParallax();
    }

    // ===== PAINT SPLASH ANIMATION =====
    initializePaintSplash() {
        if (this.isReducedMotion) return;

        const paintColors = ['paint-color-1', 'paint-color-2', 'paint-color-3', 'paint-color-4', 'paint-color-5'];
        
        document.addEventListener('click', (e) => {
            // Don't trigger on chatbot elements
            if (e.target.closest('.tvp-chatbot')) return;
            
            const x = e.clientX;
            const y = e.clientY;
            
            // Create paint brush
            this.createPaintBrush(x, y);
            
            // Create paint splash after a short delay
            setTimeout(() => {
                this.createPaintSplash(x, y, paintColors);
            }, 200);
        });
    }

    createPaintBrush(x, y) {
        const brush = document.createElement('div');
        brush.className = 'paint-brush';
        brush.innerHTML = '🖌️';
        brush.style.left = (x - 20) + 'px';
        brush.style.top = (y - 20) + 'px';
        brush.style.fontSize = '40px';
        
        document.body.appendChild(brush);
        
        // Remove brush after animation
        setTimeout(() => {
            if (brush.parentNode) {
                brush.parentNode.removeChild(brush);
            }
        }, 800);
    }

    createPaintSplash(x, y, paintColors) {
        const splash = document.createElement('div');
        splash.className = 'paint-splash';
        splash.style.left = x + 'px';
        splash.style.top = y + 'px';
        
        // Random paint color
        const randomColor = paintColors[Math.floor(Math.random() * paintColors.length)];
        
        // Create multiple splash circles
        for (let i = 0; i < 8; i++) {
            const circle = document.createElement('div');
            circle.className = `paint-splash-circle ${randomColor}`;
            
            // Random size and position
            const size = Math.random() * 30 + 10;
            const angle = (Math.PI * 2 * i) / 8;
            const distance = Math.random() * 50 + 20;
            
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.left = (Math.cos(angle) * distance) + 'px';
            circle.style.top = (Math.sin(angle) * distance) + 'px';
            
            splash.appendChild(circle);
        }
        
        // Add paint drips
        for (let i = 0; i < 3; i++) {
            const drip = document.createElement('div');
            drip.className = 'paint-drip';
            drip.style.left = (Math.random() * 40 - 20) + 'px';
            drip.style.top = (Math.random() * 20) + 'px';
            drip.style.background = `linear-gradient(to bottom, ${this.getRandomColor()}, ${this.getRandomColor()})`;
            
            splash.appendChild(drip);
        }
        
        document.body.appendChild(splash);
        
        // Remove splash after animation
        setTimeout(() => {
            if (splash.parentNode) {
                splash.parentNode.removeChild(splash);
            }
        }, 1200);
    }

    getRandomColor() {
        const colors = [
            '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', 
            '#10b981', '#06b6d4', '#f97316', '#ec4899', 
            '#84cc16', '#22c55e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ===== INTERACTIVE EFFECTS =====
    initializeInteractiveEffects() {
        const serviceCards = document.querySelectorAll('.service-card, .portfolio-item');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.isReducedMotion) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ===== UTILITY METHODS =====
    pauseAnimations() {
        this.animationElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        this.animationElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animationElements.clear();
    }
}

/**
 * Animation Module
 * Tac Visual Prints - Animation Controller
 */

import { CONFIG, debounce, throttle, isInViewport, prefersReducedMotion } from './utils.js';

// ===== ANIMATION CONTROLLER =====
export class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationElements = new Set();
        this.isReducedMotion = prefersReducedMotion();
        this.init();
    }

    init() {
        this.initializeScrollAnimations();
        this.initializeCounterAnimations();
        this.initializeParallaxEffects();
        this.initializePaintSplash();
    }

    // ===== SCROLL ANIMATIONS =====
    initializeScrollAnimations() {
        if (this.isReducedMotion) return;

        const fadeElements = document.querySelectorAll('.fade-in, [data-aos]');
        if (!fadeElements.length) return;

        const observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerRootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animationElements.add(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set('scroll', observer);
    }

    // ===== COUNTER ANIMATIONS =====
    initializeCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        this.observers.set('counter', counterObserver);
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Add animation class
        counter.classList.add('animate');
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Add + symbol for display
                if (target >= 100) {
                    counter.textContent = target + '+';
                } else {
                    counter.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    }

    // ===== PARALLAX EFFECTS =====
    initializeParallaxEffects() {
        if (this.isReducedMotion) return;

        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            // Update CSS custom property for parallax offset
            document.documentElement.style.setProperty('--parallax-offset', scrolled + 'px');
            
            // Update hero background parallax
            const hero = document.querySelector('#home');
            if (hero) {
                const heroHeight = hero.offsetHeight;
                const parallaxOffset = scrolled * 0.5;
                hero.style.backgroundPosition = `center ${parallaxOffset}px`;
            }
            
            // Update individual parallax elements
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        // Throttled scroll event for better performance
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Initial call
        updateParallax();
    }

    // ===== PAINT SPLASH ANIMATION =====
    initializePaintSplash() {
        if (this.isReducedMotion) return;

        const paintColors = ['paint-color-1', 'paint-color-2', 'paint-color-3', 'paint-color-4', 'paint-color-5'];
        
        document.addEventListener('click', (e) => {
            // Don't trigger on chatbot elements
            if (e.target.closest('.tvp-chatbot')) return;
            
            const x = e.clientX;
            const y = e.clientY;
            
            // Create paint brush
            this.createPaintBrush(x, y);
            
            // Create paint splash after a short delay
            setTimeout(() => {
                this.createPaintSplash(x, y, paintColors);
            }, 200);
        });
    }

    createPaintBrush(x, y) {
        const brush = document.createElement('div');
        brush.className = 'paint-brush';
        brush.innerHTML = '🖌️';
        brush.style.left = (x - 20) + 'px';
        brush.style.top = (y - 20) + 'px';
        brush.style.fontSize = '40px';
        
        document.body.appendChild(brush);
        
        // Remove brush after animation
        setTimeout(() => {
            if (brush.parentNode) {
                brush.parentNode.removeChild(brush);
            }
        }, 800);
    }

    createPaintSplash(x, y, paintColors) {
        const splash = document.createElement('div');
        splash.className = 'paint-splash';
        splash.style.left = x + 'px';
        splash.style.top = y + 'px';
        
        // Random paint color
        const randomColor = paintColors[Math.floor(Math.random() * paintColors.length)];
        
        // Create multiple splash circles
        for (let i = 0; i < 8; i++) {
            const circle = document.createElement('div');
            circle.className = `paint-splash-circle ${randomColor}`;
            
            // Random size and position
            const size = Math.random() * 30 + 10;
            const angle = (Math.PI * 2 * i) / 8;
            const distance = Math.random() * 50 + 20;
            
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.left = (Math.cos(angle) * distance) + 'px';
            circle.style.top = (Math.sin(angle) * distance) + 'px';
            
            splash.appendChild(circle);
        }
        
        // Add paint drips
        for (let i = 0; i < 3; i++) {
            const drip = document.createElement('div');
            drip.className = 'paint-drip';
            drip.style.left = (Math.random() * 40 - 20) + 'px';
            drip.style.top = (Math.random() * 20) + 'px';
            drip.style.background = `linear-gradient(to bottom, ${this.getRandomColor()}, ${this.getRandomColor()})`;
            
            splash.appendChild(drip);
        }
        
        document.body.appendChild(splash);
        
        // Remove splash after animation
        setTimeout(() => {
            if (splash.parentNode) {
                splash.parentNode.removeChild(splash);
            }
        }, 1200);
    }

    getRandomColor() {
        const colors = [
            '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', 
            '#10b981', '#06b6d4', '#f97316', '#ec4899', 
            '#84cc16', '#22c55e'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ===== INTERACTIVE EFFECTS =====
    initializeInteractiveEffects() {
        const serviceCards = document.querySelectorAll('.service-card, .portfolio-item');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!this.isReducedMotion) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ===== UTILITY METHODS =====
    pauseAnimations() {
        this.animationElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        this.animationElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animationElements.clear();
    }
}

