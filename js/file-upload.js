/**
 * File upload handler using IndexedDB storage
 */

// File upload container class
class FileUploadHandler {
  constructor(inputElement, previewElement, options = {}) {
    this.inputElement = typeof inputElement === 'string' 
      ? document.getElementById(inputElement) 
      : inputElement;
    
    this.previewElement = typeof previewElement === 'string'
      ? document.getElementById(previewElement)
      : previewElement;
    
    this.options = {
      maxSizeMB: options.maxSizeMB || 5,
      allowedTypes: options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      multiple: options.multiple || false,
      onUploadSuccess: options.onUploadSuccess || null,
      onUploadError: options.onUploadError || null
    };
    
    this.uploadedFiles = [];
    
    this.init();
  }
  
  init() {
    if (!this.inputElement) {
      console.error('File input element not found');
      return;
    }
    
    // Set multiple attribute if needed
    if (this.options.multiple) {
      this.inputElement.setAttribute('multiple', 'multiple');
    }
    
    // Add event listener
    this.inputElement.addEventListener('change', this.handleFileSelect.bind(this));
  }
  
  handleFileSelect(event) {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    // Clear preview if not multiple
    if (!this.options.multiple && this.previewElement) {
      this.previewElement.innerHTML = '';
      this.uploadedFiles = [];
    }
    
    // Process each file
    Array.from(files).forEach(file => {
      this.processFile(file);
    });
  }
  
  async processFile(file) {
    try {
      // Validate file
      if (!this.validateFile(file)) {
        return;
      }
      
      // Show loading in preview
      if (this.previewElement) {
        this.addLoadingPreview(file);
      }
      
      // Save file to IndexedDB
      const fileInfo = await saveFileToStore(file);
      
      // Add to uploaded files array
      this.uploadedFiles.push(fileInfo);
      
      // Update preview
      if (this.previewElement) {
        this.updatePreview(file, fileInfo);
      }
      
      // Call success callback if provided
      if (typeof this.options.onUploadSuccess === 'function') {
        this.options.onUploadSuccess(fileInfo);
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      
      // Remove loading preview
      if (this.previewElement) {
        const loadingEl = this.previewElement.querySelector(`[data-loading="${file.name}"]`);
        if (loadingEl) {
          loadingEl.remove();
        }
      }
      
      // Show error
      this.showError(`Gagal mengupload file: ${file.name}`);
      
      // Call error callback if provided
      if (typeof this.options.onUploadError === 'function') {
        this.options.onUploadError(file, error);
      }
    }
  }
  
  validateFile(file) {
    // Check file type
    if (this.options.allowedTypes.length > 0 && !this.options.allowedTypes.includes(file.type)) {
      this.showError(`Tipe file tidak didukung: ${file.type}`);
      return false;
    }
    
    // Check file size
    const maxSizeBytes = this.options.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.showError(`Ukuran file terlalu besar. Maksimal ${this.options.maxSizeMB}MB`);
      return false;
    }
    
    return true;
  }
  
  addLoadingPreview(file) {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'file-preview-loading';
    loadingEl.setAttribute('data-loading', file.name);
    
    loadingEl.innerHTML = `
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span class="ms-2">Uploading ${file.name}...</span>
    `;
    
    this.previewElement.appendChild(loadingEl);
  }
  
  async updatePreview(file, fileInfo) {
    // Remove loading element
    const loadingEl = this.previewElement.querySelector(`[data-loading="${file.name}"]`);
    if (loadingEl) {
      loadingEl.remove();
    }
    
    // Create preview element based on file type
    const previewEl = document.createElement('div');
    previewEl.className = 'file-preview-item';
    previewEl.setAttribute('data-file-id', fileInfo.id);
    
    let previewContent = '';
    
    if (file.type.startsWith('image/')) {
      // For images, create thumbnail preview
      const fileData = await getItemById('uploads', fileInfo.id);
      
      previewContent = `
        <div class="file-preview-image">
          <img src="${fileData.data}" alt="${file.name}">
        </div>
        <div class="file-preview-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${this.formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="btn btn-sm btn-danger delete-file" data-file-id="${fileInfo.id}">
          <i class="fas fa-times"></i>
        </button>
      `;
    } else {
      // For other files, show icon based on type
      let icon = 'file';
      
      if (file.type === 'application/pdf') {
        icon = 'file-pdf';
      } else if (file.type.includes('word')) {
        icon = 'file-word';
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
        icon = 'file-excel';
      } else if (file.type.includes('powerpoint') || file.type.includes('presentation')) {
        icon = 'file-powerpoint';
      } else if (file.type.includes('zip') || file.type.includes('compressed')) {
        icon = 'file-archive';
      }
      
      previewContent = `
        <div class="file-preview-icon">
          <i class="fas fa-${icon} fa-2x"></i>
        </div>
        <div class="file-preview-info">
          <div class="file-name">${file.name}</div>
          <div class="file-size">${this.formatFileSize(file.size)}</div>
        </div>
        <button type="button" class="btn btn-sm btn-danger delete-file" data-file-id="${fileInfo.id}">
          <i class="fas fa-times"></i>
        </button>
      `;
    }
    
    previewEl.innerHTML = previewContent;
    this.previewElement.appendChild(previewEl);
    
    // Add delete event listener
    const deleteBtn = previewEl.querySelector('.delete-file');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (e) => {
        const fileId = e.currentTarget.getAttribute('data-file-id');
        await this.deleteFile(fileId);
      });
    }
  }
  
  async deleteFile(fileId) {
    try {
      // Delete from IndexedDB
      await deleteItemFromStore('uploads', fileId);
      
      // Remove from uploadedFiles array
      this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId);
      
      // Remove preview element
      if (this.previewElement) {
        const previewEl = this.previewElement.querySelector(`[data-file-id="${fileId}"]`);
        if (previewEl) {
          previewEl.remove();
        }
      }
      
      // Show success notification
      this.showNotification('File berhasil dihapus', 'success');
      
    } catch (error) {
      console.error('Error deleting file:', error);
      this.showError('Gagal menghapus file');
    }
  }
  
  /**
   * Get all uploaded file IDs
   * @returns {Array} Array of file IDs
   */
  getUploadedFileIds() {
    return this.uploadedFiles.map(file => file.id);
  }
  
  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success/error)
   */
  showNotification(message, type) {
    // Check if showNotification function exists globally
    if (typeof window.showNotification === 'function') {
      window.showNotification(
        type === 'success' ? 'Sukses' : 'Error',
        message,
        type
      );
    } else {
      // Fallback to alert
      alert(message);
    }
  }
}