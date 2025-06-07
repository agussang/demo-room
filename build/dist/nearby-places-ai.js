/**
 * AI Recommendation System for Nearby Places
 * This script uses coordinates to generate recommendations for places near a hotel location
 */

// Constants for place types
const PLACE_TYPES = {
  TRANSPORTATION: 'transportation',
  SHOPPING: 'shopping',
  DINING: 'dining',
  ATTRACTIONS: 'attractions'
};

// Class to handle nearby places recommendations
class NearbyPlacesAI {
  constructor() {
    this.placesCache = new Map(); // Cache for storing results
  }

  /**
   * Get nearby places based on coordinates
   * @param {Object} coordinates - {lat, lng} object with hotel coordinates
   * @param {String} placeType - Type of places to recommend
   * @param {String} language - Language for results (default: 'id')
   * @returns {Promise<Array>} - Array of recommended places
   */
  async getRecommendations(coordinates, placeType = PLACE_TYPES.TRANSPORTATION, language = 'id') {
    // Check if we have cached results
    const cacheKey = `${coordinates.lat},${coordinates.lng}-${placeType}-${language}`;
    if (this.placesCache.has(cacheKey)) {
      console.log("Using cached places data");
      return this.placesCache.get(cacheKey);
    }

    // In a real implementation, this would call an API
    // Here we'll simulate AI recommendations with pre-defined data
    const recommendations = this.generateRecommendations(coordinates, placeType, language);
    
    // Cache the results
    this.placesCache.set(cacheKey, recommendations);
    
    return recommendations;
  }

  /**
   * Generate simulated recommendations based on location
   * @private
   */
  generateRecommendations(coordinates, placeType, language) {
    // Base distance calculation on coordinates
    // In a real implementation, this would use Google Places API or similar
    const basedOnLocation = this.getRegionFromCoordinates(coordinates);
    console.log(`Generating ${placeType} recommendations for ${basedOnLocation}`);
    
    let results = [];

    // Transportation recommendations
    if (placeType === PLACE_TYPES.TRANSPORTATION) {
      results = this.getTransportationRecommendations(coordinates, basedOnLocation);
    } 
    // Shopping recommendations
    else if (placeType === PLACE_TYPES.SHOPPING) {
      results = this.getShoppingRecommendations(coordinates, basedOnLocation);
    } 
    // Dining recommendations
    else if (placeType === PLACE_TYPES.DINING) {
      results = this.getDiningRecommendations(coordinates, basedOnLocation);
    } 
    // Attraction recommendations
    else if (placeType === PLACE_TYPES.ATTRACTIONS) {
      results = this.getAttractionRecommendations(coordinates, basedOnLocation);
    }

    // Sort by distance
    results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    return results;
  }

  /**
   * Get transportation recommendations
   */
  getTransportationRecommendations(coordinates, region) {
    // Common transportation options
    const commonOptions = [
      { 
        name: 'Stasiun Kereta Terdekat', 
        type: 'train_station', 
        distance: this.calculateRandomDistance(1, 5) + ' km',
        icon: 'train'
      },
      { 
        name: 'Terminal Bus Terdekat', 
        type: 'bus_station', 
        distance: this.calculateRandomDistance(1, 4) + ' km',
        icon: 'bus'
      },
      { 
        name: 'Halte Transportasi Umum', 
        type: 'transit_station', 
        distance: this.calculateRandomDistance(0.3, 1) + ' km',
        icon: 'bus-alt'
      }
    ];

    // Region-specific options
    let regionOptions = [];

    // Based on region, add specific transportation
    if (region === 'Jakarta') {
      regionOptions = [
        { 
          name: 'Bandara Soekarno-Hatta', 
          type: 'airport', 
          distance: this.calculateRandomDistance(20, 30) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Stasiun MRT Terdekat', 
          type: 'subway_station', 
          distance: this.calculateRandomDistance(0.5, 2) + ' km',
          icon: 'subway'
        },
        { 
          name: 'Halte Transjakarta', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(0.2, 1) + ' km',
          icon: 'bus'
        }
      ];
    } else if (region === 'Bali') {
      regionOptions = [
        { 
          name: 'Bandara I Gusti Ngurah Rai', 
          type: 'airport', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Terminal Mengwi', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'bus'
        },
        { 
          name: 'Pelabuhan Benoa', 
          type: 'ferry_terminal', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'ship'
        }
      ];
    } else if (region === 'Yogyakarta') {
      regionOptions = [
        { 
          name: 'Bandara Yogyakarta International Airport', 
          type: 'airport', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Stasiun Tugu Yogyakarta', 
          type: 'train_station', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'train'
        },
        { 
          name: 'Terminal Giwangan', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(3, 10) + ' km',
          icon: 'bus'
        }
      ];
    } else if (region === 'Surabaya') {
      regionOptions = [
        { 
          name: 'Bandara Internasional Juanda', 
          type: 'airport', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Stasiun Gubeng', 
          type: 'train_station', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'train'
        },
        { 
          name: 'Terminal Purabaya (Bungurasih)', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'bus'
        }
      ];
    } else if (region === 'Bandung') {
      regionOptions = [
        { 
          name: 'Bandara Husein Sastranegara', 
          type: 'airport', 
          distance: this.calculateRandomDistance(5, 10) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Stasiun Bandung', 
          type: 'train_station', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'train'
        },
        { 
          name: 'Terminal Leuwi Panjang', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(3, 10) + ' km',
          icon: 'bus'
        }
      ];
    } else if (region === 'Malang') {
      regionOptions = [
        { 
          name: 'Bandara Abdulrachman Saleh', 
          type: 'airport', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'plane'
        },
        { 
          name: 'Stasiun Malang', 
          type: 'train_station', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'train'
        },
        { 
          name: 'Terminal Arjosari', 
          type: 'bus_station', 
          distance: this.calculateRandomDistance(3, 8) + ' km',
          icon: 'bus'
        }
      ];
    } else {
      // Generic options for other regions
      regionOptions = [
        { 
          name: 'Bandara Terdekat', 
          type: 'airport', 
          distance: this.calculateRandomDistance(10, 30) + ' km',
          icon: 'plane'
        }
      ];
    }

    // Combine and return
    return [...regionOptions, ...commonOptions];
  }

  /**
   * Get shopping recommendations
   */
  getShoppingRecommendations(coordinates, region) {
    // Common shopping options
    const commonOptions = [
      { 
        name: 'Supermarket Terdekat', 
        type: 'supermarket', 
        distance: this.calculateRandomDistance(0.5, 2) + ' km',
        icon: 'shopping-cart'
      },
      { 
        name: 'Mini Market 24 Jam', 
        type: 'convenience_store', 
        distance: this.calculateRandomDistance(0.2, 1) + ' km',
        icon: 'store'
      }
    ];

    // Region-specific shopping
    let regionOptions = [];

    if (region === 'Jakarta') {
      regionOptions = [
        { 
          name: 'Grand Indonesia', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Plaza Indonesia', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Central Park Mall', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 10) + ' km',
          icon: 'shopping-bag'
        }
      ];
    } else if (region === 'Bali') {
      regionOptions = [
        { 
          name: 'Beachwalk Shopping Center', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pasar Seni Sukawati', 
          type: 'market', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'store'
        },
        { 
          name: 'Mal Bali Galeria', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 10) + ' km',
          icon: 'shopping-bag'
        }
      ];
    } else if (region === 'Yogyakarta') {
      regionOptions = [
        { 
          name: 'Malioboro Mall', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pasar Beringharjo', 
          type: 'market', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'store'
        },
        { 
          name: 'Hartono Mall', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(3, 10) + ' km',
          icon: 'shopping-bag'
        }
      ];
    } else if (region === 'Surabaya') {
      regionOptions = [
        { 
          name: 'Tunjungan Plaza', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pakuwon Mall', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(5, 12) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pasar Atom', 
          type: 'market', 
          distance: this.calculateRandomDistance(2, 9) + ' km',
          icon: 'store'
        }
      ];
    } else if (region === 'Bandung') {
      regionOptions = [
        { 
          name: 'Paris Van Java', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Cihampelas Walk', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Factory Outlet Area', 
          type: 'clothing_store', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'tshirt'
        }
      ];
    } else if (region === 'Malang') {
      regionOptions = [
        { 
          name: 'Mall Olympic Garden', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Malang Town Square', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pasar Besar Malang', 
          type: 'market', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'store'
        }
      ];
    } else {
      // Generic options for other regions
      regionOptions = [
        { 
          name: 'Mall Terdekat', 
          type: 'shopping_mall', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'shopping-bag'
        },
        { 
          name: 'Pasar Tradisional', 
          type: 'market', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'store'
        }
      ];
    }

    // Combine and return
    return [...regionOptions, ...commonOptions];
  }

  /**
   * Get dining recommendations
   */
  getDiningRecommendations(coordinates, region) {
    // Common dining options
    const commonOptions = [
      { 
        name: 'Restoran Cepat Saji', 
        type: 'fast_food', 
        distance: this.calculateRandomDistance(0.3, 2) + ' km',
        icon: 'hamburger'
      },
      { 
        name: 'Kafe', 
        type: 'cafe', 
        distance: this.calculateRandomDistance(0.2, 1.5) + ' km',
        icon: 'coffee'
      },
      { 
        name: 'Warung Makan Lokal', 
        type: 'local_restaurant', 
        distance: this.calculateRandomDistance(0.1, 1) + ' km',
        icon: 'utensils'
      }
    ];

    // Region-specific dining
    let regionOptions = [];

    if (region === 'Jakarta') {
      regionOptions = [
        { 
          name: 'Restoran Grand Hyatt', 
          type: 'fine_dining', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Sate Khas Senayan', 
          type: 'indonesian_restaurant', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Bakmi GM', 
          type: 'noodle_restaurant', 
          distance: this.calculateRandomDistance(0.5, 3) + ' km',
          icon: 'utensils'
        }
      ];
    } else if (region === 'Bali') {
      regionOptions = [
        { 
          name: 'Warung Babi Guling', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Potato Head Beach Club', 
          type: 'fine_dining', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Restoran Seafood Jimbaran', 
          type: 'seafood_restaurant', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'fish'
        }
      ];
    } else if (region === 'Yogyakarta') {
      regionOptions = [
        { 
          name: 'Gudeg Yu Djum', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Bakpia Pathok', 
          type: 'bakery', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'bread-slice'
        },
        { 
          name: 'Restoran Bale Bengong', 
          type: 'fine_dining', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'utensils'
        }
      ];
    } else if (region === 'Surabaya') {
      regionOptions = [
        { 
          name: 'Bebek Sinjay', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Bakso Pak Djoko', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 4) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Layar Seafood', 
          type: 'seafood_restaurant', 
          distance: this.calculateRandomDistance(2, 8) + ' km',
          icon: 'fish'
        }
      ];
    } else if (region === 'Bandung') {
      regionOptions = [
        { 
          name: 'The Valley Bistro', 
          type: 'fine_dining', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Rumah Sosis', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(2, 7) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Kampung Daun', 
          type: 'fine_dining', 
          distance: this.calculateRandomDistance(5, 12) + ' km',
          icon: 'utensils'
        }
      ];
    } else if (region === 'Malang') {
      regionOptions = [
        { 
          name: 'Toko Oen', 
          type: 'colonial_restaurant', 
          distance: this.calculateRandomDistance(1, 4) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Bakso President', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Inggil Museum Resto', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'utensils'
        }
      ];
    } else {
      // Generic options for other regions
      regionOptions = [
        { 
          name: 'Restoran Lokal Terkenal', 
          type: 'local_restaurant', 
          distance: this.calculateRandomDistance(1, 5) + ' km',
          icon: 'utensils'
        },
        { 
          name: 'Pusat Kuliner', 
          type: 'food_court', 
          distance: this.calculateRandomDistance(1, 6) + ' km',
          icon: 'utensils'
        }
      ];
    }

    // Combine and return
    return [...regionOptions, ...commonOptions];
  }

  /**
   * Get attraction recommendations
   */
  getAttractionRecommendations(coordinates, region) {
    // Common attraction options
    const commonOptions = [
      { 
        name: 'Taman Kota', 
        type: 'park', 
        distance: this.calculateRandomDistance(0.5, 3) + ' km',
        icon: 'tree'
      },
      { 
        name: 'Museum', 
        type: 'museum', 
        distance: this.calculateRandomDistance(1, 5) + ' km',
        icon: 'landmark'
      }
    ];

    // Region-specific attractions
    let regionOptions = [];

    if (region === 'Jakarta') {
      regionOptions = [
        { 
          name: 'Monas', 
          type: 'monument', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'monument'
        },
        { 
          name: 'Taman Mini Indonesia Indah', 
          type: 'amusement_park', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'flag'
        },
        { 
          name: 'Ancol Dreamland', 
          type: 'amusement_park', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'ferris-wheel'
        }
      ];
    } else if (region === 'Bali') {
      regionOptions = [
        { 
          name: 'Pantai Kuta', 
          type: 'beach', 
          distance: this.calculateRandomDistance(1, 10) + ' km',
          icon: 'umbrella-beach'
        },
        { 
          name: 'Pura Tanah Lot', 
          type: 'temple', 
          distance: this.calculateRandomDistance(10, 30) + ' km',
          icon: 'place-of-worship'
        },
        { 
          name: 'Ubud Monkey Forest', 
          type: 'nature_reserve', 
          distance: this.calculateRandomDistance(10, 30) + ' km',
          icon: 'leaf'
        }
      ];
    } else if (region === 'Yogyakarta') {
      regionOptions = [
        { 
          name: 'Candi Borobudur', 
          type: 'temple', 
          distance: this.calculateRandomDistance(20, 40) + ' km',
          icon: 'place-of-worship'
        },
        { 
          name: 'Candi Prambanan', 
          type: 'temple', 
          distance: this.calculateRandomDistance(15, 30) + ' km',
          icon: 'place-of-worship'
        },
        { 
          name: 'Kraton Yogyakarta', 
          type: 'palace', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'landmark'
        }
      ];
    } else if (region === 'Surabaya') {
      regionOptions = [
        { 
          name: 'Kebun Binatang Surabaya', 
          type: 'zoo', 
          distance: this.calculateRandomDistance(1, 10) + ' km',
          icon: 'paw'
        },
        { 
          name: 'House of Sampoerna', 
          type: 'museum', 
          distance: this.calculateRandomDistance(2, 8) + ' km',
          icon: 'landmark'
        },
        { 
          name: 'Tugu Pahlawan', 
          type: 'monument', 
          distance: this.calculateRandomDistance(1, 7) + ' km',
          icon: 'monument'
        }
      ];
    } else if (region === 'Bandung') {
      regionOptions = [
        { 
          name: 'Tangkuban Perahu', 
          type: 'natural_feature', 
          distance: this.calculateRandomDistance(15, 30) + ' km',
          icon: 'mountain'
        },
        { 
          name: 'Kawah Putih', 
          type: 'natural_feature', 
          distance: this.calculateRandomDistance(30, 50) + ' km',
          icon: 'mountain'
        },
        { 
          name: 'Gedung Sate', 
          type: 'historic_site', 
          distance: this.calculateRandomDistance(1, 8) + ' km',
          icon: 'landmark'
        }
      ];
    } else if (region === 'Malang') {
      regionOptions = [
        { 
          name: 'Gunung Bromo', 
          type: 'natural_feature', 
          distance: this.calculateRandomDistance(40, 60) + ' km',
          icon: 'mountain'
        },
        { 
          name: 'Jatim Park', 
          type: 'amusement_park', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'ferris-wheel'
        },
        { 
          name: 'Candi Singosari', 
          type: 'temple', 
          distance: this.calculateRandomDistance(10, 20) + ' km',
          icon: 'place-of-worship'
        }
      ];
    } else {
      // Generic options for other regions
      regionOptions = [
        { 
          name: 'Objek Wisata Terkenal', 
          type: 'tourist_attraction', 
          distance: this.calculateRandomDistance(5, 15) + ' km',
          icon: 'camera'
        },
        { 
          name: 'Tempat Bersejarah', 
          type: 'historic_site', 
          distance: this.calculateRandomDistance(2, 10) + ' km',
          icon: 'landmark'
        }
      ];
    }

    // Combine and return
    return [...regionOptions, ...commonOptions];
  }

  /**
   * Calculate a random distance within range
   * @private
   */
  calculateRandomDistance(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
  }

  /**
   * Get region name based on coordinates
   * @private
   */
  getRegionFromCoordinates(coordinates) {
    // Simple mapping based on coordinates
    // In a real implementation, this would use reverse geocoding
    
    // Jakarta: -6.2, 106.8
    if (this.isNearCoordinates(coordinates, -6.2, 106.8, 0.3)) {
      return 'Jakarta';
    }
    // Bali: -8.3, 115.0
    else if (this.isNearCoordinates(coordinates, -8.3, 115.0, 0.5)) {
      return 'Bali';
    }
    // Yogyakarta: -7.8, 110.4
    else if (this.isNearCoordinates(coordinates, -7.8, 110.4, 0.3)) {
      return 'Yogyakarta';
    }
    // Surabaya: -7.3, 112.7
    else if (this.isNearCoordinates(coordinates, -7.3, 112.7, 0.3)) {
      return 'Surabaya';
    }
    // Bandung: -6.9, 107.6
    else if (this.isNearCoordinates(coordinates, -6.9, 107.6, 0.3)) {
      return 'Bandung';
    }
    // Malang: -7.9, 112.6
    else if (this.isNearCoordinates(coordinates, -7.9, 112.6, 0.3)) {
      return 'Malang';
    }
    // Default to Generic Indonesia
    else {
      return 'Indonesia';
    }
  }

  /**
   * Check if coordinates are near a reference point
   * @private
   */
  isNearCoordinates(coords, refLat, refLng, threshold = 0.3) {
    return Math.abs(coords.lat - refLat) < threshold && 
           Math.abs(coords.lng - refLng) < threshold;
  }
}

// Initialize the singleton
const nearbyPlacesAI = new NearbyPlacesAI();

/**
 * Fetch nearby places based on coordinates and place type
 * @param {Object} coordinates - {lat, lng} object
 * @param {String} placeType - Type of places to recommend
 * @returns {Promise} - Array of place recommendations
 */
async function getNearbyPlaces(coordinates, placeType = PLACE_TYPES.TRANSPORTATION) {
  return await nearbyPlacesAI.getRecommendations(coordinates, placeType);
}

/**
 * Get available place types
 * @returns {Object} - Object with place type constants
 */
function getPlaceTypes() {
  return PLACE_TYPES;
}

// Export functions for use in other scripts
window.getNearbyPlaces = getNearbyPlaces;
window.getPlaceTypes = getPlaceTypes;