/**
 * Submit handler for the form to test data saving
 */

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize file upload handlers
  initializeFileUploads();
  
  // Add submit event listener
  const submitButton = document.getElementById('submit-form');
  if (submitButton) {
    submitButton.addEventListener('click', handleFormSubmit);
  }
  
  // Initialize additional facilities array
  window.additionalFacilities = [];
  
  // Add facility button handler
  const addFacilityButton = document.getElementById('add-facility');
  if (addFacilityButton) {
    addFacilityButton.addEventListener('click', addAdditionalFacility);
  }
});

/**
 * Initialize file upload handlers
 */
function initializeFileUploads() {
  // Initialize image360 uploader
  if (document.getElementById('image360')) {
    window.image360Uploader = new FileUploadHandler(
      'image360',
      'image360-preview',
      {
        maxSizeMB: 10,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        multiple: false
      }
    );
  }
  
  // Initialize photos uploader
  if (document.getElementById('photos')) {
    window.photosUploader = new FileUploadHandler(
      'photos',
      'photos-preview',
      {
        maxSizeMB: 5,
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        multiple: true
      }
    );
  }
  
  // Create preview containers if they don't exist
  createPreviewContainers();
}

/**
 * Create preview containers for file uploads
 */
function createPreviewContainers() {
  // For image 360
  if (document.getElementById('image360') && !document.getElementById('image360-preview')) {
    const container = document.getElementById('image360').closest('.upload-area');
    
    if (container) {
      const previewDiv = document.createElement('div');
      previewDiv.id = 'image360-preview';
      previewDiv.className = 'file-preview mt-3';
      container.appendChild(previewDiv);
    }
  }
  
  // For photos
  if (document.getElementById('photos') && !document.getElementById('photos-preview')) {
    const container = document.getElementById('photos').closest('.upload-area');
    
    if (container) {
      const previewDiv = document.createElement('div');
      previewDiv.id = 'photos-preview';
      previewDiv.className = 'file-preview mt-3';
      container.appendChild(previewDiv);
    }
  }
}

/**
 * Add additional facility to the list
 */
function addAdditionalFacility() {
  const input = document.getElementById('facility-input');
  const facilityName = input.value.trim();
  
  if (facilityName) {
    const list = document.getElementById('additional-facilities-list');
    const facilityId = 'facility-' + Date.now(); // Generate unique ID
    
    const item = document.createElement('div');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <span><i class="fas fa-check-circle text-success me-2"></i>${facilityName}</span>
      <button type="button" class="btn btn-sm btn-outline-danger" data-facility-id="${facilityId}">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // Add delete handler
    const deleteButton = item.querySelector('button');
    deleteButton.addEventListener('click', function() {
      // Remove from DOM
      item.remove();
      
      // Remove from array
      const facilityId = this.getAttribute('data-facility-id');
      window.additionalFacilities = window.additionalFacilities.filter(f => f.id !== facilityId);
    });
    
    // Add to list
    list.appendChild(item);
    
    // Add to array
    window.additionalFacilities.push({
      id: facilityId,
      name: facilityName
    });
    
    // Clear input
    input.value = '';
  }
}

/**
 * Handle form submission
 */
async function handleFormSubmit() {
  try {
    // Show loading indicator
    showLoading(true);
    
    // Validate required fields
    if (!validateForm()) {
      showLoading(false);
      return;
    }
    
    // Submit data
    const hotelId = await submitHotelForm();
    
    // Show success message
    showNotification(
      'Sukses',
      'Data hotel berhasil disimpan dengan ID: ' + hotelId,
      'success'
    );
    
    // Hide loading indicator
    showLoading(false);
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = '../dashboard/index.html';
    }, 2000);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Show error message
    showNotification(
      'Error',
      'Gagal menyimpan data: ' + error.message,
      'error'
    );
    
    // Hide loading indicator
    showLoading(false);
  }
}

/**
 * Validate form fields
 * @returns {boolean} True if form is valid
 */
function validateForm() {
  // Required fields
  const requiredFields = [
    { id: 'hotel-name', label: 'Nama Hotel' },
    { id: 'classification', label: 'Klasifikasi Hotel' },
    { id: 'description', label: 'Deskripsi' },
    { id: 'address', label: 'Alamat' }
  ];
  
  // Check each required field
  for (const field of requiredFields) {
    const element = document.getElementById(field.id);
    
    if (!element || !element.value.trim()) {
      showNotification(
        'Validasi',
        `${field.label} harus diisi`,
        'error'
      );
      
      // Focus on the element
      if (element) {
        element.focus();
        
        // Scroll to the section containing this element
        const section = element.closest('.form-section');
        if (section) {
          const sectionId = section.id;
          const stepNumber = sectionId.replace('section', '');
          showStep(parseInt(stepNumber, 10));
        }
      }
      
      return false;
    }
  }
  
  return true;
}

/**
 * Show loading indicator
 * @param {boolean} show - Whether to show or hide loading
 */
function showLoading(show) {
  let loadingEl = document.getElementById('loading-overlay');
  
  if (show) {
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.id = 'loading-overlay';
      loadingEl.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Menyimpan data...</p>
        </div>
      `;
      document.body.appendChild(loadingEl);
    }
    
    loadingEl.style.display = 'flex';
  } else if (loadingEl) {
    loadingEl.style.display = 'none';
  }
}

/**
 * Show notification to user
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success/error)
 */
function showNotification(title, message, type = 'info') {
  // Create notification element if it doesn't exist
  let notificationContainer = document.getElementById('notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Set icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';
  
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-${icon}"></i>
    </div>
    <div class="notification-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Add close handler
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      notification.classList.add('closing');
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }
  
  // Auto-close after 5 seconds for success and info
  if (type !== 'error') {
    setTimeout(() => {
      notification.classList.add('closing');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}

// Make showNotification available globally
window.showNotification = showNotification;