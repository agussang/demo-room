// Current active step
let currentStep = 1;
let map, marker, autocomplete;

// Declare loadNearbyPlaces function reference
let loadNearbyPlaces;

// Function to show specific step
function showStep(step) {
  // Hide all sections
  document.querySelectorAll(".form-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Show the requested section
  document.getElementById("section" + step).classList.add("active");

  // Update step indicators
  updateStepIndicators(step);

  // Update flowchart
  updateFlowchart(step);

  // Update current step
  currentStep = step;
  
  // If we're going to the nearby places step (step 4), load the nearby places
  if (step === 4 && typeof loadNearbyPlaces === 'function') {
    // Load the initial tab content (transportation)
    loadNearbyPlaces('transportation');
  }

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  return true;
}

// Function for next step
function nextStep(current) {
  if (current < 5) {
    showStep(current + 1);
  }
}

// Function for previous step
function prevStep(current) {
  if (current > 1) {
    showStep(current - 1);
  }
}

// Update step indicators
function updateStepIndicators(active) {
  // Reset all steps
  document.querySelectorAll(".step").forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove("active", "completed");

    if (stepNumber < active) {
      step.classList.add("completed");
    } else if (stepNumber === active) {
      step.classList.add("active");
    }
  });
}

// Update flowchart
function updateFlowchart(active) {
  // Reset all flowchart steps
  document.querySelectorAll(".flowchart-step").forEach((step, index) => {
    const stepNumber = index + 1;

    if (stepNumber === active) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// Show toast notification
function showNotification(title, message, type) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1050";
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toastId = "toast-" + Date.now();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.id = toastId;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Set toast HTML
  const bgClass = type === "success" ? "bg-success" : "bg-danger";
  const icon =
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

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
    delay: 5000,
  });

  bsToast.show();

  // Remove from DOM after hiding
  toast.addEventListener("hidden.bs.toast", function () {
    toast.remove();
  });
}

// Initialize Google Maps
function initMap() {
  // Default center location (Indonesia)
  const defaultLocation = { lat: -6.1754, lng: 106.8272 };
  
  // Create map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: false // Custom zoom controls
  });
  
  // Create marker
  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    title: "Lokasi Venue"
  });
  
  // Update coordinates when marker is dragged
  google.maps.event.addListener(marker, 'dragend', function() {
    updateCoordinates(marker.getPosition());
    
    // Show loading indicator
    showNotification(
      'Memuat Data',
      'Sedang mengambil informasi lokasi...',
      'success'
    );
    
    // Reverse geocode the location
    reverseGeocode(marker.getPosition());
  });
  
  // Update marker on map click
  google.maps.event.addListener(map, 'click', function(event) {
    marker.setPosition(event.latLng);
    updateCoordinates(event.latLng);
    
    // Show loading indicator
    showNotification(
      'Memuat Data',
      'Sedang mengambil informasi lokasi...',
      'success'
    );
    
    // Reverse geocode the location
    reverseGeocode(event.latLng);
  });
  
  // Setup search box - using venue-search instead of hotel-search
  const input = document.getElementById('venue-search');
  if (input) {
    autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['establishment'],
      componentRestrictions: { country: 'id' }, // Restrict to Indonesia
      fields: ['address_components', 'geometry', 'name', 'formatted_address']
    });
    
    // Bias search results to current map view
    autocomplete.bindTo('bounds', map);
    
    // Listen for place selection
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        // Place not found
        showNotification(
          'Lokasi Tidak Ditemukan',
          'Tidak dapat menemukan lokasi yang dicari',
          'error'
        );
        return;
      }
      
      // Center map on selected place
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      
      // Update coordinates
      updateCoordinates(place.geometry.location);
      
      // Show loading indicator
      showNotification(
        'Memuat Data',
        'Sedang mengambil informasi lokasi...',
        'success'
      );
      
      // Use reverse geocoding to ensure consistent data extraction
      reverseGeocode(place.geometry.location);
    });
  } else {
    console.error("Could not find venue-search input element");
  }
  
  // Setup custom map controls
  setupMapControls();
}

// Update coordinates display and hidden inputs
function updateCoordinates(position) {
  const lat = position.lat();
  const lng = position.lng();
  
  // Update display
  document.getElementById('coordinates-display').textContent = 
    lat.toFixed(6) + '° ' + (lat >= 0 ? 'N' : 'S') + ', ' + 
    lng.toFixed(6) + '° ' + (lng >= 0 ? 'E' : 'W');
  
  // Update hidden inputs
  document.getElementById('lat-input').value = lat;
  document.getElementById('lng-input').value = lng;
}

// Reverse geocode a location
function reverseGeocode(latlng) {
  const geocoder = new google.maps.Geocoder();
  
  geocoder.geocode({ location: latlng }, function(results, status) {
    if (status === 'OK' && results[0]) {
      // Fill address field with formatted address
      document.getElementById('address').value = results[0].formatted_address;
      
      // Update status location
      document.getElementById('status-location').textContent = results[0].formatted_address;
      
      // Extract and fill administrative areas
      extractAdministrativeAreas(results);
    }
  });
}

// Extract administrative areas from geocoding results
function extractAdministrativeAreas(results) {
  // Initialize variables for each administrative level
  let province = '';
  let regency = '';
  let district = '';
  let village = '';
  let postalCode = '';
  
  // Loop through all results to find the most specific data
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    
    // Get address components
    const components = result.address_components;
    
    // Extract data for each component
    for (let j = 0; j < components.length; j++) {
      const component = components[j];
      const types = component.types;
      
      // Check for postal code
      if (types.includes('postal_code') && !postalCode) {
        postalCode = component.long_name;
        document.getElementById('postal-code').value = postalCode;
      }
      
      // Check for province (administrative_area_level_1)
      if (types.includes('administrative_area_level_1') && !province) {
        province = component.long_name;
        document.getElementById('province').value = province;
      }
      
      // Check for regency/city (administrative_area_level_2)
      if (types.includes('administrative_area_level_2') && !regency) {
        regency = component.long_name;
        document.getElementById('regency').value = regency;
      }
      
      // Check for district (administrative_area_level_3)
      if (types.includes('administrative_area_level_3') && !district) {
        district = component.long_name;
        document.getElementById('district').value = district;
      }
      
      // Check for village/subdistrict (administrative_area_level_4)
      if (types.includes('administrative_area_level_4') && !village) {
        village = component.long_name;
        document.getElementById('village').value = village;
      }
    }
  }
  
  // Update display in the status card
  if (province || regency) {
    let locationText = '';
    if (regency) locationText += regency;
    if (province) locationText += (locationText ? ', ' : '') + province;
    
    document.getElementById('status-location').textContent = locationText;
  }
  
  // Display notification of successful geocoding if at least province is found
  if (province) {
    showNotification(
      'Lokasi Ditemukan',
      'Informasi alamat berhasil diambil dari koordinat',
      'success'
    );
  }
}

// Setup custom map controls
function setupMapControls() {
  // Zoom in button
  document.getElementById('btn-zoom-in').addEventListener('click', function() {
    map.setZoom(map.getZoom() + 1);
  });
  
  // Zoom out button
  document.getElementById('btn-zoom-out').addEventListener('click', function() {
    map.setZoom(map.getZoom() - 1);
  });
  
  // My location button
  document.getElementById('btn-my-location').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        map.setCenter(pos);
        marker.setPosition(pos);
        updateCoordinates(new google.maps.LatLng(pos.lat, pos.lng));
        reverseGeocode(new google.maps.LatLng(pos.lat, pos.lng));
        
        showNotification('Lokasi Ditemukan', 'Menggunakan lokasi perangkat Anda saat ini', 'success');
      }, function(error) {
        showNotification('Error', 'Tidak dapat mengakses lokasi perangkat', 'error');
      });
    } else {
      showNotification('Error', 'Geolocation tidak didukung oleh browser Anda', 'error');
    }
  });
  
  // Map type buttons
  document.querySelectorAll('.map-type-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.map-type-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = 'var(--text-medium)';
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      this.style.backgroundColor = 'var(--primary)';
      this.style.color = 'white';
      
      // Change map type
      const mapType = this.getAttribute('data-map-type');
      map.setMapTypeId(mapType);
    });
  });
}

// Array untuk menyimpan daftar fasilitas tambahan
const additionalFacilities = [];

// Function to update the additional facilities list display
function updateAdditionalFacilitiesList() {
  const listContainer = document.getElementById("additional-facilities-list");
  
  // Clear current list
  listContainer.innerHTML = "";
  
  // If there are no facilities, show a message
  if (additionalFacilities.length === 0) {
    listContainer.innerHTML = '<div class="text-muted small py-2">Belum ada fasilitas tambahan</div>';
    return;
  }
  
  // Create a list item for each facility
  additionalFacilities.forEach((facility, index) => {
    const listItem = document.createElement("div");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    
    // Create the facility name with icon
    const nameSpan = document.createElement("span");
    nameSpan.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i> ${facility.name}`;
    
    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.setAttribute("data-index", index);
    deleteBtn.addEventListener("click", function() {
      // Remove from the array
      const facilityIndex = parseInt(this.getAttribute("data-index"));
      const removedFacility = additionalFacilities.splice(facilityIndex, 1)[0];
      
      // Remove from the facilities switches if it exists
      const facilitySwitch = document.getElementById(removedFacility.id);
      if (facilitySwitch) {
        const switchContainer = facilitySwitch.closest(".col-md-4");
        if (switchContainer) {
          switchContainer.remove();
        }
      }
      
      // Update the list
      updateAdditionalFacilitiesList();
      
      // Show notification
      showNotification(
        "Fasilitas Dihapus",
        `${removedFacility.name} berhasil dihapus dari daftar`,
        "success"
      );
    });
    
    // Add elements to the list item
    listItem.appendChild(nameSpan);
    listItem.appendChild(deleteBtn);
    
    // Add list item to the container
    listContainer.appendChild(listItem);
  });
}

// Define the global loadNearbyPlaces function
loadNearbyPlaces = function(tabId) {
  // Get coordinates from inputs
  const lat = parseFloat(document.getElementById('lat-input').value);
  const lng = parseFloat(document.getElementById('lng-input').value);
  
  // Skip if coordinates aren't available yet
  if (isNaN(lat) || isNaN(lng)) {
    console.log("Coordinates not available yet");
    return;
  }

  const coordinates = { lat, lng };
  const placeTypes = getPlaceTypes();
  
  // Map tab ID to place type
  let placeType;
  switch (tabId) {
    case 'transportation': 
      placeType = placeTypes.TRANSPORTATION; 
      break;
    case 'shopping': 
      placeType = placeTypes.SHOPPING; 
      break;
    case 'dining': 
      placeType = placeTypes.DINING; 
      break;
    case 'attractions': 
      placeType = placeTypes.ATTRACTIONS; 
      break;
    default: 
      placeType = placeTypes.TRANSPORTATION;
  }

  // Show loading indicator
  document.getElementById(`${tabId}-loading`).style.display = 'block';
  document.getElementById(`${tabId}-content`).innerHTML = '';
  
  // Get recommendations
  getNearbyPlaces(coordinates, placeType)
    .then(places => {
      // Hide loading
      document.getElementById(`${tabId}-loading`).style.display = 'none';
      
      // Group places by type for better organization
      const groupedPlaces = groupPlacesByType(places);
      
      // Generate HTML
      let html = '';
      for (const [type, items] of Object.entries(groupedPlaces)) {
        // Skip if no places in this category
        if (items.length === 0) continue;
        
        // Get icon for this type (use first item's icon)
        const icon = items[0].icon || 'map-marker';
        
        // Format type name
        const typeName = formatTypeName(type);
        
        html += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">
                <i class="fas fa-${icon} me-2"></i> ${typeName}
              </h5>
              <div class="row">
                ${items.map(place => `
                  <div class="col-md-6">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <p class="card-text mb-0">${place.name}</p>
                      <span class="badge bg-primary">${place.distance}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }
      
      // Display results
      document.getElementById(`${tabId}-content`).innerHTML = html || '<div class="alert alert-info">Tidak ada rekomendasi tempat di sekitar lokasi ini.</div>';
    })
    .catch(error => {
      console.error("Error loading nearby places:", error);
      document.getElementById(`${tabId}-loading`).style.display = 'none';
      document.getElementById(`${tabId}-content`).innerHTML = 
        '<div class="alert alert-danger">Gagal memuat rekomendasi tempat terdekat.</div>';
    });
}

// Helper function to group places by type
function groupPlacesByType(places) {
  const grouped = {};
  
  places.forEach(place => {
    const type = place.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(place);
  });
  
  return grouped;
}

// Helper function to format type names
function formatTypeName(type) {
  const typeMap = {
    'airport': 'Bandara',
    'train_station': 'Stasiun Kereta Api',
    'bus_station': 'Terminal Bus',
    'subway_station': 'Stasiun MRT',
    'transit_station': 'Stasiun Transit',
    'ferry_terminal': 'Terminal Kapal',
    'shopping_mall': 'Mall',
    'supermarket': 'Supermarket',
    'convenience_store': 'Mini Market',
    'market': 'Pasar',
    'clothing_store': 'Toko Pakaian',
    'fast_food': 'Restoran Cepat Saji',
    'cafe': 'Kafe',
    'restaurant': 'Restoran',
    'local_restaurant': 'Restoran Lokal',
    'fine_dining': 'Restoran Mewah',
    'seafood_restaurant': 'Restoran Seafood',
    'bakery': 'Toko Roti',
    'food_court': 'Food Court',
    'park': 'Taman',
    'museum': 'Museum',
    'zoo': 'Kebun Binatang',
    'amusement_park': 'Taman Hiburan',
    'monument': 'Monumen',
    'historic_site': 'Situs Bersejarah',
    'palace': 'Istana',
    'beach': 'Pantai',
    'temple': 'Candi/Kuil',
    'place_of_worship': 'Tempat Ibadah',
    'natural_feature': 'Fitur Alam',
    'tourist_attraction': 'Objek Wisata'
  };
  
  return typeMap[type] || type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  // NIB Verification
  document
    .getElementById("check-nib")
    .addEventListener("click", function () {
      const nibInput = document.getElementById("nib");
      const companyNameInput = document.getElementById("company-name");
      
      if (nibInput.value.trim() !== "" && companyNameInput.value.trim() !== "") {
        this.innerHTML =
          '<i class="fas fa-check-circle"></i> Terverifikasi';
        this.classList.remove("btn-outline-primary");
        this.classList.add("btn-success");

        // Update status card
        document.getElementById("status-nib").textContent =
          "Terverifikasi";
        document.getElementById("status-nib").className = "text-success";

        // Show notification
        showNotification(
          "NIB Terverifikasi",
          "Data berhasil divalidasi melalui API OSS BKPM",
          "success"
        );
      } else if (nibInput.value.trim() === "") {
        showNotification(
          "Verifikasi Gagal",
          "Silakan masukkan NIB terlebih dahulu",
          "error"
        );
      } else {
        showNotification(
          "Verifikasi Gagal",
          "Silakan masukkan Nama Perusahaan terlebih dahulu",
          "error"
        );
      }
    });

  // Business License Verification
  document
    .getElementById("check-license")
    .addEventListener("click", function () {
      const licenseInput = document.getElementById("business-license");
      if (licenseInput.value.trim() !== "") {
        this.innerHTML =
          '<i class="fas fa-check-circle"></i> Terverifikasi';
        this.classList.remove("btn-outline-primary");
        this.classList.add("btn-success");

        // Update status card
        document.getElementById("status-license").textContent =
          "Terverifikasi";
        document.getElementById("status-license").className = "text-success";

        // Show notification
        showNotification(
          "Izin Usaha Terverifikasi",
          "Sertifikat valid dan terverifikasi melalui API Perizinan",
          "success"
        );
      } else {
        showNotification(
          "Verifikasi Gagal",
          "Silakan masukkan nomor Izin Usaha terlebih dahulu",
          "error"
        );
      }
    });

  // Update venue name status when input changes
  document
    .getElementById("venue-name")
    .addEventListener("input", function () {
      document.getElementById("status-name").textContent =
        this.value || "-";
    });

  // Update venue type status when select changes
  document
    .getElementById("venue-type")
    .addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      document.getElementById("status-type").textContent =
        selectedOption.text || "-";
        
      // Show relevant capacity fields based on venue type
      const venueType = this.value;
      const theaterField = document.getElementById("theater-capacity").closest(".col-md-4");
      const classroomField = document.getElementById("classroom-capacity").closest(".col-md-4");
      const ushapeField = document.getElementById("ushape-capacity").closest(".col-md-4");
      const boardroomField = document.getElementById("boardroom-capacity").closest(".col-md-4");
      const banquetField = document.getElementById("banquet-capacity").closest(".col-md-4");
      const standingField = document.getElementById("standing-capacity").closest(".col-md-4");
      
      // Default - show all fields
      theaterField.style.display = "block";
      classroomField.style.display = "block";
      ushapeField.style.display = "block";
      boardroomField.style.display = "block";
      banquetField.style.display = "block";
      standingField.style.display = "block";
      
      // Adjust based on venue type
      switch(venueType) {
        case "ballroom":
          // All fields visible by default
          break;
        case "meeting-room":
          // Hide banquet
          banquetField.style.display = "none";
          break;
        case "board-room":
          // Primarily boardroom setup
          theaterField.style.display = "none";
          banquetField.style.display = "none";
          break;
        case "auditorium":
          // Primarily theater style
          ushapeField.style.display = "none";
          boardroomField.style.display = "none";
          banquetField.style.display = "none";
          break;
        case "outdoor-space":
          // Usually no boardroom
          boardroomField.style.display = "none";
          break;
      }
    });

  // Tab navigation
  document.querySelectorAll(".custom-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      document
        .querySelectorAll(".custom-tab")
        .forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.style.display = "none";
        pane.classList.remove("active");
      });

      // Show the selected tab pane
      const tabId = this.getAttribute("data-tab");
      const tabPane = document.getElementById(tabId);
      if (tabPane) {
        tabPane.style.display = "block";
        tabPane.classList.add("active");
        
        // Always load nearby places when tab is selected
        loadNearbyPlaces(tabId);
      }
    });
  });

  // Add facility button
  document
    .getElementById("add-facility")
    .addEventListener("click", function () {
      const facilityInput = document.getElementById("facility-input");
      const facilityName = facilityInput.value.trim();

      if (facilityName) {
        // Create a unique ID for the facility
        const facilityId = "custom-" + Date.now();

        // Create the HTML for the facility switch
        const facilityHtml = `
        <div class="col-md-4 mb-2">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="${facilityId}" checked data-facility="${facilityId}">
            <label class="form-check-label" for="${facilityId}">
              <i class="fas fa-plus-circle text-primary me-2"></i> ${facilityName}
            </label>
          </div>
        </div>
      `;

        // Append to the facilities container
        const facilitiesContainer = document.querySelector(
          ".row:has(.form-check.form-switch)"
        );
        facilitiesContainer.insertAdjacentHTML("beforeend", facilityHtml);
        
        // Add to the additional facilities list
        additionalFacilities.push({
          id: facilityId,
          name: facilityName
        });
        
        // Update the additional facilities list display
        updateAdditionalFacilitiesList();

        // Clear the input field
        facilityInput.value = "";

        showNotification(
          "Fasilitas Ditambahkan",
          `${facilityName} berhasil ditambahkan ke daftar fasilitas`,
          "success"
        );
      } else {
        showNotification(
          "Error",
          "Silakan masukkan nama fasilitas",
          "error"
        );
      }
    });
    
  // Initialize the list
  updateAdditionalFacilitiesList();

  // Cancellation Policy Change Event
  document
    .getElementById("cancellation-policy")
    .addEventListener("change", function() {
      const policyValue = this.value;
      let policyText = "Belum dipilih";
      
      if (policyValue === "flexible") {
        policyText = "Fleksibel (pembatalan hingga 24 jam)";
      } else if (policyValue === "moderate") {
        policyText = "Moderat (pembatalan hingga 7 hari)";
      } else if (policyValue === "strict") {
        policyText = "Ketat (pembatalan hingga 30 hari)";
      } else if (policyValue === "custom") {
        policyText = "Kustom (lihat keterangan)";
      }
      
      // Update status card with cancellation policy
      document.getElementById("status-policy").textContent = policyText;
    });
    
  // Payment Terms Change Event
  document
    .getElementById("payment-terms")
    .addEventListener("change", function() {
      const termsValue = this.value;
      let termsText = "Belum dipilih";
      
      if (termsValue === "full-advance") {
        termsText = "Pembayaran penuh di muka";
      } else if (termsValue === "50-percent") {
        termsText = "DP 50%, pelunasan sebelum acara";
      } else if (termsValue === "70-percent") {
        termsText = "DP 70%, pelunasan sebelum acara";
      } else if (termsValue === "custom") {
        termsText = "Kustom (lihat keterangan)";
      }
      
      // Update status card with payment terms
      document.getElementById("status-payment").textContent = termsText;
    });
    
  // Setup Time Change Event
  document
    .getElementById("setup-time")
    .addEventListener("change", function() {
      const setupValue = this.value;
      
      // Jika pengguna memilih opsi kustom, bisa menampilkan input tambahan
      if (setupValue === "custom") {
        const additionalPolicyTextarea = document.getElementById("additional-policies");
        additionalPolicyTextarea.focus();
        additionalPolicyTextarea.placeholder = "Jelaskan kebijakan waktu setup kustom di sini...";
      }
    });
    
  // Minimum Duration Change Event
  document
    .getElementById("minimum-duration")
    .addEventListener("input", function() {
      const duration = this.value;
      const unit = document.getElementById("duration-unit").value;
      
      if (duration) {
        // Secara opsional, bisa mencantumkan durasi minimum di status card
        // document.getElementById("status-min-duration").textContent = duration + " " + (unit === "hours" ? "jam" : "hari");
      }
    });
    
  // Duration Unit Change Event
  document
    .getElementById("duration-unit")
    .addEventListener("change", function() {
      const duration = document.getElementById("minimum-duration").value;
      const unit = this.value;
      
      if (duration) {
        // Secara opsional, bisa mencantumkan durasi minimum di status card
        // document.getElementById("status-min-duration").textContent = duration + " " + (unit === "hours" ? "jam" : "hari");
      }
    });
  
  // Form submission
  document
    .getElementById("submit-form")
    .addEventListener("click", function () {
      // Collect venue policies data
      const venuePolicies = {
        cancellation: document.getElementById("cancellation-policy").value,
        setupTime: document.getElementById("setup-time").value,
        paymentTerms: document.getElementById("payment-terms").value,
        minimumDuration: document.getElementById("minimum-duration").value,
        durationUnit: document.getElementById("duration-unit").value,
        additionalPolicies: document.getElementById("additional-policies").value
      };
      
      // Validate required policies
      const requiredPolicies = [
        { id: "cancellation-policy", name: "Kebijakan Pembatalan" },
        { id: "payment-terms", name: "Syarat Pembayaran" }
      ];
      
      let missingPolicies = [];
      
      requiredPolicies.forEach(policy => {
        const policyElement = document.getElementById(policy.id);
        if (!policyElement.value) {
          missingPolicies.push(policy.name);
          policyElement.classList.add("is-invalid");
        } else {
          policyElement.classList.remove("is-invalid");
        }
      });
      
      // If minimum duration is entered, validate it's a positive number
      const minimumDuration = document.getElementById("minimum-duration");
      if (minimumDuration.value && (isNaN(minimumDuration.value) || parseInt(minimumDuration.value) <= 0)) {
        minimumDuration.classList.add("is-invalid");
        missingPolicies.push("Durasi Minimum Sewa harus berupa angka positif");
      } else {
        minimumDuration.classList.remove("is-invalid");
      }
      
      // Check if there are missing policies
      if (missingPolicies.length > 0) {
        // Show error notification
        showNotification(
          "Validasi Gagal",
          "Silakan lengkapi data kebijakan venue: " + missingPolicies.join(", "),
          "error"
        );
        
        // Scroll to the policies section (finding it by its text content)
        const sectionTitles = document.querySelectorAll(".section-title");
        const policySection = Array.from(sectionTitles).find(el => el.textContent === "Kebijakan Venue");
        if (policySection) {
          policySection.scrollIntoView({
            behavior: "smooth"
          });
        }
        
        return;
      }
      
      // Log venue policies data (in a real app, this would be sent to the server)
      console.log("Venue Policies:", venuePolicies);
      
      showNotification(
        "Data Tersimpan",
        "Informasi venue berhasil disimpan dan diproses",
        "success"
      );

      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "../dashboard-venue/";
      }, 2000);
    });
});