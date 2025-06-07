/**
 * Hotel Management System - Main JavaScript
 * Common functions and utilities
 */

class HotelManagement {
    constructor() {
        this.apiBase = '/api';
        this.init();
    }
    
    init() {
        console.log('Hotel Management System initialized');
        this.setupEventListeners();
        this.loadNotifications();
    }
    
    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
    }
    
    initializeComponents() {
        // Initialize tooltips, modals, etc.
        console.log('Components initialized');
    }
    
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    loadNotifications() {
        // Load real-time notifications
        console.log('Loading notifications...');
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    }
}

// Initialize system
const hotelSystem = new HotelManagement();

// Export for use in other files
window.HotelManagement = HotelManagement;
