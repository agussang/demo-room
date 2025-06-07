/**
 * Nearby Places functionality for location section
 */

// Global variables
let placesService;
let currentLatLng;
let searchRadius = 1000; // Default 1KM radius
let minRating = 3.0; // Minimum rating of 3.0 or higher

/**
 * Initialize the nearby places functionality
 * @param {google.maps.Map} map - The Google Map instance
 * @param {Object} location - The location coordinates {lat, lng}
 */
function initNearbyPlaces(map, location) {
  // Initialize the Places Service with the map
  placesService = new google.maps.places.PlacesService(map);
  currentLatLng = location;
  
  // Load nearby places for each category
  loadNearbyPlaces('transportation', ['airport', 'train_station', 'bus_station', 'transit_station']);
  loadNearbyPlaces('shopping', ['shopping_mall', 'department_store', 'supermarket']);
  loadNearbyPlaces('dining', ['restaurant', 'cafe', 'food']);
  loadNearbyPlaces('attractions', ['tourist_attraction', 'museum', 'park', 'amusement_park']);
}

/**
 * Load nearby places for a specific category
 * @param {string} category - The category ID (transportation, shopping, dining, attractions)
 * @param {Array<string>} types - The Google Places API types to search for
 */
function loadNearbyPlaces(category, types) {
  // Show loading indicator
  document.getElementById(`${category}-loading`).style.display = 'block';
  document.getElementById(`${category}-content`).innerHTML = '';
  
  // Create the search request
  const request = {
    location: currentLatLng,
    radius: searchRadius, // Use fixed radius of 1KM
    type: types[0] // Primary type
  };
  
  // Perform the search
  placesService.nearbySearch(request, (results, status) => {
    // Hide loading indicator
    document.getElementById(`${category}-loading`).style.display = 'none';
    
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      // Filter results to only include places within the search radius AND with rating >= 3
      const filteredResults = results.filter(place => {
        const distance = getDistance(currentLatLng, place.geometry.location);
        return distance <= searchRadius && (!place.rating || place.rating >= minRating);
      });
      
      if (filteredResults.length > 0) {
        displayPlacesResults(category, filteredResults);
      } else {
        tryAlternateTypes(category, types);
      }
    } else {
      tryAlternateTypes(category, types);
    }
  });
}

/**
 * Try alternate types if the primary type doesn't return results
 * @param {string} category - The category ID
 * @param {Array<string>} types - The Google Places API types to search for
 */
function tryAlternateTypes(category, types) {
  if (types.length <= 1) {
    showNoResultsMessage(category);
    return;
  }

  let typesChecked = 0;
  
  for (let i = 1; i < types.length; i++) {
    const alternateRequest = {
      location: currentLatLng,
      radius: searchRadius,
      type: types[i]
    };
    
    // Retry with alternate type
    placesService.nearbySearch(alternateRequest, (altResults, altStatus) => {
      typesChecked++;
      
      if (altStatus === google.maps.places.PlacesServiceStatus.OK && altResults.length > 0) {
        // Filter results to only include places within the search radius AND with rating >= 3
        const filteredResults = altResults.filter(place => {
          const distance = getDistance(currentLatLng, place.geometry.location);
          return distance <= searchRadius && (!place.rating || place.rating >= minRating);
        });
        
        if (filteredResults.length > 0) {
          displayPlacesResults(category, filteredResults);
          return;
        }
      }
      
      // If we've checked all types and still nothing, show no results message
      if (typesChecked >= types.length - 1) {
        showNoResultsMessage(category);
      }
    });
  }
}

/**
 * Show a message when no results are found
 * @param {string} category - The category ID
 */
function showNoResultsMessage(category) {
  document.getElementById(`${category}-content`).innerHTML = `
    <div class="alert alert-light">
      <p>Tidak ada ${getCategoryName(category)} terdekat ditemukan dalam radius 1KM dengan rating minimal 3.0.</p>
    </div>
  `;
}

/**
 * Get the display name for a category
 * @param {string} category - The category ID
 * @returns {string} - The display name in Indonesian
 */
function getCategoryName(category) {
  const names = {
    'transportation': 'transportasi',
    'shopping': 'tempat belanja',
    'dining': 'tempat makan',
    'attractions': 'tempat wisata'
  };
  
  return names[category] || category;
}

/**
 * Display the places results for a category
 * @param {string} category - The category ID
 * @param {Array} places - The places results from Google Places API
 */
function displayPlacesResults(category, places) {
  const contentContainer = document.getElementById(`${category}-content`);
  
  // Sort places by rating (highest first), then by distance
  places.sort((a, b) => {
    // First sort by rating (highest first)
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }
    
    // If ratings are equal, sort by distance
    const distanceA = getDistance(currentLatLng, a.geometry.location);
    const distanceB = getDistance(currentLatLng, b.geometry.location);
    return distanceA - distanceB;
  });
  
  let html = '<div class="row">';
  
  // Only display up to 6 results
  const maxPlaces = Math.min(places.length, 6);
  
  for (let i = 0; i < maxPlaces; i++) {
    const place = places[i];
    
    // Calculate distance in meters or kilometers
    const distance = getDistance(currentLatLng, place.geometry.location);
    const distanceDisplay = distance < 1000 ? 
      `${Math.round(distance)} meter` : 
      `${(distance / 1000).toFixed(1)} km`;
    
    // Get place photo if available
    let photoUrl = '../assets/images/placeholder.jpg';
    if (place.photos && place.photos.length > 0) {
      photoUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 300 });
    }
    
    // Rating badge color based on rating
    const ratingBadgeClass = getRatingBadgeClass(place.rating);
    
    // Create card HTML
    html += `
      <div class="col-md-6 mb-3">
        <div class="card h-100 shadow-sm">
          <div class="card-img-top bg-light" style="height: 140px; background-image: url('${photoUrl}'); background-size: cover; background-position: center;"></div>
          <div class="card-body">
            <h6 class="card-title">${place.name}</h6>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-light text-dark">
                <i class="fas fa-map-marker-alt text-danger me-1"></i>${distanceDisplay}
              </span>
              <span class="badge ${ratingBadgeClass}">${getRatingStars(place.rating)}</span>
            </div>
            <p class="card-text small text-muted mb-0">${place.vicinity}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Add search criteria information
  html += '</div>';
  html += `
    <div class="mt-3 text-center">
      <span class="badge bg-primary me-2">Radius: 1 Kilometer</span>
      <span class="badge bg-success">Rating Minimal: 3.0</span>
    </div>
  `;
  
  contentContainer.innerHTML = html;
}

/**
 * Get appropriate badge class based on rating
 * @param {number} rating - The rating value
 * @returns {string} - CSS class for the badge
 */
function getRatingBadgeClass(rating) {
  if (!rating) return 'bg-secondary';
  
  if (rating >= 4.5) return 'bg-success';
  if (rating >= 4.0) return 'bg-primary';
  if (rating >= 3.5) return 'bg-info';
  if (rating >= 3.0) return 'bg-warning text-dark';
  
  return 'bg-secondary';
}

/**
 * Calculate the distance between two LatLng points
 * @param {Object} point1 - The first point {lat, lng}
 * @param {google.maps.LatLng} point2 - The second point from Google Maps
 * @returns {number} - Distance in meters
 */
function getDistance(point1, point2) {
  // Convert point1 to LatLng if it's not already
  const p1 = (point1 instanceof google.maps.LatLng) ? 
    point1 : new google.maps.LatLng(point1.lat, point1.lng);
  
  // Calculate distance using the geometry library
  return google.maps.geometry.spherical.computeDistanceBetween(p1, point2);
}

/**
 * Generate star rating HTML
 * @param {number} rating - The rating (0-5)
 * @returns {string} - HTML for the star rating display
 */
function getRatingStars(rating) {
  if (!rating) return 'Belum ada rating';
  
  return rating.toFixed(1);
}