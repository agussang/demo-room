/**
 * Dashboard data display functionality using IndexedDB
 */

/**
 * Load and display hotel list in the dashboard
 * @param {string} containerId - ID of the container element
 * @returns {Promise<void>}
 */
async function loadHotelList(containerId = 'hotel-list') {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container element with ID "${containerId}" not found`);
      return;
    }
    
    // Clear container
    container.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    
    // Get hotels from IndexedDB
    const hotels = await getAllFromStore('hotels');
    
    // Sort by timestamp (newest first)
    hotels.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Clear loading spinner
    container.innerHTML = '';
    
    if (hotels.length === 0) {
      container.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i> Belum ada data hotel tersimpan.
        </div>
      `;
      return;
    }
    
    // Create hotel cards
    hotels.forEach(hotel => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4 mb-4';
      
      // Get star rating display
      let starsDisplay = '';
      if (hotel.classification) {
        if (hotel.classification === 'non-bintang') {
          starsDisplay = '<span class="badge bg-secondary">Non Bintang</span>';
        } else if (hotel.classification.includes('bintang')) {
          const starCount = parseInt(hotel.classification.split('-')[1], 10);
          starsDisplay = '<div class="hotel-stars">';
          for (let i = 0; i < starCount; i++) {
            starsDisplay += '<i class="fas fa-star"></i>';
          }
          starsDisplay += '</div>';
        }
      }
      
      // Format date
      const formattedDate = new Date(hotel.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      card.innerHTML = `
        <div class="card hotel-card h-100">
          <div class="card-status-bar ${hotel.classification || 'default'}"></div>
          <div class="card-body">
            <h5 class="card-title">${hotel.hotelName || 'Unnamed Hotel'}</h5>
            <div class="card-rating mb-2">
              ${starsDisplay}
            </div>
            <p class="card-text text-muted mb-2">
              <i class="fas fa-map-marker-alt me-2"></i> 
              ${hotel.address || (hotel.province ? hotel.regency + ', ' + hotel.province : 'Lokasi tidak tersedia')}
            </p>
            <p class="card-text small text-muted">
              <i class="fas fa-clock me-1"></i> Ditambahkan pada ${formattedDate}
            </p>
            <div class="card-actions mt-3">
              <a href="hotel-dashboard.html?id=${hotel.id}" class="btn btn-sm btn-primary">
                <i class="fas fa-eye me-1"></i> Lihat Detail
              </a>
              <a href="../room/?hotel=${hotel.id}" class="btn btn-sm btn-outline-primary">
                <i class="fas fa-door-open me-1"></i> Kelola Kamar
              </a>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading hotel list:', error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i> Gagal memuat data hotel: ${error.message}
        </div>
      `;
    }
  }
}

/**
 * Load and display venue list in the dashboard
 * @param {string} containerId - ID of the container element
 * @returns {Promise<void>}
 */
async function loadVenueList(containerId = 'venue-list') {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container element with ID "${containerId}" not found`);
      return;
    }
    
    // Clear container
    container.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    
    // Get venues from IndexedDB
    const venues = await getAllFromStore('venues');
    
    // Sort by timestamp (newest first)
    venues.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Clear loading spinner
    container.innerHTML = '';
    
    if (venues.length === 0) {
      container.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i> Belum ada data venue tersimpan.
        </div>
      `;
      return;
    }
    
    // Create venue cards
    venues.forEach(venue => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4 mb-4';
      
      // Format date
      const formattedDate = new Date(venue.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      // Get venue type display
      let venueTypeDisplay = venue.venueType || 'General Venue';
      
      // Format capacity
      let capacityDisplay = '';
      if (venue.maxCapacity) {
        capacityDisplay = `<span class="venue-capacity"><i class="fas fa-users me-1"></i> ${venue.maxCapacity} orang</span>`;
      }
      
      card.innerHTML = `
        <div class="card venue-card h-100">
          <div class="card-status-bar ${venue.venueType ? venue.venueType.toLowerCase() : 'default'}"></div>
          <div class="card-body">
            <h5 class="card-title">${venue.venueName || 'Unnamed Venue'}</h5>
            <div class="venue-type mb-2">
              <span class="badge bg-primary">${venueTypeDisplay}</span>
              ${capacityDisplay}
            </div>
            <p class="card-text text-muted mb-2">
              <i class="fas fa-map-marker-alt me-2"></i> 
              ${venue.address || (venue.province ? venue.regency + ', ' + venue.province : 'Lokasi tidak tersedia')}
            </p>
            <p class="card-text small text-muted">
              <i class="fas fa-clock me-1"></i> Ditambahkan pada ${formattedDate}
            </p>
            <div class="card-actions mt-3">
              <a href="venue-dashboard.html?id=${venue.id}" class="btn btn-sm btn-primary">
                <i class="fas fa-eye me-1"></i> Lihat Detail
              </a>
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading venue list:', error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i> Gagal memuat data venue: ${error.message}
        </div>
      `;
    }
  }
}

/**
 * Load and display hotel detail
 * @param {string} hotelId - ID of the hotel to display
 * @param {Object} selectors - DOM selectors for elements to update
 * @returns {Promise<void>}
 */
async function loadHotelDetail(hotelId, selectors = {}) {
  try {
    if (!hotelId) {
      throw new Error('Hotel ID is required');
    }
    
    // Default selectors
    const defaultSelectors = {
      hotelName: 'hotel-name',
      hotelAddress: 'hotel-address',
      hotelClassification: 'hotel-classification',
      hotelPhotos: 'hotel-photos',
      hotelFacilities: 'hotel-facilities',
      nibStatus: 'nib-status',
      chseStatus: 'chse-status',
      detailContainer: 'hotel-detail-container'
    };
    
    // Merge with provided selectors
    const finalSelectors = { ...defaultSelectors, ...selectors };
    
    // Show loading in detail container
    const detailContainer = document.getElementById(finalSelectors.detailContainer);
    if (detailContainer) {
      detailContainer.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    }
    
    // Get hotel from IndexedDB
    const hotel = await getItemById('hotels', hotelId);
    
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    
    // Update hotel name
    const nameElement = document.getElementById(finalSelectors.hotelName);
    if (nameElement) {
      nameElement.textContent = hotel.hotelName || 'Unnamed Hotel';
    }
    
    // Update hotel address
    const addressElement = document.getElementById(finalSelectors.hotelAddress);
    if (addressElement) {
      addressElement.textContent = hotel.address || 
        (hotel.province ? `${hotel.regency}, ${hotel.province}` : 'Lokasi tidak tersedia');
    }
    
    // Update hotel classification
    const classificationElement = document.getElementById(finalSelectors.hotelClassification);
    if (classificationElement) {
      let classificationText = 'Tidak tersedia';
      
      if (hotel.classification) {
        if (hotel.classification === 'non-bintang') {
          classificationText = 'Non Bintang';
        } else if (hotel.classification.includes('bintang')) {
          const starCount = parseInt(hotel.classification.split('-')[1], 10);
          classificationText = '';
          for (let i = 0; i < starCount; i++) {
            classificationText += '⭐ ';
          }
        }
      }
      
      classificationElement.textContent = classificationText;
    }
    
    // Update NIB status
    const nibElement = document.getElementById(finalSelectors.nibStatus);
    if (nibElement) {
      if (hotel.nib) {
        nibElement.innerHTML = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Terverifikasi</span>';
      } else {
        nibElement.innerHTML = '<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-circle me-1"></i> Belum Terverifikasi</span>';
      }
    }
    
    // Update CHSE status
    const chseElement = document.getElementById(finalSelectors.chseStatus);
    if (chseElement) {
      if (hotel.chse) {
        chseElement.innerHTML = '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i> Terverifikasi</span>';
      } else {
        chseElement.innerHTML = '<span class="badge bg-warning text-dark"><i class="fas fa-exclamation-circle me-1"></i> Belum Terverifikasi</span>';
      }
    }
    
    // Update facilities
    const facilitiesElement = document.getElementById(finalSelectors.hotelFacilities);
    if (facilitiesElement) {
      if (hotel.facilities && hotel.facilities.length > 0) {
        let facilitiesHtml = '<div class="row">';
        
        hotel.facilities.forEach(facility => {
          facilitiesHtml += `
            <div class="col-md-4 mb-2">
              <div class="facility-item">
                <i class="fas fa-check-circle text-success me-2"></i>
                ${facility.name}
              </div>
            </div>
          `;
        });
        
        facilitiesHtml += '</div>';
        facilitiesElement.innerHTML = facilitiesHtml;
      } else {
        facilitiesElement.innerHTML = '<p class="text-muted">Tidak ada fasilitas</p>';
      }
    }
    
    // Load and display photos
    const photosElement = document.getElementById(finalSelectors.hotelPhotos);
    if (photosElement && hotel.fileIds && hotel.fileIds.length > 0) {
      let photosHtml = '<div class="hotel-photos-carousel">';
      
      // Get all file data
      const filePromises = hotel.fileIds.map(fileId => getItemById('uploads', fileId));
      const files = await Promise.all(filePromises);
      
      // Filter out any null results and non-images
      const imageFiles = files.filter(file => file && file.contentType && file.contentType.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        // Create carousel if multiple images
        if (imageFiles.length > 1) {
          const carouselId = 'hotel-photos-carousel-' + hotelId;
          
          photosHtml = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                ${imageFiles.map((_, index) => `
                  <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" 
                    ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                `).join('')}
              </div>
              <div class="carousel-inner">
                ${imageFiles.map((file, index) => `
                  <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${file.data}" class="d-block w-100" alt="${file.filename}">
                  </div>
                `).join('')}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          `;
        } else {
          // Single image
          photosHtml = `<img src="${imageFiles[0].data}" class="img-fluid" alt="${imageFiles[0].filename}">`;
        }
        
        photosElement.innerHTML = photosHtml;
      } else {
        photosElement.innerHTML = '<p class="text-muted">Tidak ada foto</p>';
      }
    } else if (photosElement) {
      photosElement.innerHTML = '<p class="text-muted">Tidak ada foto</p>';
    }
    
    // Clear loading
    if (detailContainer) {
      detailContainer.innerHTML = '';
    }
    
  } catch (error) {
    console.error('Error loading hotel detail:', error);
    const detailContainer = document.getElementById(finalSelectors?.detailContainer);
    if (detailContainer) {
      detailContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i> Gagal memuat detail hotel: ${error.message}
        </div>
      `;
    }
  }
}

/**
 * Load and display venue detail
 * @param {string} venueId - ID of the venue to display
 * @param {Object} selectors - DOM selectors for elements to update
 * @returns {Promise<void>}
 */
async function loadVenueDetail(venueId, selectors = {}) {
  try {
    if (!venueId) {
      throw new Error('Venue ID is required');
    }
    
    // Default selectors
    const defaultSelectors = {
      venueName: 'venue-name',
      venueAddress: 'venue-address',
      venueType: 'venue-type',
      venueCapacity: 'venue-capacity',
      venueArea: 'venue-area',
      venuePhotos: 'venue-photos',
      venueFacilities: 'venue-facilities',
      venueSeating: 'venue-seating',
      detailContainer: 'venue-detail-container'
    };
    
    // Merge with provided selectors
    const finalSelectors = { ...defaultSelectors, ...selectors };
    
    // Show loading in detail container
    const detailContainer = document.getElementById(finalSelectors.detailContainer);
    if (detailContainer) {
      detailContainer.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    }
    
    // Get venue from IndexedDB
    const venue = await getItemById('venues', venueId);
    
    if (!venue) {
      throw new Error('Venue not found');
    }
    
    // Update venue name
    const nameElement = document.getElementById(finalSelectors.venueName);
    if (nameElement) {
      nameElement.textContent = venue.venueName || 'Unnamed Venue';
    }
    
    // Update venue address
    const addressElement = document.getElementById(finalSelectors.venueAddress);
    if (addressElement) {
      addressElement.textContent = venue.address || 
        (venue.province ? `${venue.regency}, ${venue.province}` : 'Lokasi tidak tersedia');
    }
    
    // Update venue type
    const typeElement = document.getElementById(finalSelectors.venueType);
    if (typeElement) {
      typeElement.textContent = venue.venueType || 'Tipe tidak tersedia';
    }
    
    // Update venue capacity
    const capacityElement = document.getElementById(finalSelectors.venueCapacity);
    if (capacityElement) {
      capacityElement.textContent = venue.maxCapacity ? `${venue.maxCapacity} orang` : 'Tidak tersedia';
    }
    
    // Update venue area
    const areaElement = document.getElementById(finalSelectors.venueArea);
    if (areaElement) {
      areaElement.textContent = venue.totalArea ? `${venue.totalArea} m²` : 'Tidak tersedia';
    }
    
    // Update facilities
    const facilitiesElement = document.getElementById(finalSelectors.venueFacilities);
    if (facilitiesElement) {
      if (venue.facilities && venue.facilities.length > 0) {
        let facilitiesHtml = '<div class="row">';
        
        venue.facilities.forEach(facility => {
          facilitiesHtml += `
            <div class="col-md-4 mb-2">
              <div class="facility-item">
                <i class="fas fa-check-circle text-success me-2"></i>
                ${facility.name}
              </div>
            </div>
          `;
        });
        
        facilitiesHtml += '</div>';
        facilitiesElement.innerHTML = facilitiesHtml;
      } else {
        facilitiesElement.innerHTML = '<p class="text-muted">Tidak ada fasilitas</p>';
      }
    }
    
    // Update seating arrangements
    const seatingElement = document.getElementById(finalSelectors.venueSeating);
    if (seatingElement) {
      if (venue.seatingArrangements && venue.seatingArrangements.length > 0) {
        let seatingHtml = '<div class="table-responsive"><table class="table table-striped">';
        seatingHtml += `
          <thead>
            <tr>
              <th>Tipe Layout</th>
              <th>Kapasitas Maksimal</th>
            </tr>
          </thead>
          <tbody>
        `;
        
        venue.seatingArrangements.forEach(seating => {
          seatingHtml += `
            <tr>
              <td>${seating.type}</td>
              <td>${seating.capacity} orang</td>
            </tr>
          `;
        });
        
        seatingHtml += '</tbody></table></div>';
        seatingElement.innerHTML = seatingHtml;
      } else {
        seatingElement.innerHTML = '<p class="text-muted">Tidak ada informasi layout tempat duduk</p>';
      }
    }
    
    // Load and display photos
    const photosElement = document.getElementById(finalSelectors.venuePhotos);
    if (photosElement && venue.fileIds && venue.fileIds.length > 0) {
      let photosHtml = '<div class="venue-photos-carousel">';
      
      // Get all file data
      const filePromises = venue.fileIds.map(fileId => getItemById('uploads', fileId));
      const files = await Promise.all(filePromises);
      
      // Filter out any null results and non-images
      const imageFiles = files.filter(file => file && file.contentType && file.contentType.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        // Create carousel if multiple images
        if (imageFiles.length > 1) {
          const carouselId = 'venue-photos-carousel-' + venueId;
          
          photosHtml = `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                ${imageFiles.map((_, index) => `
                  <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" 
                    ${index === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                `).join('')}
              </div>
              <div class="carousel-inner">
                ${imageFiles.map((file, index) => `
                  <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${file.data}" class="d-block w-100" alt="${file.filename}">
                  </div>
                `).join('')}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          `;
        } else {
          // Single image
          photosHtml = `<img src="${imageFiles[0].data}" class="img-fluid" alt="${imageFiles[0].filename}">`;
        }
        
        photosElement.innerHTML = photosHtml;
      } else {
        photosElement.innerHTML = '<p class="text-muted">Tidak ada foto</p>';
      }
    } else if (photosElement) {
      photosElement.innerHTML = '<p class="text-muted">Tidak ada foto</p>';
    }
    
    // Clear loading
    if (detailContainer) {
      detailContainer.innerHTML = '';
    }
    
  } catch (error) {
    console.error('Error loading venue detail:', error);
    const detailContainer = document.getElementById(finalSelectors?.detailContainer);
    if (detailContainer) {
      detailContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-circle me-2"></i> Gagal memuat detail venue: ${error.message}
        </div>
      `;
    }
  }
}

/**
 * Helper function to get URL parameters
 * @param {string} param - Parameter name to get
 * @returns {string|null} Parameter value
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}