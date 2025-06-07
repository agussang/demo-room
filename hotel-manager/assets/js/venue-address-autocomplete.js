// Google Maps Address Autocomplete Integration for Venues
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

  // Initialize the Places Autocomplete - Use venue-search ID instead of hotel-search
  const addressInput = document.getElementById('venue-search');
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
    try {
      marker.setPosition(location);
      updateCoordinates(location);
      fetchAddressDetails(location);
      
      // Load nearby places if we're on the nearby places step
      if (window.currentStep === 4) {
        // Trigger loading of nearby places data
        if (typeof window.loadNearbyPlaces === 'function') {
          // Try to get place types
          const placeTypes = window.getPlaceTypes ? window.getPlaceTypes() : null;
          
          if (placeTypes) {
            // Load all place types
            window.loadNearbyPlaces('transportation');
            window.loadNearbyPlaces('shopping');
            window.loadNearbyPlaces('dining');
            window.loadNearbyPlaces('attractions');
          }
        }
      }
    } catch (error) {
      console.error("Error placing marker:", error);
    }
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
  }

  // Fetch address details from coordinates using Google Geocoding API
  function fetchAddressDetails(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, function(results, status) {
      if (status === 'OK' && results && results.length > 0) {
        console.log("Geocode results:", results[0]);
        
        // Get detailed address components from Google Maps
        const result = results[0];
        const addressComponents = result.address_components;
        
        // Extract address details directly
        if (addressComponents && addressComponents.length > 0) {
          // Fill standard address field
          const addressInput = document.getElementById('address');
          if (addressInput) {
            addressInput.value = result.formatted_address || '';
          }
          
          // Set postal code
          const postalCode = extractAddressComponent(addressComponents, 'postal_code');
          const postalCodeInput = document.getElementById('postal-code');
          if (postalCodeInput && postalCode) {
            postalCodeInput.value = postalCode;
          }
          
          // Set province
          const province = extractAddressComponent(addressComponents, 'administrative_area_level_1');
          const provinceInput = document.getElementById('province');
          if (provinceInput && province) {
            provinceInput.value = province;
          }
          
          // Set regency/city
          const regency = extractAddressComponent(addressComponents, ['administrative_area_level_2', 'locality']);
          const regencyInput = document.getElementById('regency');
          if (regencyInput && regency) {
            regencyInput.value = regency;
          }
          
          // Set district
          const district = extractAddressComponent(addressComponents, ['sublocality_level_1', 'sublocality']);
          const districtInput = document.getElementById('district');
          if (districtInput && district) {
            districtInput.value = district;
          }
          
          // Set village
          const village = extractAddressComponent(addressComponents, ['sublocality_level_2', 'neighborhood']);
          const villageInput = document.getElementById('village');
          if (villageInput) {
            villageInput.value = village || 'N/A';
          }
          
          // Update location status
          updateLocationStatus(result);
        } else {
          console.warn("No address components found in geocode result");
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }
  
  // Helper function to extract address component by type
  function extractAddressComponent(components, types) {
    if (!components || !Array.isArray(components)) return '';
    
    // If types is a string, convert to array
    const typeArray = Array.isArray(types) ? types : [types];
    
    // Find first matching component
    for (const type of typeArray) {
      const component = components.find(comp => comp.types.includes(type));
      if (component) {
        return component.long_name;
      }
    }
    
    return '';
  }

  // Fill in address fields based on selected place or geocoded result
  function fillAddressFields(place) {
    const addressInput = document.getElementById('address');
    const postalCodeInput = document.getElementById('postal-code');
    const provinceInput = document.getElementById('province');
    const regencyInput = document.getElementById('regency');
    const districtInput = document.getElementById('district');
    const villageInput = document.getElementById('village');
    
    // Defensive check if place or address_components is undefined
    if (!place || !place.address_components) {
      console.log("No valid place data available:", place);
      
      // At least populate the address from formatted_address if available
      if (place && place.formatted_address && addressInput) {
        addressInput.value = place.formatted_address;
      }
      
      return;
    }
    
    // Extract address components
    let postalCode = '';
    let street = '';
    let city = '';
    let district = '';
    let subdistrict = '';
    let province = '';
    let formattedAddress = place.formatted_address || '';
    let villageName = '';
    
    try {
      // Populate address fields from components
      for (const component of place.address_components) {
        // Look for all types of the component
        const types = component.types;
        
        // Postal code
        if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
        
        // Street
        if (types.includes('route')) {
          street = component.long_name;
        }
        
        // Village/Kelurahan (usually sublocality_level_2 in Indonesia)
        if (types.includes('sublocality_level_2') || types.includes('neighborhood')) {
          villageName = component.long_name;
        }
        
        // District/Kecamatan (usually sublocality_level_1 in Indonesia)
        if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
          district = component.long_name;
        }
        
        // City/Regency/Kabupaten (administrative_area_level_2 in Indonesia)
        if (types.includes('administrative_area_level_2') || types.includes('locality')) {
          city = component.long_name;
        }
        
        // Province (administrative_area_level_1 in Indonesia)
        if (types.includes('administrative_area_level_1')) {
          province = component.long_name;
        }
      }
    } catch (error) {
      console.error("Error processing address components:", error);
    }
    
    // Fill address textarea with formatted address
    if (addressInput) {
      addressInput.value = formattedAddress;
    }
    
    // Fill postal code
    if (postalCodeInput && postalCode) {
      postalCodeInput.value = postalCode;
    }
    
    // Fill in province, regency, district, and village inputs
    if (provinceInput && province) {
      provinceInput.value = province;
    }
    
    if (regencyInput && city) {
      regencyInput.value = city;
    }
    
    if (districtInput && district) {
      districtInput.value = district;
    }
    
    if (villageInput) {
      villageInput.value = villageName || 'N/A';
    }
    
    // Update location status in the business card
    updateLocationStatus(place);
  }
  
  // Helper function to select option by text (no longer used for input fields)
  function selectOptionByText(selectElement, text) {
    try {
      if (!selectElement || !selectElement.options || typeof selectElement.options.length !== 'number') {
        return false;
      }
      
      for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text.includes(text) || text.includes(selectElement.options[i].text)) {
          selectElement.selectedIndex = i;
          return true;
        }
      }
    } catch (error) {
      console.error("Error in selectOptionByText:", error);
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
function updateLocationStatus(place) {
  const locationStatus = document.getElementById('status-location');
  if (!locationStatus) return;
  
  const lat = document.getElementById('lat-input')?.value;
  const lng = document.getElementById('lng-input')?.value;
  
  let locationText = 'Koordinat dipilih';
  
  try {
    if (place && place.formatted_address) {
      // Get a shortened version of the address for display
      const shortAddress = place.formatted_address.split(',').slice(0, 2).join(',');
      locationText = shortAddress;
      
      // Add coordinates if available
      if (lat && lng) {
        locationText += ` (${lat}° S, ${lng}° E)`;
      }
    } else if (lat && lng) {
      locationText = `Koordinat: ${lat}° S, ${lng}° E`;
    }
  } catch (error) {
    console.error("Error updating location status:", error);
    // Fall back to coordinates only
    if (lat && lng) {
      locationText = `Koordinat: ${lat}° S, ${lng}° E`;
    }
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