// Google Maps Address Autocomplete Integration
// This script integrates with the Google Maps API to provide address autocomplete functionality
// API Key: AIzaSyAS5Vc3Ixr-TYcoAdmTAWqfsuQchoQtEHs

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Google Maps and Autocomplete when the page loads
  initializeAddressAutocomplete();
});

function initializeAddressAutocomplete() {
  // Check if we're on the location form page
  const addressInput = document.getElementById('address');
  const postalCodeInput = document.getElementById('postal-code');
  const provinceSelect = document.getElementById('province');
  const regencySelect = document.getElementById('regency');
  const districtSelect = document.getElementById('district');
  const villageSelect = document.getElementById('village');
  
  // If the address input doesn't exist, we're not on the right page
  if (!addressInput) return;
  
  // Load Google Maps API script dynamically
  if (!window.google) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAS5Vc3Ixr-TYcoAdmTAWqfsuQchoQtEHs&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  } else {
    // If Google Maps API is already loaded, initialize the map
    initMap();
  }
}

function initMap() {
  // Get the map container
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Default location (Jakarta, Indonesia)
  const defaultLocation = { lat: -6.1754, lng: 106.8272 };
  
  // Create map instance
  const map = new google.maps.Map(mapElement, {
    center: defaultLocation,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false
  });

  // Create marker for selected location
  const marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    icon: {
      path: google.maps.SymbolPath.MARKER,
      fillColor: "#e9c070",
      fillOpacity: 1,
      strokeColor: "#132B50",
      strokeWeight: 2,
      scale: 15
    }
  });

  // Add click listener to map for marker placement
  map.addListener('click', function(event) {
    placeMarker(event.latLng);
  });

  // Add drag end listener to marker for updating coordinates
  marker.addListener('dragend', function() {
    updateCoordinates(marker.getPosition());
    fetchAddressDetails(marker.getPosition());
  });

  // Initialize the Places Autocomplete
  const addressInput = document.getElementById('hotel-search');
  if (addressInput) {
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'id' },
      fields: ['geometry', 'name', 'formatted_address', 'address_components']
    });

    // Set bounds to Indonesia for better results
    const indonesiaBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(-11.0, 95.0),  // Southwest corner of Indonesia
      new google.maps.LatLng(6.0, 141.0)     // Northeast corner of Indonesia
    );
    autocomplete.setBounds(indonesiaBounds);

    // Handle place selection
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        window.alert('No details available for: ' + place.name);
        return;
      }

      // Set map center and marker position to selected place
      map.setCenter(place.geometry.location);
      placeMarker(place.geometry.location);

      // Fill in the address details from selected place
      fillAddressFields(place);
    });
  }

  // Try to get user's current location
  if (navigator.geolocation) {
    const locationButton = document.getElementById('btn-my-location');
    if (locationButton) {
      locationButton.addEventListener('click', function() {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map.setCenter(userLocation);
            placeMarker(userLocation);
            fetchAddressDetails(userLocation);
          },
          function(error) {
            console.error('Error getting user location:', error);
            showNotification('Error', 'Could not get your location. Please ensure location services are enabled.', 'error');
          }
        );
      });
    }
  }

  // Initialize custom map controls
  initMapControls(map);

  // Function to place marker at clicked location
  function placeMarker(location) {
    marker.setPosition(location);
    updateCoordinates(location);
    fetchAddressDetails(location);
  }

  // Update coordinate display and hidden inputs
  function updateCoordinates(location) {
    const lat = location.lat().toFixed(6);
    const lng = location.lng().toFixed(6);

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

    // Update location status in the business card if it exists
    updateLocationStatus(lat, lng);
  }

  // Fetch address details from coordinates using Google Geocoding API
  function fetchAddressDetails(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, function(results, status) {
      if (status === 'OK' && results[0]) {
        fillAddressFields(results[0]);
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  // Fill in address fields based on selected place or geocoded result
  function fillAddressFields(place) {
    const addressInput = document.getElementById('address');
    const postalCodeInput = document.getElementById('postal-code');
    
    if (!place.address_components) return;
    
    // Extract address components
    let postalCode = '';
    let street = '';
    let city = '';
    let district = '';
    let province = '';
    let formattedAddress = place.formatted_address || '';
    
    // Populate address fields from components
    for (const component of place.address_components) {
      const componentType = component.types[0];
      
      switch (componentType) {
        case 'postal_code':
          postalCode = component.long_name;
          break;
        case 'route':
          street = component.long_name;
          break;
        case 'sublocality_level_1':
        case 'sublocality':
          district = component.long_name;
          break;
        case 'administrative_area_level_2':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          province = component.long_name;
          break;
      }
    }
    
    // Fill address textarea with formatted address
    if (addressInput) {
      addressInput.value = formattedAddress;
    }
    
    // Fill postal code
    if (postalCodeInput && postalCode) {
      postalCodeInput.value = postalCode;
    }
    
    // Try to select matching province if available
    const provinceSelect = document.getElementById('province');
    if (provinceSelect && province) {
      selectOptionByText(provinceSelect, province);
      // Trigger change event to load regencies
      const event = new Event('change');
      provinceSelect.dispatchEvent(event);
      
      // Set a timeout to allow regencies to load, then try to select city
      setTimeout(() => {
        const regencySelect = document.getElementById('regency');
        if (regencySelect && city) {
          selectOptionByText(regencySelect, city);
          // Trigger change event to load districts
          const event = new Event('change');
          regencySelect.dispatchEvent(event);
          
          // Set another timeout for districts
          setTimeout(() => {
            const districtSelect = document.getElementById('district');
            if (districtSelect && district) {
              selectOptionByText(districtSelect, district);
            }
          }, 500);
        }
      }, 500);
    }
  }
  
  // Helper function to select option by text
  function selectOptionByText(selectElement, text) {
    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].text.includes(text) || text.includes(selectElement.options[i].text)) {
        selectElement.selectedIndex = i;
        return true;
      }
    }
    return false;
  }
}

// Initialize custom map controls
function initMapControls(map) {
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
  
  // Map type controls
  const mapTypeButtons = document.querySelectorAll('.map-type-btn');
  mapTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      mapTypeButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-muted');
        btn.style.backgroundColor = '';
        btn.style.color = '';
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      this.classList.remove('text-muted');
      this.style.backgroundColor = '#132B50';
      this.style.color = 'white';
      
      // Change map type
      map.setMapTypeId(this.getAttribute('data-map-type'));
    });
  });
}

// Update location status in the business card
function updateLocationStatus(lat, lng) {
  const locationStatus = document.getElementById('status-location');
  if (!locationStatus) return;
  
  const provinceSelect = document.getElementById('province');
  let locationText = 'Koordinat dipilih';
  
  if (provinceSelect && provinceSelect.selectedIndex > 0) {
    const provinceOption = provinceSelect.options[provinceSelect.selectedIndex];
    locationText = `${provinceOption.text} (${lat}° S, ${lng}° E)`;
  } else {
    locationText = `Koordinat: ${lat}° S, ${lng}° E`;
  }
  
  locationStatus.textContent = locationText;
}

// Show toast notification
function showNotification(title, message, type) {
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
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 5000
  });
  
  bsToast.show();
  
  // Remove from DOM after hiding
  toast.addEventListener('hidden.bs.toast', function() {
    toast.remove();
  });
}