// Google Maps Integration for Venue Location Tab
// Initializes and manages the map in the venue location tab

// Global references to map, marker, and infoWindow for easier access across functions
let globalMap = null;
let globalMarker = null;
let globalInfoWindow = null;

// Show toast notification
function showToast(title, message, type) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toastId = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = toastId;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  // Set toast HTML
  const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  
  toast.innerHTML = `
    <div class="toast-header ${bgClass} text-white">
      <i class="fas ${icon} me-2"></i>
      <strong class="me-auto">${title}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Initialize and show the toast
  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toast, {
      autohide: true,
      delay: 5000
    });
    
    bsToast.show();
  } else {
    // Fallback if bootstrap is not loaded
    toast.style.display = 'block';
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
  
  // Remove from DOM after hiding
  toast.addEventListener('hidden.bs.toast', function() {
    toast.remove();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the venue form page with location tab
  const venueMap = document.getElementById('venue-map');
  const venueLocationTab = document.querySelector('[data-tab="location-info"]');
  
  if (!venueMap || !venueLocationTab) return;
  
  // Add event listener to initialize map when location tab is clicked
  venueLocationTab.addEventListener('click', function() {
    initializeVenueMap();
  });
  
  // Also initialize map if it's already the active tab
  if (venueLocationTab.classList.contains('active')) {
    initializeVenueMap();
  }
  
  // If we have coordinates in the inputs, make sure to update address fields
  const latInput = document.getElementById('lat-input');
  const lngInput = document.getElementById('lng-input');
  
  if (latInput && lngInput && latInput.value && lngInput.value) {
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      // Wait for map to initialize before updating address
      setTimeout(() => {
        const position = new google.maps.LatLng(lat, lng);
        updateAddressFromCoordinates(position);
      }, 1000);
    }
  }
});

function initializeVenueMap() {
  // Get map container
  const mapContainer = document.getElementById('venue-map');
  if (!mapContainer) return;
  
  // Check if map is already initialized
  if (mapContainer.dataset.initialized === 'true') return;
  
  // Get coordinates from inputs
  const latInput = document.getElementById('lat-input');
  const lngInput = document.getElementById('lng-input');
  
  if (!latInput || !lngInput) return;
  
  const lat = parseFloat(latInput.value) || -7.9546; // Default to Malang coordinates
  const lng = parseFloat(lngInput.value) || 112.6129;
  
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    // Load Google Maps API script dynamically
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAS5Vc3Ixr-TYcoAdmTAWqfsuQchoQtEHs&libraries=places&callback=initVenueMapCallback`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // Define callback function to be called when API is loaded
    window.initVenueMapCallback = function() {
      createVenueMap(mapContainer, lat, lng);
    };
  } else {
    // Google Maps API is already loaded, create map directly
    createVenueMap(mapContainer, lat, lng);
  }
  
  // Mark map as initialized
  mapContainer.dataset.initialized = 'true';
}

function createVenueMap(mapContainer, lat, lng) {
  // Create map configuration
  const mapOptions = {
    center: { lat: lat, lng: lng },
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,      // Using custom controls instead
    fullscreenControl: false,   // Remove standard fullscreen control
    streetViewControl: false,   // Remove street view control to simplify UI
    zoomControl: false,         // Using custom zoom controls
    disableDefaultUI: false,    // Disable default UI but keep some controls
    scrollwheel: true,          // Enable zoom with mousewheel
    gestureHandling: 'greedy',  // Make map responsive to touch/mouse without requiring Ctrl key
    styles: [                   // Subtle style customizations for better UI integration
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{visibility: 'on'}]  // Show points of interest
      }
    ]
  };
  
  // Create the map
  const map = new google.maps.Map(mapContainer, mapOptions);
  
  // Create marker for venue location
  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "Lokasi Venue",
    icon: {
      path: google.maps.SymbolPath.MARKER,
      fillColor: "#e9c070",
      fillOpacity: 1,
      strokeColor: "#132B50",
      strokeWeight: 2,
      scale: 15
    }
  });
  
  // Add info window to marker
  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h5 style="margin: 0 0 5px; color: #132B50; font-weight: bold;">Venue Location</h5>
        <p style="margin: 0 0 5px; font-size: 12px;">Koordinat: ${lat.toFixed(6)}° S, ${lng.toFixed(6)}° E</p>
      </div>
    `
  });
  
  // Set global references for use in other functions
  globalMap = map;
  globalMarker = marker;
  globalInfoWindow = infoWindow;
  
  // Fetch transportation information for the initial marker location
  fetchTransportationInfo(marker.getPosition());
  
  // Open info window when marker is clicked
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
  
  // Update coordinates when marker is dragged
  marker.addListener('dragend', function() {
    const position = marker.getPosition();
    updateCoordinates(position);
    
    // Update info window content with loading state
    infoWindow.setContent(`
      <div style="padding: 10px; max-width: 200px;">
        <h5 style="margin: 0 0 5px; color: #132B50; font-weight: bold;">Venue Location</h5>
        <p style="margin: 0 0 5px; font-size: 12px;">Koordinat: ${position.lat().toFixed(6)}° S, ${position.lng().toFixed(6)}° E</p>
        <p style="margin: 0; font-size: 12px; color: #4a5568;">Memuat informasi alamat...</p>
      </div>
    `);
    
    // Open info window if not already open
    infoWindow.open(map, marker);
    
    // Update address info based on new position
    updateAddressFromCoordinates(position);
  });
  
  // Handle map click to move marker
  map.addListener('click', function(event) {
    marker.setPosition(event.latLng);
    updateCoordinates(event.latLng);
    
    // Update info window content with loading state
    infoWindow.setContent(`
      <div style="padding: 10px; max-width: 200px;">
        <h5 style="margin: 0 0 5px; color: #132B50; font-weight: bold;">Venue Location</h5>
        <p style="margin: 0 0 5px; font-size: 12px;">Koordinat: ${event.latLng.lat().toFixed(6)}° S, ${event.latLng.lng().toFixed(6)}° E</p>
        <p style="margin: 0; font-size: 12px; color: #4a5568;">Memuat informasi alamat...</p>
      </div>
    `);
    
    // Open info window if not already open
    infoWindow.open(map, marker);
    
    // Update address info based on new position
    updateAddressFromCoordinates(event.latLng);
  });
  
  // Setup Places Autocomplete
  setupPlacesAutocomplete(map, marker, infoWindow);
  
  // Setup map controls
  setupMapControls(map);
}

// Update coordinate display and hidden inputs
function updateCoordinates(position) {
  const lat = position.lat().toFixed(6);
  const lng = position.lng().toFixed(6);
  
  // Update display
  const coordDisplay = document.getElementById('coordinates-display');
  if (coordDisplay) {
    coordDisplay.textContent = `${Math.abs(lat)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lng)}° ${lng < 0 ? 'W' : 'E'}`;
  }
  
  // Update hidden inputs
  const latInput = document.getElementById('lat-input');
  const lngInput = document.getElementById('lng-input');
  if (latInput) latInput.value = lat;
  if (lngInput) lngInput.value = lng;
}

// Setup Places Autocomplete for venue search
function setupPlacesAutocomplete(map, marker, infoWindow) {
  const searchInput = document.getElementById('venue-search');
  if (!searchInput) return;
  
  const autocomplete = new google.maps.places.Autocomplete(searchInput, {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'id' },
    fields: ['geometry', 'name', 'formatted_address', 'address_components']
  });
  
  // Bias autocomplete results to current map view
  autocomplete.bindTo('bounds', map);
  
  // Handle place selection
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      // Place not found
      window.alert('Lokasi tidak ditemukan. Silakan coba pencarian lain.');
      return;
    }
    
    // Center map and move marker to selected place
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
    
    // Update coordinates
    updateCoordinates(place.geometry.location);
    
    // Update info window
    infoWindow.setContent(`
      <div style="padding: 10px; max-width: 200px;">
        <h5 style="margin: 0 0 5px; color: #132B50; font-weight: bold;">${place.name || 'Venue Location'}</h5>
        <p style="margin: 0 0 5px; font-size: 12px;">${place.formatted_address || ''}</p>
        <p style="margin: 0; font-size: 12px; color: #4a5568;">Koordinat: ${place.geometry.location.lat().toFixed(6)}° S, ${place.geometry.location.lng().toFixed(6)}° E</p>
      </div>
    `);
    
    // Open info window
    infoWindow.open(map, marker);
    
    // Update address fields if available
    if (place.address_components) {
      updateAddressFields(place);
    }
  });
}

// Update address fields from coordinates using Geocoding API
function updateAddressFromCoordinates(position) {
  const geocoder = new google.maps.Geocoder();
  
  // Show loading indicator
  showToast('Memuat Data', 'Sedang mengambil informasi alamat dari lokasi...', 'success');
  
  geocoder.geocode({ location: position }, function(results, status) {
    if (status === 'OK' && results[0]) {
      // Update address fields
      updateAddressFields(results[0]);
      
      // Update any info window that might be open
      const infoWindows = Array.from(document.querySelectorAll('.gm-style-iw')).map(
        element => element.__gmiw
      ).filter(Boolean);
      
      if (infoWindows.length > 0 && results[0].formatted_address) {
        // Try to find the info window content element
        const contentElements = document.querySelectorAll('.gm-style-iw-d p');
        for (const element of contentElements) {
          if (element.textContent.includes('Memuat informasi alamat')) {
            element.textContent = results[0].formatted_address;
            break;
          }
        }
      }
    } else {
      // Show error if geocoding fails
      showToast('Error', 'Tidak dapat mendapatkan informasi alamat untuk lokasi ini', 'error');
    }
  });
}

// Update address fields from place data
function updateAddressFields(place) {
  // Extract address components
  let components = place.address_components;
  if (!components) {
    console.error("No address components found in place data:", place);
    return;
  }
  
  // Helper function to extract component by type
  function getComponent(types) {
    // Convert single type to array if needed
    const typeArr = Array.isArray(types) ? types : [types];
    
    // Try each type in priority order
    for (const type of typeArr) {
      const component = components.find(comp => comp.types.includes(type));
      if (component) return component.long_name;
    }
    return '';
  }
  
  // Extract all address components
  const streetNumber = getComponent('street_number');
  const route = getComponent('route');
  const neighborhood = getComponent(['neighborhood', 'political']);
  const sublocality2 = getComponent(['sublocality_level_2', 'neighborhood']);
  const village = getComponent(['administrative_area_level_4', 'sublocality_level_2']);
  const sublocality1 = getComponent(['sublocality_level_1', 'sublocality']);
  const district = getComponent(['administrative_area_level_3', 'sublocality_level_1']);
  const locality = getComponent(['locality', 'administrative_area_level_2']);
  const city = getComponent(['administrative_area_level_2', 'locality']);
  const adminArea1 = getComponent('administrative_area_level_1');
  const postalCode = getComponent('postal_code');
  const country = getComponent('country');
  
  console.log("Address components extracted:", {
    streetNumber, route, neighborhood, sublocality2, village, 
    sublocality1, district, locality, city, adminArea1, postalCode, country
  });
  
  // Format a complete address with all available components
  let formattedAddress = '';
  
  if (streetNumber && route) {
    formattedAddress += `${route} No. ${streetNumber}`;
  } else if (route) {
    formattedAddress += route;
  }
  
  // Add neighborhood or sublocality (Kelurahan level)
  const kelurahan = village || sublocality2 || neighborhood;
  if (kelurahan) {
    formattedAddress += formattedAddress ? `, ${kelurahan}` : kelurahan;
  }
  
  // Add district (Kecamatan level)
  const kecamatan = district || sublocality1;
  if (kecamatan) {
    formattedAddress += formattedAddress ? `, ${kecamatan}` : kecamatan;
  }
  
  // Add city/regency (Kota/Kabupaten level)
  const kotaKabupaten = city || locality;
  if (kotaKabupaten) {
    formattedAddress += formattedAddress ? `, ${kotaKabupaten}` : kotaKabupaten;
  }
  
  // Add province (Provinsi level)
  if (adminArea1) {
    formattedAddress += formattedAddress ? `, ${adminArea1}` : adminArea1;
  }
  
  // Add postal code
  if (postalCode) {
    formattedAddress += formattedAddress ? ` ${postalCode}` : postalCode;
  }
  
  // If we couldn't build a structured address, use Google's formatted address
  if (!formattedAddress && place.formatted_address) {
    formattedAddress = place.formatted_address;
  }
  
  console.log("Formatted address:", formattedAddress);
  
  // 1. Update Alamat Lengkap field
  const addressField = document.getElementById('address');
  if (addressField) {
    addressField.value = formattedAddress;
    
    // Also update in edit view
    const addressTextareas = document.querySelectorAll('.edit-view textarea');
    addressTextareas.forEach(textarea => {
      if (textarea.closest('.info-item')?.querySelector('.info-label')?.textContent.includes('Alamat')) {
        textarea.value = formattedAddress;
      }
    });
    
    // Update in readonly view
    const addressReadonlyViews = document.querySelectorAll('.info-content.readonly-view');
    addressReadonlyViews.forEach(view => {
      if (view.closest('.info-item')?.querySelector('.info-label')?.textContent.includes('Alamat')) {
        view.textContent = formattedAddress;
      }
    });
  }
  
  // 2. Update Kota/Kabupaten field
  updateField('regency', kotaKabupaten, 'Kota/Kabupaten');
  
  // 3. Update Provinsi field
  updateField('province', adminArea1, 'Provinsi', true);
  
  // 4. Update Kecamatan/District field
  updateField('district', kecamatan, 'Kecamatan');
  
  // 5. Update Kelurahan/Village field
  updateField('village', kelurahan, 'Kelurahan');
  
  // 6. Update Kode Pos field
  updateField('postal-code', postalCode, 'Kode Pos');
  
  // 7. Update status-location element if it exists
  const statusLocation = document.getElementById('status-location');
  if (statusLocation) {
    let locationText = '';
    if (kotaKabupaten) locationText += kotaKabupaten;
    if (adminArea1) locationText += (locationText ? ', ' : '') + adminArea1;
    if (locationText) {
      statusLocation.textContent = locationText;
    }
  }
  
  // 8. Update transportation information based on location
  fetchTransportationInfo(place.geometry.location);
  
  // Show notification of successful address update
  showToast('Lokasi Diperbarui', 'Informasi alamat berhasil diperbarui dari map', 'success');
  
  // Helper function to update a field by ID or label text
  function updateField(fieldId, value, labelText, isSelect = false) {
    if (!value) return;
    
    // Try to find by ID first
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = value;
    }
    
    // Update in edit view
    if (isSelect) {
      // For select elements (like province)
      const selectElements = document.querySelectorAll('select.form-select');
      selectElements.forEach(select => {
        const label = select.closest('.info-item')?.querySelector('.info-label');
        if (label && label.textContent.includes(labelText)) {
          // Find matching option
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text === value || 
                select.options[i].text.includes(value) || 
                value.includes(select.options[i].text)) {
              select.selectedIndex = i;
              break;
            }
          }
        }
      });
    } else {
      // For input elements
      const inputElements = document.querySelectorAll('.edit-view input');
      inputElements.forEach(input => {
        const label = input.closest('.info-item')?.querySelector('.info-label');
        if (label && label.textContent.includes(labelText)) {
          input.value = value;
        }
      });
    }
    
    // Update in readonly view
    const readonlyViews = document.querySelectorAll('.info-content.readonly-view');
    readonlyViews.forEach(view => {
      const label = view.closest('.info-item')?.querySelector('.info-label');
      if (label && label.textContent.includes(labelText)) {
        view.textContent = value;
      }
    });
  }
}

// Setup custom map controls
function setupMapControls(map) {
  // Zoom in button
  const zoomInButton = document.getElementById('btn-zoom-in');
  if (zoomInButton) {
    zoomInButton.addEventListener('click', function() {
      map.setZoom(map.getZoom() + 1);
    });
  }
  
  // Zoom out button
  const zoomOutButton = document.getElementById('btn-zoom-out');
  if (zoomOutButton) {
    zoomOutButton.addEventListener('click', function() {
      map.setZoom(map.getZoom() - 1);
    });
  }
  
  // My location button on map
  const myLocationButton = document.getElementById('btn-my-location');
  if (myLocationButton) {
    myLocationButton.addEventListener('click', function() {
      // Ensure the map is initialized before trying to use it
      if (!globalMap || !globalMarker || !globalInfoWindow) {
        showToast('Error', 'Peta belum dimuat. Silakan coba lagi.', 'error');
        return;
      }
      
      getCurrentLocation(function(userLatLng, userLocation) {
        // Set marker position using global reference
        globalMarker.setPosition(userLatLng);
        
        // Pan and zoom to the location with animation
        globalMap.panTo(userLatLng);
        globalMap.setZoom(17); // Closer zoom for better detail
        
        // Update coordinates display
        updateCoordinates(userLatLng);
        
        // Update address fields with reverse geocoding
        updateAddressFromCoordinates(userLatLng);
        
        // Open info window at the new location
        globalInfoWindow.setContent(`
          <div style="padding: 10px; max-width: 200px;">
            <h5 style="margin: 0 0 5px; color: #132B50; font-weight: bold;">Lokasi Anda</h5>
            <p style="margin: 0 0 5px; font-size: 12px;">Koordinat: ${userLocation.lat.toFixed(6)}° S, ${userLocation.lng.toFixed(6)}° E</p>
            <p style="margin: 0; font-size: 12px; color: #4a5568;">Memuat informasi alamat...</p>
          </div>
        `);
        globalInfoWindow.open(globalMap, globalMarker);
        
        showToast('Lokasi Ditemukan', 'Menggunakan lokasi perangkat Anda saat ini', 'success');
      });
    });
  }
  
  // Kode untuk tombol 'Lokasi Saya' di kolom pencarian telah dihapus karena sudah ada tombol yang sama di peta
  
  // Map type buttons
  const mapTypeButtons = document.querySelectorAll('.map-type-btn');
  mapTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      mapTypeButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Change map type
      const mapType = this.getAttribute('data-map-type');
      map.setMapTypeId(mapType);
    });
  });
}

// Function to fetch transportation information from Google Places API
function fetchTransportationInfo(location) {
  if (!globalMap) {
    console.error("Map is not initialized");
    return;
  }
  
  // Show loading indicator
  showToast('Memuat Data', 'Sedang mengambil informasi transportasi di sekitar lokasi...', 'success');
  
  // Create PlacesService instance using the map
  const service = new google.maps.places.PlacesService(globalMap);
  
  // Search for airports nearby
  service.nearbySearch({
    location: location,
    rankBy: google.maps.places.RankBy.DISTANCE,
    type: 'airport'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      // Get the closest airport
      const closestAirport = results[0];
      const airportDistance = calculateDistance(location, closestAirport.geometry.location);
      const airportName = closestAirport.name;
      
      // Update airport fields
      updateTransportField('airport-distance', 'airport-name', 'airport-info-display', 
                          airportDistance, airportName, 'Bandara');
    }
  });
  
  // Search for train stations nearby
  service.nearbySearch({
    location: location,
    rankBy: google.maps.places.RankBy.DISTANCE,
    type: 'train_station'
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      // Get the closest train station
      const closestStation = results[0];
      const stationDistance = calculateDistance(location, closestStation.geometry.location);
      const stationName = closestStation.name;
      
      // Update train station fields
      updateTransportField('train-distance', 'train-name', 'train-info-display', 
                          stationDistance, stationName, 'Stasiun');
    }
  });
  
  // Search for public transportation nearby
  const publicTransportTypes = ['bus_station', 'transit_station', 'subway_station'];
  let nearbyPublicTransport = [];
  
  // Process each transport type sequentially
  function processNextTransportType(index) {
    if (index >= publicTransportTypes.length) {
      // All types processed, update the UI
      updatePublicTransportInfo(nearbyPublicTransport);
      return;
    }
    
    service.nearbySearch({
      location: location,
      radius: 1000,  // 1km radius
      type: publicTransportTypes[index]
    }, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        // Add nearby public transport options
        results.forEach(place => {
          const placeDistance = calculateDistance(location, place.geometry.location);
          nearbyPublicTransport.push({
            name: place.name,
            distance: placeDistance,
            type: publicTransportTypes[index].replace('_', ' ')
          });
        });
      }
      
      // Process next type
      processNextTransportType(index + 1);
    });
  }
  
  // Start processing transport types
  processNextTransportType(0);
}

// Function to calculate distance between two points in kilometers
function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const lat1 = point1.lat();
  const lon1 = point1.lng();
  const lat2 = point2.lat();
  const lon2 = point2.lng();
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return parseFloat(distance.toFixed(1));
}

// Function to update transportation field values and display
function updateTransportField(distanceId, nameId, displayId, distance, name, prefix) {
  // Update input fields
  const distanceField = document.getElementById(distanceId);
  const nameField = document.getElementById(nameId);
  
  if (distanceField) distanceField.value = distance;
  if (nameField) nameField.value = name;
  
  // Update readonly display
  const displayElement = document.getElementById(displayId);
  if (displayElement) {
    displayElement.textContent = `${distance} km dari ${prefix} ${name}`;
  }
}

// Function to update public transport information
function updatePublicTransportInfo(transportOptions) {
  // Sort by distance
  transportOptions.sort((a, b) => a.distance - b.distance);
  
  // Take the closest 3 options
  const closestOptions = transportOptions.slice(0, 3);
  
  // Format text for display
  let transportText = '';
  let transportHTML = '<ul class="mb-0 ps-3">';
  
  closestOptions.forEach(option => {
    transportText += `- ${option.name} (${option.distance} km)\n`;
    transportHTML += `<li>${option.name} (${option.distance} km)</li>`;
  });
  
  // Add standard options
  transportText += '- Taksi Online tersedia\n- Rental kendaraan tersedia';
  transportHTML += '<li>Taksi Online tersedia</li><li>Rental kendaraan tersedia</li></ul>';
  
  // Update textarea
  const publicTransportField = document.getElementById('public-transport');
  if (publicTransportField) {
    publicTransportField.value = transportText;
  }
  
  // Update readonly display
  const displayElement = document.getElementById('public-transport-display');
  if (displayElement) {
    displayElement.innerHTML = transportHTML;
  }
}

// Function to get current location
function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    // Show loading indicator
    showToast('Memuat Lokasi', 'Sedang mendapatkan lokasi Anda...', 'success');
    
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Create location object
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Create LatLng object for Google Maps
        const userLatLng = new google.maps.LatLng(userLocation.lat, userLocation.lng);
        
        // Call the callback with the location
        if (typeof callback === 'function') {
          callback(userLatLng, userLocation);
        }
      },
      function(error) {
        let errorMessage = 'Tidak dapat mengakses lokasi perangkat';
        
        // More detailed error messages based on error code
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informasi lokasi tidak tersedia. Coba lagi.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Permintaan lokasi habis waktu. Coba lagi.';
            break;
        }
        
        showToast('Error', errorMessage, 'error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    showToast('Error', 'Geolocation tidak didukung oleh browser Anda', 'error');
  }
}

// End of file