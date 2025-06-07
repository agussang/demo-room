/**
 * Form submission handler that saves data to IndexedDB
 */

/**
 * Collect all form data from hotel form
 * @returns {Object} Form data object
 */
function collectHotelFormData() {
  const formData = {
    // General information
    nib: document.getElementById('nib')?.value || '',
    companyName: document.getElementById('company-name')?.value || '',
    chse: document.getElementById('chse')?.value || '',
    hotelName: document.getElementById('hotel-name')?.value || '',
    sta: document.getElementById('sta')?.value || '',
    classification: document.getElementById('classification')?.value || '',
    
    // Location information
    address: document.getElementById('address')?.value || '',
    province: document.getElementById('province')?.value || '',
    regency: document.getElementById('regency')?.value || '',
    district: document.getElementById('district')?.value || '',
    village: document.getElementById('village')?.value || '',
    postalCode: document.getElementById('postal-code')?.value || '',
    latitude: document.getElementById('lat-input')?.value || '',
    longitude: document.getElementById('lng-input')?.value || '',
    
    // Contact information
    contactName: document.getElementById('contact-name')?.value || '',
    contactPosition: document.getElementById('contact-position')?.value || '',
    contactEmail: document.getElementById('contact-email')?.value || '',
    contactPhone: document.getElementById('contact-phone')?.value || '',
    website: document.getElementById('website')?.value || '',
    
    // Facilities
    facilities: collectFacilities(),
    
    // Nearby places are loaded dynamically and don't need to be saved
    
    // File uploads (saved separately, just store IDs here)
    fileIds: window.uploadHandler ? window.uploadHandler.getUploadedFileIds() : [],
    
    // Add timestamp
    timestamp: new Date().toISOString()
  };
  
  return formData;
}

/**
 * Collect venue form data
 * @returns {Object} Form data object
 */
function collectVenueFormData() {
  const formData = {
    // General information
    venueName: document.getElementById('venue-name')?.value || '',
    venueType: document.getElementById('venue-type')?.value || '',
    hotelId: document.getElementById('hotel-id')?.value || '', // If venue is part of a hotel
    
    // Location information
    address: document.getElementById('address')?.value || '',
    province: document.getElementById('province')?.value || '',
    regency: document.getElementById('regency')?.value || '',
    district: document.getElementById('district')?.value || '',
    village: document.getElementById('village')?.value || '',
    postalCode: document.getElementById('postal-code')?.value || '',
    latitude: document.getElementById('lat-input')?.value || '',
    longitude: document.getElementById('lng-input')?.value || '',
    
    // Venue details
    totalArea: document.getElementById('total-area')?.value || '',
    floorLevel: document.getElementById('floor-level')?.value || '',
    ceilingHeight: document.getElementById('ceiling-height')?.value || '',
    maxCapacity: document.getElementById('max-capacity')?.value || '',
    
    // Seating arrangements
    seatingArrangements: collectSeatingArrangements(),
    
    // Facilities
    facilities: collectFacilities(),
    
    // Contact information
    contactName: document.getElementById('contact-name')?.value || '',
    contactPosition: document.getElementById('contact-position')?.value || '',
    contactEmail: document.getElementById('contact-email')?.value || '',
    contactPhone: document.getElementById('contact-phone')?.value || '',
    
    // File uploads (saved separately, just store IDs here)
    fileIds: window.uploadHandler ? window.uploadHandler.getUploadedFileIds() : [],
    
    // Add timestamp
    timestamp: new Date().toISOString()
  };
  
  return formData;
}

/**
 * Collect selected facilities from checkboxes
 * @returns {Array} Array of selected facility names
 */
function collectFacilities() {
  const facilities = [];
  
  // Get all checked facility checkboxes
  const facilityCheckboxes = document.querySelectorAll('input[type="checkbox"][data-facility]:checked');
  
  facilityCheckboxes.forEach(checkbox => {
    const label = checkbox.nextElementSibling.textContent.trim();
    facilities.push({
      id: checkbox.getAttribute('data-facility'),
      name: label
    });
  });
  
  // Include additional facilities if available
  if (typeof additionalFacilities !== 'undefined' && Array.isArray(additionalFacilities)) {
    additionalFacilities.forEach(facility => {
      facilities.push({
        id: facility.id,
        name: facility.name
      });
    });
  }
  
  return facilities;
}

/**
 * Collect seating arrangements from venue form
 * @returns {Array} Array of seating arrangements
 */
function collectSeatingArrangements() {
  const arrangements = [];
  
  // Get all seating arrangement inputs
  const seatingRows = document.querySelectorAll('.seating-row');
  
  seatingRows.forEach(row => {
    const typeInput = row.querySelector('[data-seating-type]');
    const capacityInput = row.querySelector('[data-seating-capacity]');
    
    if (typeInput && capacityInput && typeInput.value && capacityInput.value) {
      arrangements.push({
        type: typeInput.value,
        capacity: parseInt(capacityInput.value, 10) || 0
      });
    }
  });
  
  return arrangements;
}

/**
 * Submit hotel form data to IndexedDB
 * @returns {Promise<string>} ID of the saved hotel
 */
async function submitHotelForm() {
  try {
    const formData = collectHotelFormData();
    
    // Validate required fields
    if (!formData.hotelName) {
      throw new Error('Nama hotel harus diisi');
    }
    
    // Save to IndexedDB
    const hotelId = await saveToStore('hotels', formData);
    
    return hotelId;
  } catch (error) {
    console.error('Error submitting hotel form:', error);
    throw error;
  }
}

/**
 * Submit venue form data to IndexedDB
 * @returns {Promise<string>} ID of the saved venue
 */
async function submitVenueForm() {
  try {
    const formData = collectVenueFormData();
    
    // Validate required fields
    if (!formData.venueName) {
      throw new Error('Nama venue harus diisi');
    }
    
    // Save to IndexedDB
    const venueId = await saveToStore('venues', formData);
    
    return venueId;
  } catch (error) {
    console.error('Error submitting venue form:', error);
    throw error;
  }
}