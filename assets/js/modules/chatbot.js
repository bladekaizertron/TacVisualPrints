/**
 * Chatbot Module
 * Tac Visual Prints - Interactive Chatbot
 */

import { CONFIG, getElementById, announceToScreenReader } from './utils.js';

// ===== CHATBOT CLASS =====
export class TVPChatbot {
    constructor() {
        this.isOpen = false;
        this.isMinimized = false;
        this.messages = [];
        this.initializeElements();
        this.initializeEventListeners();
    }

    // ===== INITIALIZATION =====
    initializeElements() {
        this.chatToggle = getElementById('chatToggle');
        this.chatWindow = getElementById('chatWindow');
        this.chatClose = getElementById('chatClose');
        this.chatMinimize = getElementById('chatMinimize');
        this.chatBody = getElementById('chatBody');
        this.chatForm = getElementById('chatForm');
        this.chatInput = getElementById('chatInput');
        this.openMessengerBtn = getElementById('openMessenger');
    }

    initializeEventListeners() {
        if (!this.chatToggle || !this.chatWindow) return;

        // Toggle open/close
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        
        // Close button
        if (this.chatClose) {
            this.chatClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeChat();
            });
        }
        
        // Minimize button
        if (this.chatMinimize) {
            this.chatMinimize.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
        }
        
        // Form submission
        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion')) {
                const suggestionText = e.target.textContent;
                this.sendUserMessage(suggestionText);
                this.respondToMessage(suggestionText);
            }
        });
        
        // Messenger handoff
        if (this.openMessengerBtn) {
            this.openMessengerBtn.addEventListener('click', () => this.openMessenger());
        }
        
        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Click on minimized header to restore
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.addEventListener('click', () => {
                if (this.isMinimized) {
                    this.restoreChat();
                }
            });
        }
    }

    // ===== CHAT CONTROLS =====
    toggleChat() {
        if (this.isMinimized) {
            this.restoreChat();
        } else {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
    }

    openChat() {
        this.isOpen = true;
        this.isMinimized = false;
        this.chatWindow.classList.add('open');
        this.chatWindow.classList.remove('minimized');
        
        setTimeout(() => {
            if (this.chatInput) {
                this.chatInput.focus();
            }
        }, 120);
        
        announceToScreenReader('Chat opened');
    }

    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.chatWindow.classList.remove('open', 'minimized');
        this.chatToggle.focus();
        
        announceToScreenReader('Chat closed');
    }

    toggleMinimize() {
        if (this.isMinimized) {
            this.restoreChat();
        } else {
            this.minimizeChat();
        }
    }

    minimizeChat() {
        this.isMinimized = true;
        this.isOpen = false;
        this.chatWindow.classList.add('minimized');
        this.chatWindow.classList.remove('open');
        
        announceToScreenReader('Chat minimized');
    }

    restoreChat() {
        this.isMinimized = false;
        this.isOpen = true;
        this.chatWindow.classList.remove('minimized');
        this.chatWindow.classList.add('open');
        
        setTimeout(() => {
            if (this.chatInput) {
                this.chatInput.focus();
            }
        }, 120);
        
        announceToScreenReader('Chat restored');
    }

    // ===== MESSAGE HANDLING =====
    handleFormSubmit() {
        const text = this.chatInput?.value?.trim();
        if (!text) return;
        
        this.sendUserMessage(text);
        this.chatInput.value = '';
        this.respondToMessage(text);
    }

    sendUserMessage(text) {
        this.appendMessage('user', text);
        this.messages.push({ type: 'user', content: text, timestamp: new Date() });
    }

    respondToMessage(text) {
        const lower = text.toLowerCase();
        let reply = this.getBotResponse(lower);
        
        setTimeout(() => {
            this.appendMessage('bot', reply);
            this.messages.push({ type: 'bot', content: reply, timestamp: new Date() });
        }, 400);
    }

    getBotResponse(text) {
        // Quote and pricing inquiries
        if (text.includes('quote') || text.includes('price') || text.includes('cost') || text.includes('how much')) {
            return "Great! To provide an accurate quote, I'll need some details:\n\n📋 **Please share:**\n• Product type (t-shirts, tarpaulins, banners, etc.)\n• Quantity needed\n• Sizes and specifications\n• Design complexity\n• Target completion date\n\n💬 **I'll get back to you within 2 hours with a detailed quote!**";
        }
        
        // Service inquiries
        else if (text.includes('service') || text.includes('what') || text.includes('offer') || text.includes('do you')) {
            return "We offer a comprehensive range of printing services:\n\n🎨 **Our Services:**\n• **Sublimation Printing** - Full-color designs on polyester\n• **DTF Printing** - Works on any fabric color\n• **Tarpaulin Printing** - Large format, weather-resistant\n• **Custom T-Shirts & Uniforms** - Sports teams, corporate\n• **Event Backdrops** - Weddings, birthdays, corporate\n• **Signage & Banners** - Storefront, directional, promotional\n• **Menu Boards** - Restaurant displays\n• **Roll-up Banners** - Portable displays\n\nWhat specific service interests you?";
        }
        
        // Turnaround time inquiries
        else if (text.includes('time') || text.includes('turnaround') || text.includes('how long') || text.includes('delivery')) {
            return "Our turnaround times vary by order size and complexity:\n\n⏰ **Standard Turnaround:**\n• **Small orders (1-10 pieces):** 2-3 business days\n• **Medium orders (11-50 pieces):** 3-5 business days\n• **Large orders (50+ pieces):** 5-7 business days\n• **Rush orders:** Available for additional fee (1-2 days)\n\n🚀 **Rush service available!** What's your timeline?";
        }
        
        // DTF printing specific
        else if (text.includes('dtf') || text.includes('direct to film')) {
            return "Yes! We specialize in premium DTF printing:\n\n✨ **DTF Features:**\n• Vibrant, long-lasting colors\n• Works on ANY fabric color (including black!)\n• Soft hand feel - no stiffness\n• Excellent durability and wash resistance\n• No minimum order quantity\n• Perfect for complex designs\n\n🎯 **Great for:** Custom designs, logos, detailed artwork\n\nWhat type of items are you looking to print?";
        }
        
        // Sublimation printing
        else if (text.includes('sublimation')) {
            return "Our sublimation printing delivers exceptional results:\n\n🔥 **Sublimation Features:**\n• Full-color designs with unlimited colors\n• Permanent, fade-resistant prints\n• Works best on polyester fabrics\n• Perfect for sports uniforms and activewear\n• High-quality, professional results\n• Great for team uniforms and promotional items\n\n🏆 **Ideal for:** Sports teams, corporate uniforms, promotional wear\n\nWhat type of items are you planning to print?";
        }
        
        // Tarpaulin printing
        else if (text.includes('tarpaulin') || text.includes('tarp') || text.includes('banner')) {
            return "We specialize in large format tarpaulin printing:\n\n🖼️ **Tarpaulin Features:**\n• Weather-resistant materials\n• Large format capabilities (up to 3m wide)\n• Perfect for events, construction, advertising\n• Custom sizes available\n• UV-resistant inks for outdoor use\n• Durable and long-lasting\n\n🎪 **Great for:** Events, construction sites, outdoor advertising\n\nWhat size and design do you need?";
        }
        
        // Contact information
        else if (text.includes('contact') || text.includes('phone') || text.includes('address') || text.includes('location')) {
            return "Here's how to reach us:\n\n📞 **Contact Information:**\n• **Phone:** +63 (995) 398-9984\n• **Email:** info@tacvisualprints.com\n• **Business Hours:** Monday-Friday, 8:00 AM - 6:00 PM\n• **Address:** [Your Business Address]\n\n💬 **Or continue chatting here for immediate assistance!**\n\nI'm here to help with quotes, questions, and orders!";
        }
        
        // Greetings and general help
        else if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('help')) {
            return "Hello! Welcome to Tac Visual Prints! 👋\n\nI'm your personal printing assistant. I can help you with:\n\n🎯 **What I can do:**\n• Get instant quotes\n• Explain our services\n• Answer technical questions\n• Help with order planning\n• Provide turnaround times\n• Share contact information\n\n**How can I assist you today?**";
        }
        
        // Quality and materials
        else if (text.includes('quality') || text.includes('material') || text.includes('durable') || text.includes('last')) {
            return "We pride ourselves on exceptional quality:\n\n⭐ **Quality Assurance:**\n• Premium materials and inks\n• State-of-the-art printing equipment\n• Experienced craftsmen\n• Quality control at every step\n• Durable, long-lasting results\n• Professional finishing\n\n🏆 **Why choose us:**\n• 5+ years of experience\n• 500+ happy clients\n• 1000+ successful projects\n\nYour satisfaction is our guarantee!";
        }
        
        // Design and artwork
        else if (text.includes('design') || text.includes('artwork') || text.includes('logo') || text.includes('file')) {
            return "We can work with various design formats:\n\n🎨 **Design Support:**\n• **File formats:** AI, EPS, PDF, PNG, JPG\n• **Resolution:** 300 DPI minimum for best results\n• **Design assistance:** We can help create designs\n• **Logo placement:** Perfect positioning guaranteed\n• **Color matching:** Pantone color matching available\n\n💡 **Need design help?** We can assist with artwork creation!\n\nWhat type of design do you have in mind?";
        }
        
        // Order process
        else if (text.includes('order') || text.includes('process') || text.includes('how to') || text.includes('steps')) {
            return "Our simple ordering process:\n\n📋 **Easy Ordering Steps:**\n1. **Get a quote** - Share your requirements\n2. **Approve quote** - Review and confirm details\n3. **Submit artwork** - Send your design files\n4. **Production** - We print with care\n5. **Quality check** - We ensure perfection\n6. **Delivery** - Fast, secure delivery\n\n✨ **We handle everything!** Just tell us what you need.";
        }
        
        // Default response
        return "Thanks for reaching out! How can we assist you today?";
    }

    appendMessage(sender, text) {
        if (!this.chatBody) return;
        
        const wrapper = document.createElement('div');
        wrapper.className = `message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Format the text with proper line breaks and styling
        const formattedText = this.formatMessage(text);
        bubble.innerHTML = formattedText;
        
        wrapper.appendChild(bubble);
        this.chatBody.appendChild(wrapper);
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    formatMessage(text) {
        // Convert line breaks to HTML
        let formatted = text.replace(/\n/g, '<br>');
        
        // Style bold text (text between **)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Style bullet points
        formatted = formatted.replace(/^• /gm, '<span style="color: #6366f1; font-weight: 600;">•</span> ');
        
        // Style emojis and make them slightly larger
        formatted = formatted.replace(/([🎯📋💬🎨⏰🚀✨🎪📞💡⭐🏆🎨💡📋✨])/g, '<span style="font-size: 1.1em;">$1</span>');
        
        return formatted;
    }

    // ===== MESSENGER INTEGRATION =====
    openMessenger() {
        const pageId = CONFIG.facebookPageId || 'YOUR_FACEBOOK_PAGE_ID';
        const url = `https://m.me/${pageId}`;
        window.open(url, '_blank');
    }

    // ===== PUBLIC METHODS =====
    show() {
        this.openChat();
    }

    hide() {
        this.closeChat();
    }

    isVisible() {
        return this.isOpen && !this.isMinimized;
    }

    getMessageHistory() {
        return this.messages;
    }

    clearHistory() {
        this.messages = [];
        if (this.chatBody) {
            this.chatBody.innerHTML = '';
        }
    }
}