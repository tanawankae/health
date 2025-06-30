// Mobile Health Dashboard - Add Patient Form
// Multi-step form with validation and live status updates

let currentStep = 1;
const totalSteps = 3;
let formData = {};

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    updateProgressBar();
});

// Initialize form state
function initializeForm() {
    showStep(1);
    updateNavigationButtons();
    
    // Add input event listeners for real-time validation
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
            if (this.id === 'systolic' || this.id === 'diastolic') {
                updateBPStatus();
            }
            if (this.id === 'glucose') {
                updateGlucoseStatus();
            }
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('patientForm');

    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);
    submitBtn.addEventListener('click', submitForm);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
}

// Show specific step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${step}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStepElement.classList.add('fade-in');
    }
    
    updateProgressBar();
    updateNavigationButtons();
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `ขั้นตอนที่ ${currentStep} จาก ${totalSteps}`;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Previous button
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // Next/Submit buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Go to previous step
function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Go to next step
function goToNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            saveCurrentStepData();
            currentStep++;
            showStep(currentStep);
            
            // Update summary if we're on the last step
            if (currentStep === totalSteps) {
                updateSummaryPreview();
            }
        }
    }
}

// Validate current step
function validateCurrentStep() {
    let isValid = true;
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'กรุณากรอกข้อมูลในช่องนี้';
        isValid = false;
    }
    
    // Specific field validations
    switch (fieldName) {
        case 'name':
            if (value && value.length < 2) {
                errorMessage = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
                isValid = false;
            }
            break;
            
        case 'age':
            const age = parseInt(value);
            if (value && (isNaN(age) || age < 1 || age > 120)) {
                errorMessage = 'อายุต้องอยู่ระหว่าง 1-120 ปี';
                isValid = false;
            }
            break;
            
        case 'systolic':
            const systolic = parseInt(value);
            if (value && (isNaN(systolic) || systolic < 50 || systolic > 250)) {
                errorMessage = 'ความดันบนต้องอยู่ระหว่าง 50-250 mmHg';
                isValid = false;
            }
            break;
            
        case 'diastolic':
            const diastolic = parseInt(value);
            if (value && (isNaN(diastolic) || diastolic < 30 || diastolic > 150)) {
                errorMessage = 'ความดันล่างต้องอยู่ระหว่าง 30-150 mmHg';
                isValid = false;
            }
            break;
            
        case 'glucose':
            const glucose = parseInt(value);
            if (value && (isNaN(glucose) || glucose < 50 || glucose > 500)) {
                errorMessage = 'ระดับน้ำตาลต้องอยู่ระหว่าง 50-500 mg/dL';
                isValid = false;
            }
            break;
            
        case 'address':
            if (value && value.length < 10) {
                errorMessage = 'ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    field.style.borderColor = '#ef4444';
    field.style.background = '#fef2f2';
}

// Clear field error
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
    
    field.style.borderColor = '#e5e7eb';
    field.style.background = '#f9fafb';
}

// Save current step data
function saveCurrentStepData() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const inputs = currentStepElement.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'number') {
            formData[input.name] = parseInt(input.value) || 0;
        } else {
            formData[input.name] = input.value.trim();
        }
    });
}

// Update blood pressure status
function updateBPStatus() {
    const systolic = parseInt(document.getElementById('systolic').value) || 0;
    const diastolic = parseInt(document.getElementById('diastolic').value) || 0;
    
    if (systolic > 0 && diastolic > 0) {
        const status = getBloodPressureStatus(systolic, diastolic);
        const statusElement = document.getElementById('bpStatus');
        const iconElement = document.getElementById('bpStatusIcon');
        const titleElement = document.getElementById('bpStatusTitle');
        const descElement = document.getElementById('bpStatusDesc');
        
        statusElement.style.display = 'block';
        statusElement.className = `status-preview ${status}`;
        
        switch (status) {
            case 'normal':
                iconElement.textContent = '✅';
                titleElement.textContent = 'ความดันปกติ';
                descElement.textContent = 'ค่าความดันอยู่ในเกณฑ์ปกติ';
                break;
            case 'warning':
                iconElement.textContent = '⚠️';
                titleElement.textContent = 'ความดันระดับเฝ้าระวัง';
                descElement.textContent = 'ควรปรับพฤติกรรมและติดตามอย่างใกล้ชิด';
                break;
            case 'danger':
                iconElement.textContent = '🚨';
                titleElement.textContent = 'ความดันระดับเสี่ยง';
                descElement.textContent = 'ควรปรึกษาแพทย์โดยเร็วที่สุด';
                break;
        }
    } else {
        document.getElementById('bpStatus').style.display = 'none';
    }
}

// Update glucose status
function updateGlucoseStatus() {
    const glucose = parseInt(document.getElementById('glucose').value) || 0;
    
    if (glucose > 0) {
        const status = getGlucoseStatus(glucose);
        const statusElement = document.getElementById('glucoseStatus');
        const iconElement = document.getElementById('glucoseStatusIcon');
        const titleElement = document.getElementById('glucoseStatusTitle');
        const descElement = document.getElementById('glucoseStatusDesc');
        
        statusElement.style.display = 'block';
        statusElement.className = `status-preview ${status}`;
        
        switch (status) {
            case 'normal':
                iconElement.textContent = '✅';
                titleElement.textContent = 'น้ำตาลปกติ';
                descElement.textContent = 'ระดับน้ำตาลอยู่ในเกณฑ์ปกติ';
                break;
            case 'warning':
                iconElement.textContent = '⚠️';
                titleElement.textContent = 'น้ำตาลระดับเฝ้าระวัง';
                descElement.textContent = 'ควรควบคุมอาหารและออกกำลังกาย';
                break;
            case 'danger':
                iconElement.textContent = '🚨';
                titleElement.textContent = 'น้ำตาลระดับเสี่ยง';
                descElement.textContent = 'ควรปรึกษาแพทย์เพื่อการรักษา';
                break;
        }
        
        // Show summary preview if on last step
        if (currentStep === totalSteps) {
            updateSummaryPreview();
        }
    } else {
        document.getElementById('glucoseStatus').style.display = 'none';
    }
}

// Update summary preview
function updateSummaryPreview() {
    saveCurrentStepData();
    
    const summaryElement = document.getElementById('summaryPreview');
    const nameElement = document.getElementById('summaryName');
    const ageElement = document.getElementById('summaryAge');
    const bpElement = document.getElementById('summaryBP');
    const glucoseElement = document.getElementById('summaryGlucose');
    
    if (Object.keys(formData).length > 0) {
        summaryElement.style.display = 'block';
        nameElement.textContent = formData.name || '-';
        ageElement.textContent = formData.age ? `${formData.age} ปี` : '-';
        bpElement.textContent = (formData.systolic && formData.diastolic) ? 
            `${formData.systolic}/${formData.diastolic} mmHg` : '-';
        glucoseElement.textContent = formData.glucose ? `${formData.glucose} mg/dL` : '-';
    }
}

// Submit form
function submitForm() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        // Add timestamp
        formData.timestamp = new Date().toISOString();
        formData.id = Date.now();
        
        // Simulate saving data (since this is a mockup)
        console.log('Patient data:', formData);
        
        // Show success modal
        showSuccessModal();
        
        // Here you would normally send data to a server
        // fetch('/api/patients', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
    
    // Add haptic feedback (if supported)
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }
}

// Redirect to home
function redirectToHome() {
    window.location.href = 'index.html';
}

// Add another patient
function addAnotherPatient() {
    // Reset form
    currentStep = 1;
    formData = {};
    document.getElementById('patientForm').reset();
    document.getElementById('successModal').style.display = 'none';
    
    // Clear all status previews
    document.getElementById('bpStatus').style.display = 'none';
    document.getElementById('glucoseStatus').style.display = 'none';
    document.getElementById('summaryPreview').style.display = 'none';
    
    // Clear all errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    // Reset field styles
    document.querySelectorAll('input, textarea').forEach(field => {
        clearFieldError(field);
    });
    
    showStep(1);
}

// Helper functions for status determination
function getBloodPressureStatus(systolic, diastolic) {
    if (systolic >= 140 || diastolic >= 90) return 'danger';
    if (systolic >= 130 || diastolic >= 80) return 'warning';
    return 'normal';
}

function getGlucoseStatus(glucose) {
    if (glucose >= 140) return 'danger';
    if (glucose >= 100) return 'warning';
    return 'normal';
}

// Touch/swipe support for mobile
let startX = null;
let startY = null;

document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    
    // Only process horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swipe left - next step
            if (currentStep < totalSteps && validateCurrentStep()) {
                goToNextStep();
            }
        } else {
            // Swipe right - previous step
            if (currentStep > 1) {
                goToPreviousStep();
            }
        }
    }
    
    startX = null;
    startY = null;
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        if (currentStep < totalSteps) {
            goToNextStep();
        } else {
            submitForm();
        }
    }
    
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }
});

// Auto-save draft (optional feature)
function saveDraft() {
    if (Object.keys(formData).length > 0) {
        localStorage.setItem('patientFormDraft', JSON.stringify(formData));
    }
}

// Load draft on page load
function loadDraft() {
    const draft = localStorage.getItem('patientFormDraft');
    if (draft) {
        try {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                }
            });
            formData = data;
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

// Clear draft after successful submission
function clearDraft() {
    localStorage.removeItem('patientFormDraft');
}

// Enhanced form initialization
document.addEventListener('DOMContentLoaded', function() {
    loadDraft();
    
    // Auto-save every 30 seconds
    setInterval(() => {
        saveCurrentStepData();
        saveDraft();
    }, 30000);
});

// Accessibility enhancements
function announceStepChange() {
    const announcement = `ขั้นตอนที่ ${currentStep} จาก ${totalSteps}`;
    
    // Create screen reader announcement
    const srOnly = document.createElement('div');
    srOnly.setAttribute('aria-live', 'polite');
    srOnly.setAttribute('aria-atomic', 'true');
    srOnly.className = 'sr-only';
    srOnly.textContent = announcement;
    
    document.body.appendChild(srOnly);
    
    setTimeout(() => {
        document.body.removeChild(srOnly);
    }, 1000);
}

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);