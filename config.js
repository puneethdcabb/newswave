/* Replace with your GNews API key from https://gnews.io */
const API_KEY = '566042533fe665498791ffa97cec2533';
const API_BASE = 'https://gnews.io/api/v4';

// Export for modules that aren't using ES modules in-browser
window.GNEWS_CONFIG = { API_KEY, API_BASE };
