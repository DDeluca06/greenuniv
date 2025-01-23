// Imports
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

// Attach Alpine.js globally
window.Alpine = Alpine;

// Load the persist plugin
Alpine.plugin(persist);

document.addEventListener('alpine:init', () => {
  Alpine.data('dashboardApp', () => ({
    currentPage: Alpine.$persist('dashboard'), // Persist current page
    courses: [], // Holds courses data
    assignments: [], // Holds assignments data

    // Method to dynamically fetch data based on the current page
    async fetchData() {
      if (this.currentPage === 'courses') {
        const response = await fetch('/api/courses');
        if (response.ok) {
          this.courses = await response.json();
        } else {
          console.error('Failed to fetch courses.');
        }
      } else if (this.currentPage === 'assignments') {
        const response = await fetch('/api/assignments');
        if (response.ok) {
          this.assignments = await response.json();
        } else {
          console.error('Failed to fetch assignments.');
        }
      }
    },

    // Method to navigate between pages
    navigateTo(page) {
      this.currentPage = page;
      this.fetchData(); // Fetch data for the new page
    },

    // Initialization logic
    init() {
      this.fetchData(); // Fetch data for the initial page
    },
  }));
});

Alpine.start();