{
  // Ensure Alpine.js is defined before we register the component globally
  window.dash = {
    currentPage: localStorage.getItem('currentPage') || 'dashboard', // Ensure currentPage is set
    courses: [],
    assignments: [],

    // Fetch data for the current page
    async fetchData() {
      console.log(`Fetching data for page: ${this.currentPage}`); // Debug log
      if (!this.currentPage) {
        console.error('currentPage is not defined'); // Error log
      }

      if (this.currentPage === 'courses') {
        try {
          const response = await fetch('/api/courses');
          if (response.ok) {
            this.courses = await response.json();
          } else {
            console.error('Failed to fetch courses.');
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      } else if (this.currentPage === 'assignments') {
        try {
          const response = await fetch('/api/assignments');
          if (response.ok) {
            this.assignments = await response.json();
          } else {
            console.error('Failed to fetch assignments.');
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      }
    },

    // Handle page navigation and fetch data
    navigateTo(page) {
      console.log(`Navigating to: ${page}`); // Debug log
      this.currentPage = page;
      localStorage.setItem('currentPage', page);
      this.fetchData();
    },

    // Initialize fetching the data for the current page
    init() {
      console.log('Initializing dash object'); // Debug log
      if (this.currentPage) {
        this.fetchData(); // Initialize fetch for the starting page
      } else {
        console.error('currentPage is not set'); // Error log
      }
    }
  };

  // Start Alpine after registering the component
  document.addEventListener('alpine:init', () => {
    console.log('Registering dash component'); // Debug log
    Alpine.data('dash', () => window.dash); // Register the dash component
  });

  // Check if localStorage is accessible
  if (typeof(Storage) !== "undefined") {
    window.dash.init(); // Call init to fetch data for the current page
  } else {
    console.error('LocalStorage is not supported in this environment.');
  }

  Alpine.start(); // Start Alpine.js after all setup
}
