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
        if (!target) return;

        const duration = 2000; // 2 seconds
        const start = performance.now();
        const startValue = 0;

        counter.classList.add('animate');

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = startValue + (target - startValue) * this.easeOutCubic(progress);

            if (progress < 1) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                if (target >= 100) {
                    counter.textContent = target + '+';
                } else {
                    counter.textContent = target + '+';
                }
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== PARALLAX EFFECTS =====
    initializeParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('[class*="parallax"]');
        if (!parallaxElements.length) return;

        const handleScroll = throttle(() => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const rate = CONFIG.parallaxRate;
                const yPos = scrollY * rate;
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
        this.observers.set('parallax', { cleanup: () => window.removeEventListener('scroll', handleScroll) });
    }

    // ===== PAINT SPLASH EFFECT =====
    initializePaintSplash() {
        if (this.isReducedMotion) return;

        const splashElements = document.querySelectorAll('.paint-splash');
        if (!splashElements.length) return;

        splashElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createPaintSplash(element);
            });
        });
    }

    createPaintSplash(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981'];
        
        for (let i = 0; i < 5; i++) {
            const splash = document.createElement('div');
            splash.className = 'paint-splash-particle';
            splash.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: paintSplash 1s ease-out forwards;
            `;
            
            document.body.appendChild(splash);
            
            setTimeout(() => {
                splash.remove();
            }, 1000);
        }
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
        this.observers.forEach(observer => {
            if (observer.cleanup) {
                observer.cleanup();
            } else if (observer.disconnect) {
                observer.disconnect();
            }
        });
        this.observers.clear();
        this.animationElements.clear();
    }
}