// Venue Management Form Validation and Stepper Logic

// Current active step
let currentStep = 1;
let formValidated = false;

// Form validation configuration - Required fields by step
const requiredFieldsByStep = {
  1: [
    { id: "total-area", name: "Luas Area" },
    { id: "room-length", name: "Panjang Ruangan" },
    { id: "room-width", name: "Lebar Ruangan" },
    { id: "ceiling-height", name: "Tinggi Langit-langit" },
    { id: "floor-material", name: "Material Lantai" },
    { id: "entrance-count", name: "Jumlah Pintu Masuk" }
  ],
  2: [
    // At least one layout must be selected
    { id: "layout-selection", name: "Pemilihan Layout", customValidator: () => {
      return document.querySelectorAll(".layout-option.selected").length > 0;
    }},
    // If theater layout is selected, validate capacity
    { id: "theater-max-capacity", name: "Kapasitas Theater", conditional: () => {
      return document.querySelector('.layout-option[data-layout="theater"].selected') !== null;
    }}
  ],
  3: [
    { id: "audio-system-type", name: "Tipe Sound System" },
    { id: "lighting-type", name: "Tipe Sistem Pencahayaan" },
    { id: "internet-type", name: "Tipe Koneksi Internet" }
  ],
  4: [
    { id: "male-toilet", name: "Jumlah Toilet Pria" },
    { id: "female-toilet", name: "Jumlah Toilet Wanita" },
    { id: "catering-policy", name: "Kebijakan Katering" }
  ],
  5: [
    { id: "confirm-accurate", name: "Konfirmasi Keakuratan Data", type: "checkbox" },
    { id: "terms-conditions", name: "Persetujuan Syarat & Ketentuan", type: "checkbox" }
  ]
};

// Function to show toast notifications
function showNotification(title, message, type) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
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
  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
  
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
  toast.addEventListener("hidden.bs.toast", function() {
    toast.remove();
  });
}

// Function to validate a single step
function validateStep(step) {
  const fields = requiredFieldsByStep[step] || [];
  let isValid = true;
  let invalidFields = [];
  
  fields.forEach(field => {
    // Skip validation if conditional function returns false
    if (field.conditional && !field.conditional()) {
      return;
    }
    
    // Custom validator takes precedence if provided
    if (field.customValidator) {
      if (!field.customValidator()) {
        isValid = false;
        invalidFields.push(field.name);
      }
      return;
    }
    
    const element = document.getElementById(field.id);
    if (!element) return;
    
    // Reset validation state
    element.classList.remove('is-invalid');
    
    // Check validity based on element type
    let fieldValid = true;
    
    if (field.type === 'checkbox') {
      fieldValid = element.checked;
    } else if (element.tagName === 'SELECT') {
      fieldValid = element.selectedIndex > 0;
    } else {
      fieldValid = element.value.trim() !== '';
    }
    
    // Mark invalid fields
    if (!fieldValid) {
      isValid = false;
      invalidFields.push(field.name);
      element.classList.add('is-invalid');
    }
  });
  
  if (!isValid) {
    // Show notification with missing fields
    showNotification(
      "Validasi Gagal", 
      `Harap lengkapi field wajib berikut: ${invalidFields.join(', ')}`, 
      "error"
    );
  }
  
  return isValid;
}

// Function to check step completion status
function checkStepCompletionStatus(step) {
  const fields = requiredFieldsByStep[step] || [];
  let isComplete = fields.length > 0;
  
  fields.forEach(field => {
    // Skip conditional fields if condition isn't met
    if (field.conditional && !field.conditional()) {
      return;
    }
    
    // Handle custom validators
    if (field.customValidator) {
      if (!field.customValidator()) {
        isComplete = false;
      }
      return;
    }
    
    const element = document.getElementById(field.id);
    if (!element) return;
    
    let fieldValid = true;
    
    if (field.type === 'checkbox') {
      fieldValid = element.checked;
    } else if (element.tagName === 'SELECT') {
      fieldValid = element.selectedIndex > 0;
    } else {
      fieldValid = element.value.trim() !== '';
    }
    
    if (!fieldValid) {
      isComplete = false;
    }
  });
  
  return isComplete;
}

// Function to update completion icons on the flowchart
function updateStepCompletionIcons() {
  // Update each step's completion status in the flowchart
  document.querySelectorAll(".flowchart-step").forEach((step, index) => {
    const stepNumber = index + 1;
    const stepIcon = step.querySelector(".flowchart-step-number");
    
    if (stepNumber < currentStep) {
      // Check if completed step is actually valid
      const isStepComplete = checkStepCompletionStatus(stepNumber);
      
      if (isStepComplete) {
        // Add checkmark for completed steps
        if (!stepIcon.querySelector('.fa-check')) {
          stepIcon.innerHTML = '<i class="fas fa-check"></i>';
        }
      } else {
        // Add warning icon for incomplete steps
        if (!stepIcon.querySelector('.fa-exclamation-triangle')) {
          stepIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
          step.classList.add('incomplete');
        }
      }
    } else {
      // Reset to step number for current and future steps
      stepIcon.innerHTML = stepNumber;
      step.classList.remove('incomplete');
    }
  });
}

// Function to show specific step
function showStep(step, validate = true) {
  // Validate current step before proceeding
  if (validate && step > currentStep) {
    if (!validateStep(currentStep)) {
      return false;
    }
  }
  
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
  
  // Update step completion icons
  updateStepCompletionIcons();
  
  // Update current step
  currentStep = step;
  
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  
  // If we're on the last step, update summary
  if (step === 5) {
    updateSummary();
  }
  
  return true;
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
    step.classList.remove("active", "completed");
    
    if (stepNumber < active) {
      step.classList.add("completed");
    } else if (stepNumber === active) {
      step.classList.add("active");
    }
  });
}

// Document ready function
document.addEventListener("DOMContentLoaded", function() {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  
  // Expandable sections
  document.querySelectorAll(".expandable-header").forEach(header => {
    header.addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      content.classList.toggle("active");
    });
  });
  
  // Add click handlers to flowchart steps for navigation
  document.querySelectorAll(".flowchart-step").forEach((step, index) => {
    step.addEventListener("click", function() {
      const stepNumber = index + 1;
      
      // Only allow clicking on completed steps or the next immediate step
      if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
        showStep(stepNumber);
      } else {
        showNotification("Navigasi Terbatas", "Harap selesaikan langkah sebelumnya terlebih dahulu", "error");
      }
    });
  });
  
  // Layout option selection
  document.querySelectorAll(".layout-option").forEach(option => {
    option.addEventListener("click", function() {
      this.classList.toggle("selected");
      
      // Update status card
      updateLayoutStatus();
      
      // Update conditional validation for layout options
      const layoutId = this.getAttribute('data-layout');
      const capacityField = document.getElementById(`${layoutId}-max-capacity`);
      
      if (capacityField) {
        if (this.classList.contains('selected')) {
          capacityField.setAttribute('required', 'required');
        } else {
          capacityField.removeAttribute('required');
        }
      }
    });
  });
  
  // Setup option selection
  document.querySelectorAll(".setup-option").forEach(option => {
    option.addEventListener("click", function() {
      this.classList.toggle("selected");
    });
  });
  
  // Form navigation buttons with validation
  document.getElementById("next-btn-1").addEventListener("click", function() {
    showStep(2);
  });
  
  document.getElementById("prev-btn-2").addEventListener("click", function() {
    showStep(1, false); // Navigate back without validation
  });
  
  document.getElementById("next-btn-2").addEventListener("click", function() {
    showStep(3);
  });
  
  document.getElementById("prev-btn-3").addEventListener("click", function() {
    showStep(2, false); // Navigate back without validation
  });
  
  document.getElementById("next-btn-3").addEventListener("click", function() {
    showStep(4);
  });
  
  document.getElementById("prev-btn-4").addEventListener("click", function() {
    showStep(3, false); // Navigate back without validation
  });
  
  document.getElementById("next-btn-4").addEventListener("click", function() {
    showStep(5);
  });
  
  document.getElementById("prev-btn-5").addEventListener("click", function() {
    showStep(4, false); // Navigate back without validation
  });
  
  // Submit button handler
  document.getElementById("submit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    
    // Validate the final step
    if (validateStep(5)) {
      formValidated = true;
      
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Menyimpan...';
      this.disabled = true;
      
      // Simulate form submission (in a real app, this would be an actual form submission)
      setTimeout(() => {
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Add event listener to handle modal close with redirection
        const modalElement = document.getElementById('successModal');
        modalElement.addEventListener('hidden.bs.modal', function() {
          // Redirect to venue dashboard when modal is closed via ESC or clicking outside
          window.location.href = '../dashboard-venue/';
        });
        
        // Reset button state
        this.innerHTML = 'Simpan dan Publikasikan';
        this.disabled = false;
        
        console.log("Form validated and ready to submit");
      }, 1500);
    } else {
      // Already shows validation error toast
    }
  });
  
  // Real-time validation as user fills the form (debounced)
  let debounceTimeout;
  
  // Add input event listeners to all form inputs for real-time validation
  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', function() {
      clearTimeout(debounceTimeout);
      
      debounceTimeout = setTimeout(() => {
        updateCompletionPercentage();
      }, 500);
    });
    
    // Add blur event for immediate validation when leaving a field
    input.addEventListener('blur', function() {
      if (this.required || this.hasAttribute('required')) {
        validateField(this);
      }
    });
  });
  
  // Function to validate a single field
  function validateField(field) {
    field.classList.remove('is-invalid');
    
    let isValid = true;
    
    if (field.type === 'checkbox') {
      isValid = field.checked;
    } else if (field.tagName === 'SELECT') {
      isValid = field.selectedIndex > 0;
    } else {
      isValid = field.value.trim() !== '';
    }
    
    if (!isValid) {
      field.classList.add('is-invalid');
    }
    
    return isValid;
  }
  
  // Material selection change handlers
  const materialFields = ["floor-material", "wall-material", "ceiling-material"];
  materialFields.forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener("change", updateMaterialOtherField);
    }
  });
  
  function updateMaterialOtherField() {
    const floorMaterial = document.getElementById("floor-material").value;
    const wallMaterial = document.getElementById("wall-material")?.value || '';
    const ceilingMaterial = document.getElementById("ceiling-material")?.value || '';
    
    const otherContainer = document.getElementById("other-material-container");
    
    if (otherContainer) {
      if (floorMaterial === "other" || wallMaterial === "other" || ceilingMaterial === "other") {
        otherContainer.style.display = "block";
      } else {
        otherContainer.style.display = "none";
      }
    }
    
    updateDimensionsStatus();
  }
  
  // Calculate completion percentage
  function calculateCompletionPercentage() {
    let totalFields = 0;
    let completedFields = 0;
    
    // Section 1: Main Specifications
    const requiredFields1 = [
      "total-area", "room-length", "room-width", "ceiling-height", "floor-material", "entrance-count"
    ];
    
    totalFields += requiredFields1.length;
    requiredFields1.forEach(field => {
      const element = document.getElementById(field);
      if (element && (element.value || element.selectedIndex > 0)) {
        completedFields++;
      }
    });
    
    // Section 2: Layout Configurations
    const selectedLayouts = document.querySelectorAll(".layout-option.selected");
    if (selectedLayouts.length > 0) {
      totalFields++;
      completedFields++;
      
      // Check capacity fields for selected layouts
      if (document.querySelector('.layout-option[data-layout="theater"].selected')) {
        totalFields++;
        if (document.getElementById("theater-max-capacity")?.value) {
          completedFields++;
        }
      }
      
      if (document.querySelector('.layout-option[data-layout="classroom"].selected')) {
        totalFields++;
        if (document.getElementById("classroom-max-capacity")?.value) {
          completedFields++;
        }
      }
      
      // Check other layout selections (U-shape, boardroom, etc)
      const otherLayouts = [
        {selector: '.layout-option[data-layout="ushape"].selected', capacity: "ushape-capacity"},
        {selector: '.layout-option[data-layout="boardroom"].selected', capacity: "boardroom-capacity"},
        {selector: '.layout-option[data-layout="banquet"].selected', capacity: "banquet-capacity"},
        {selector: '.layout-option[data-layout="reception"].selected', capacity: "reception-capacity"}
      ];
      
      otherLayouts.forEach(layout => {
        if (document.querySelector(layout.selector)) {
          totalFields++;
          const capacityElement = document.getElementById(layout.capacity);
          if (capacityElement && capacityElement.value) {
            completedFields++;
          }
        }
      });
    }
    
    // Section 3: Technical Infrastructure
    const requiredFields3 = [
      "audio-system-type", "lighting-type", "internet-type"
    ];
    
    totalFields += requiredFields3.length;
    requiredFields3.forEach(field => {
      const element = document.getElementById(field);
      if (element && (element.value || element.selectedIndex > 0)) {
        completedFields++;
      }
    });
    
    // Section 4: Supporting Facilities
    const requiredFields4 = [
      "male-toilet", "female-toilet", "catering-policy"
    ];
    
    totalFields += requiredFields4.length;
    requiredFields4.forEach(field => {
      const element = document.getElementById(field);
      if (element && element.value) {
        completedFields++;
      }
    });
    
    // Optional but counted if checked
    const optionalFields = [
      "has-backstage", "has-vip-room", "has-registration", "has-storage",
      "has-prayer-room", "has-medical-room", "has-lounge", "has-kitchen", "has-restaurant"
    ];
    
    optionalFields.forEach(field => {
      const element = document.getElementById(field);
      if (element && element.checked) {
        totalFields++;
        completedFields++;
      }
    });
    
    // Calculate percentage
    return Math.round((completedFields / totalFields) * 100);
  }
  
  // Update completion percentage display
  function updateCompletionPercentage() {
    const percentage = calculateCompletionPercentage();
    
    // Update percentage text
    const percentageElements = [
      "completion-percentage", 
      "completion-percentage-2", 
      "completion-percentage-3", 
      "completion-percentage-4"
    ];
    
    percentageElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = percentage + "%";
      }
    });
    
    // Update progress bar
    document.querySelectorAll(".progress-bar").forEach(bar => {
      bar.style.width = percentage + "%";
      bar.setAttribute("aria-valuenow", percentage);
    });
    
    // Change progress bar color based on percentage
    if (percentage < 30) {
      document.querySelectorAll(".progress-bar").forEach(bar => {
        bar.className = "progress-bar bg-danger";
      });
    } else if (percentage < 70) {
      document.querySelectorAll(".progress-bar").forEach(bar => {
        bar.className = "progress-bar bg-warning";
      });
    } else {
      document.querySelectorAll(".progress-bar").forEach(bar => {
        bar.className = "progress-bar bg-success";
      });
    }
    
    // Update step completion icons
    updateStepCompletionIcons();
    
    // Set card header completion counts
    updateCardCompletionCounts();
  }
  
  // Update card header completion counts
  function updateCardCompletionCounts() {
    // Step 1 completion indicator
    updateSectionCompletionCount(1, "completion-count-1");
    
    // Step 2 completion indicator 
    updateSectionCompletionCount(2, "completion-count-2");
    
    // Step 3 completion indicator
    updateSectionCompletionCount(3, "completion-count-3");
    
    // Step 4 completion indicator
    updateSectionCompletionCount(4, "completion-count-4");
  }
  
  // Update completion count for a section
  function updateSectionCompletionCount(step, elementId) {
    const fields = requiredFieldsByStep[step] || [];
    let completedCount = 0;
    let totalCount = 0;
    
    fields.forEach(field => {
      // Skip conditional fields if condition isn't met
      if (field.conditional && !field.conditional()) {
        return;
      }
      
      totalCount++;
      
      // Handle custom validators
      if (field.customValidator) {
        if (field.customValidator()) {
          completedCount++;
        }
        return;
      }
      
      const element = document.getElementById(field.id);
      if (!element) return;
      
      let fieldValid = true;
      
      if (field.type === 'checkbox') {
        fieldValid = element.checked;
      } else if (element.tagName === 'SELECT') {
        fieldValid = element.selectedIndex > 0;
      } else {
        fieldValid = element.value.trim() !== '';
      }
      
      if (fieldValid) {
        completedCount++;
      }
    });
    
    // Update counter in card header if element exists
    const countElement = document.getElementById(elementId) || 
                         document.querySelector(`.card-header span i[class*="fa-percentage"]`).parentNode;
    
    if (countElement && totalCount > 0) {
      countElement.innerHTML = `<i class="fas fa-percentage me-1"></i> ${completedCount}/${totalCount} Completed`;
    }
  }
  
  // Update summary data for confirmation page
  function updateSummary() {
    // Get references to summary elements
    const summaryElements = {
      dimensions: document.getElementById("summary-dimensions"),
      floorLoad: document.getElementById("summary-floor-load"),
      materials: document.getElementById("summary-materials"),
      access: document.getElementById("summary-access"),
      capacities: document.getElementById("summary-capacities"),
      audio: document.getElementById("summary-audio"),
      visual: document.getElementById("summary-visual"),
      lighting: document.getElementById("summary-lighting"),
      internet: document.getElementById("summary-internet"),
      rooms: document.getElementById("summary-rooms"),
      sanitation: document.getElementById("summary-sanitation"),
      fnb: document.getElementById("summary-fnb"),
      addFacilities: document.getElementById("summary-add-facilities")
    };
    
    // Check if we're actually on the summary page
    if (!summaryElements.dimensions) {
      return; // We're not on the summary page
    }
    
    // Dimensions summary
    const totalArea = document.getElementById("total-area")?.value;
    const roomLength = document.getElementById("room-length")?.value;
    const roomWidth = document.getElementById("room-width")?.value;
    const ceilingHeight = document.getElementById("ceiling-height")?.value;
    const floorLoad = document.getElementById("floor-loading")?.value;
    
    let dimensionsText = "";
    if (totalArea) dimensionsText += `Luas total: ${totalArea} m²<br>`;
    if (roomLength && roomWidth && ceilingHeight) {
      dimensionsText += `Dimensi: ${roomLength}m × ${roomWidth}m × ${ceilingHeight}m<br>`;
    }
    
    summaryElements.dimensions.innerHTML = dimensionsText || "Tidak ada data";
    
    // Floor loading summary
    if (floorLoad) {
      summaryElements.floorLoad.innerHTML = `${floorLoad} kg/m²`;
    } else {
      summaryElements.floorLoad.innerHTML = "Tidak ada data";
    }
    
    // Update all section completion counts
    updateCardCompletionCounts();
    
    // Update final completion percentage
    const completionPercentage = calculateCompletionPercentage();
    
    const finalCompletionElements = [
      "final-completion-percentage",
      "completion-percentage-5",
      "status-completeness"
    ];
    
    finalCompletionElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = completionPercentage + "%";
      }
    });
    
    // Update all progress bars
    document.querySelectorAll(".progress-bar").forEach(bar => {
      bar.style.width = completionPercentage + "%";
      bar.setAttribute("aria-valuenow", completionPercentage);
    });
    
    // Change progress bar color based on percentage
    const progressBarClass = completionPercentage < 30 ? "bg-danger" : 
                            (completionPercentage < 70 ? "bg-warning" : "bg-success");
    
    document.querySelectorAll(".progress-bar").forEach(bar => {
      bar.className = `progress-bar ${progressBarClass}`;
    });
  }
  
  // Call all the imported functions from the original script
  if (window.updateDimensionsStatus) updateDimensionsStatus();
  if (window.updateLayoutStatus) updateLayoutStatus();
  
  // Set up a periodic check for form validity to update the stepper visuals
  setInterval(updateCompletionPercentage, 2000);
  
  // Run initial validation and update
  setTimeout(updateCompletionPercentage, 500);
  
  // Re-export required functions for other scripts
  window.showStep = showStep;
  window.validateStep = validateStep;
  window.updateSummary = updateSummary;
  window.updateCompletionPercentage = updateCompletionPercentage;
  window.showNotification = showNotification;
  window.updateFlowchart = updateFlowchart;
  window.updateStepIndicators = updateStepIndicators;
});