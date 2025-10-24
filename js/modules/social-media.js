<<<<<<< HEAD
/**
 * Social Media Module
 * Tac Visual Prints - Social Media Icons Enhancement
 */

import { getElementsBySelector, announceToScreenReader } from './utils.js';

// ===== SOCIAL MEDIA ENHANCEMENT =====
export class SocialMediaEnhancer {
    constructor() {
        this.socialIcons = getElementsBySelector('.social-icon');
        this.init();
    }

    init() {
        if (this.socialIcons.length === 0) return;
        
        this.initializeHoverEffects();
        this.initializeClickTracking();
        this.initializeAccessibility();
        this.initializeFallbacks();
    }

    // ===== HOVER EFFECTS =====
    initializeHoverEffects() {
        this.socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                this.handleHoverEnter(e.target);
            });
            
            icon.addEventListener('mouseleave', (e) => {
                this.handleHoverLeave(e.target);
            });
        });
    }

    handleHoverEnter(icon) {
        // Add ripple effect
        this.createRippleEffect(icon);
        
        // Add glow effect
        icon.style.filter = 'brightness(1.1)';
        
        // Announce to screen readers
        const platform = this.getPlatformName(icon);
        announceToScreenReader(`Hovering over ${platform} link`);
    }

    handleHoverLeave(icon) {
        // Remove glow effect
        icon.style.filter = '';
    }

    createRippleEffect(icon) {
        const ripple = document.createElement('div');
        ripple.className = 'social-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // ===== CLICK TRACKING =====
    initializeClickTracking() {
        this.socialIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.trackSocialClick(e.target);
            });
        });
    }

    trackSocialClick(icon) {
        const platform = this.getPlatformName(icon);
        const url = icon.href;
        
        // Log social media clicks (for analytics)
        console.log(`Social media click: ${platform} - ${url}`);
        
        // Announce to screen readers
        announceToScreenReader(`Opening ${platform} in new tab`);
        
        // Add click animation
        icon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            icon.style.transform = '';
        }, 150);
    }

    // ===== ACCESSIBILITY =====
    initializeAccessibility() {
        this.socialIcons.forEach(icon => {
            // Add keyboard navigation
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });
            
            // Add focus indicators
            icon.addEventListener('focus', () => {
                icon.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
                icon.style.outlineOffset = '2px';
            });
            
            icon.addEventListener('blur', () => {
                icon.style.outline = '';
                icon.style.outlineOffset = '';
            });
        });
    }

    // ===== FALLBACKS =====
    initializeFallbacks() {
        // Check if Font Awesome is loaded
        setTimeout(() => {
            this.checkFontAwesome();
        }, 1000);
        
        // Also check on window load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.checkFontAwesome();
            }, 500);
        });
    }

    checkFontAwesome() {
        // Test if Font Awesome is loaded by checking computed styles
        const testIcon = document.createElement('i');
        testIcon.className = 'fab fa-facebook-f';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        testIcon.style.visibility = 'hidden';
        document.body.appendChild(testIcon);
        
        // Check if the icon has the proper font family and content
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const fontFamily = computedStyle.getPropertyValue('font-family');
        const content = computedStyle.getPropertyValue('content');
        
        document.body.removeChild(testIcon);
        
        // If Font Awesome is loaded and content is not empty, hide fallbacks
        if (fontFamily.includes('Font Awesome') && content !== 'none' && content !== '""' && content !== '') {
            this.hideFallbacks();
        } else {
            // Try again after a short delay
            setTimeout(() => {
                this.checkFontAwesome();
            }, 500);
        }
    }

    showFallbacks() {
        console.log('Font Awesome not loaded, showing fallback text');
        this.socialIcons.forEach(icon => {
            icon.classList.remove('fa-loaded');
            const fallbackText = icon.querySelector('.fallback-text');
            const iconElement = icon.querySelector('i');
            
            if (fallbackText) {
                fallbackText.style.display = 'block';
            }
            if (iconElement) {
                iconElement.style.display = 'none';
            }
        });
    }

    hideFallbacks() {
        console.log('Font Awesome loaded successfully');
        this.socialIcons.forEach(icon => {
            icon.classList.add('fa-loaded');
            const fallbackText = icon.querySelector('.fallback-text');
            const iconElement = icon.querySelector('i');
            
            if (fallbackText) {
                fallbackText.style.display = 'none';
            }
            if (iconElement) {
                iconElement.style.display = 'block';
            }
        });
    }

    // ===== UTILITY METHODS =====
    getPlatformName(icon) {
        const classes = Array.from(icon.classList);
        
        if (classes.includes('social-icon--facebook')) return 'Facebook';
        if (classes.includes('social-icon--instagram')) return 'Instagram';
        if (classes.includes('social-icon--twitter')) return 'Twitter';
        if (classes.includes('social-icon--youtube')) return 'YouTube';
        
        return 'Social Media';
    }

    // ===== PUBLIC METHODS =====
    addSocialIcon(platform, url, iconClass) {
        const container = document.querySelector('.social-media-icons');
        if (!container) return;
        
        const icon = document.createElement('a');
        icon.href = url;
        icon.target = '_blank';
        icon.rel = 'noopener noreferrer';
        icon.className = `social-icon social-icon--${platform}`;
        icon.setAttribute('aria-label', `Follow us on ${platform}`);
        
        const iconElement = document.createElement('i');
        iconElement.className = iconClass;
        iconElement.setAttribute('data-fallback', platform.charAt(0).toUpperCase());
        
        icon.appendChild(iconElement);
        container.appendChild(icon);
        
        // Reinitialize for new icon
        this.socialIcons = getElementsBySelector('.social-icon');
        this.initializeHoverEffects();
        this.initializeClickTracking();
        this.initializeAccessibility();
    }

    removeSocialIcon(platform) {
        const icon = document.querySelector(`.social-icon--${platform}`);
        if (icon && icon.parentNode) {
            icon.parentNode.removeChild(icon);
        }
    }
}

// ===== CSS ANIMATIONS =====
const rippleKeyframes = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add CSS animation to document
if (!document.querySelector('#social-media-styles')) {
    const style = document.createElement('style');
    style.id = 'social-media-styles';
    style.textContent = rippleKeyframes;
    document.head.appendChild(style);
}
=======
/**
 * Social Media Module
 * Tac Visual Prints - Social Media Icons Enhancement
 */

import { getElementsBySelector, announceToScreenReader } from './utils.js';

// ===== SOCIAL MEDIA ENHANCEMENT =====
export class SocialMediaEnhancer {
    constructor() {
        this.socialIcons = getElementsBySelector('.social-icon');
        this.init();
    }

    init() {
        if (this.socialIcons.length === 0) return;
        
        this.initializeHoverEffects();
        this.initializeClickTracking();
        this.initializeAccessibility();
        this.initializeFallbacks();
    }

    // ===== HOVER EFFECTS =====
    initializeHoverEffects() {
        this.socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                this.handleHoverEnter(e.target);
            });
            
            icon.addEventListener('mouseleave', (e) => {
                this.handleHoverLeave(e.target);
            });
        });
    }

    handleHoverEnter(icon) {
        // Add ripple effect
        this.createRippleEffect(icon);
        
        // Add glow effect
        icon.style.filter = 'brightness(1.1)';
        
        // Announce to screen readers
        const platform = this.getPlatformName(icon);
        announceToScreenReader(`Hovering over ${platform} link`);
    }

    handleHoverLeave(icon) {
        // Remove glow effect
        icon.style.filter = '';
    }

    createRippleEffect(icon) {
        const ripple = document.createElement('div');
        ripple.className = 'social-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        `;
        
        icon.style.position = 'relative';
        icon.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // ===== CLICK TRACKING =====
    initializeClickTracking() {
        this.socialIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.trackSocialClick(e.target);
            });
        });
    }

    trackSocialClick(icon) {
        const platform = this.getPlatformName(icon);
        const url = icon.href;
        
        // Log social media clicks (for analytics)
        console.log(`Social media click: ${platform} - ${url}`);
        
        // Announce to screen readers
        announceToScreenReader(`Opening ${platform} in new tab`);
        
        // Add click animation
        icon.style.transform = 'scale(0.95)';
        setTimeout(() => {
            icon.style.transform = '';
        }, 150);
    }

    // ===== ACCESSIBILITY =====
    initializeAccessibility() {
        this.socialIcons.forEach(icon => {
            // Add keyboard navigation
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });
            
            // Add focus indicators
            icon.addEventListener('focus', () => {
                icon.style.outline = '2px solid rgba(255, 255, 255, 0.5)';
                icon.style.outlineOffset = '2px';
            });
            
            icon.addEventListener('blur', () => {
                icon.style.outline = '';
                icon.style.outlineOffset = '';
            });
        });
    }

    // ===== FALLBACKS =====
    initializeFallbacks() {
        // Check if Font Awesome is loaded
        setTimeout(() => {
            this.checkFontAwesome();
        }, 1000);
        
        // Also check on window load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.checkFontAwesome();
            }, 500);
        });
    }

    checkFontAwesome() {
        // Test if Font Awesome is loaded by checking computed styles
        const testIcon = document.createElement('i');
        testIcon.className = 'fab fa-facebook-f';
        testIcon.style.position = 'absolute';
        testIcon.style.left = '-9999px';
        testIcon.style.visibility = 'hidden';
        document.body.appendChild(testIcon);
        
        // Check if the icon has the proper font family and content
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        const fontFamily = computedStyle.getPropertyValue('font-family');
        const content = computedStyle.getPropertyValue('content');
        
        document.body.removeChild(testIcon);
        
        // If Font Awesome is loaded and content is not empty, hide fallbacks
        if (fontFamily.includes('Font Awesome') && content !== 'none' && content !== '""' && content !== '') {
            this.hideFallbacks();
        } else {
            // Try again after a short delay
            setTimeout(() => {
                this.checkFontAwesome();
            }, 500);
        }
    }

    showFallbacks() {
        console.log('Font Awesome not loaded, showing fallback text');
        this.socialIcons.forEach(icon => {
            icon.classList.remove('fa-loaded');
            const fallbackText = icon.querySelector('.fallback-text');
            const iconElement = icon.querySelector('i');
            
            if (fallbackText) {
                fallbackText.style.display = 'block';
            }
            if (iconElement) {
                iconElement.style.display = 'none';
            }
        });
    }

    hideFallbacks() {
        console.log('Font Awesome loaded successfully');
        this.socialIcons.forEach(icon => {
            icon.classList.add('fa-loaded');
            const fallbackText = icon.querySelector('.fallback-text');
            const iconElement = icon.querySelector('i');
            
            if (fallbackText) {
                fallbackText.style.display = 'none';
            }
            if (iconElement) {
                iconElement.style.display = 'block';
            }
        });
    }

    // ===== UTILITY METHODS =====
    getPlatformName(icon) {
        const classes = Array.from(icon.classList);
        
        if (classes.includes('social-icon--facebook')) return 'Facebook';
        if (classes.includes('social-icon--instagram')) return 'Instagram';
        if (classes.includes('social-icon--twitter')) return 'Twitter';
        if (classes.includes('social-icon--youtube')) return 'YouTube';
        
        return 'Social Media';
    }

    // ===== PUBLIC METHODS =====
    addSocialIcon(platform, url, iconClass) {
        const container = document.querySelector('.social-media-icons');
        if (!container) return;
        
        const icon = document.createElement('a');
        icon.href = url;
        icon.target = '_blank';
        icon.rel = 'noopener noreferrer';
        icon.className = `social-icon social-icon--${platform}`;
        icon.setAttribute('aria-label', `Follow us on ${platform}`);
        
        const iconElement = document.createElement('i');
        iconElement.className = iconClass;
        iconElement.setAttribute('data-fallback', platform.charAt(0).toUpperCase());
        
        icon.appendChild(iconElement);
        container.appendChild(icon);
        
        // Reinitialize for new icon
        this.socialIcons = getElementsBySelector('.social-icon');
        this.initializeHoverEffects();
        this.initializeClickTracking();
        this.initializeAccessibility();
    }

    removeSocialIcon(platform) {
        const icon = document.querySelector(`.social-icon--${platform}`);
        if (icon && icon.parentNode) {
            icon.parentNode.removeChild(icon);
        }
    }
}

// ===== CSS ANIMATIONS =====
const rippleKeyframes = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add CSS animation to document
if (!document.querySelector('#social-media-styles')) {
    const style = document.createElement('style');
    style.id = 'social-media-styles';
    style.textContent = rippleKeyframes;
    document.head.appendChild(style);
}
>>>>>>> 99fe9515dcc882a870f2359ab5c08b375f0eabe7
