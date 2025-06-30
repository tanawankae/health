// Mobile Health Dashboard - Patients List Page
// Handles patient list functionality, search, filter, and details

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setupSearchAndFilter();
    setupPatientInteractions();
    
    // Update time every minute
    setInterval(updateTime, 60000);
});

// Update time in status bar
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const timeElements = document.querySelectorAll('.time');
    timeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Setup search and filter functionality
function setupSearchAndFilter() {
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.getElementById('searchBar');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Toggle search bar
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const isVisible = searchBar.style.display !== 'none';
            searchBar.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                searchInput.focus();
                searchBar.classList.add('slide-down');
            }
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterPatients(query, getCurrentFilter());
            
            // Show/hide clear button
            clearSearch.style.display = query ? 'block' : 'none';
        });
    }
    
    // Clear search
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            searchInput.value = '';
            clearSearch.style.display = 'none';
            filterPatients('', getCurrentFilter());
            searchInput.focus();
        });
    }
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter
            const filter = this.dataset.filter;
            const query = searchInput.value.toLowerCase();
            filterPatients(query, filter);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

// Get current active filter
function getCurrentFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}

// Filter patients based on search query and status
function filterPatients(query, statusFilter) {
    const patientCards = document.querySelectorAll('.patient-card');
    let visibleCount = 0;
    
    patientCards.forEach(card => {
        const name = card.querySelector('.patient-name').textContent.toLowerCase();
        const location = card.querySelector('.patient-location').textContent.toLowerCase();
        const status = card.dataset.status;
        
        // Check if matches search query
        const matchesSearch = !query || name.includes(query) || location.includes(query);
        
        // Check if matches status filter
        const matchesFilter = statusFilter === 'all' || status === statusFilter;
        
        // Show/hide card
        const shouldShow = matchesSearch && matchesFilter;
        card.style.display = shouldShow ? 'flex' : 'none';
        
        if (shouldShow) {
            visibleCount++;
            // Add animation
            card.classList.remove('fade-in');
            setTimeout(() => card.classList.add('fade-in'), 50);
        }
    });
    
    // Update header count
    updateHeaderCount(visibleCount);
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0);
}

// Update header patient count
function updateHeaderCount(count) {
    const headerText = document.querySelector('.header-text p');
    if (headerText) {
        const filter = getCurrentFilter();
        let filterText = '';
        
        switch(filter) {
            case 'normal': filterText = ' (ปกติ)'; break;
            case 'warning': filterText = ' (เฝ้าระวัง)'; break;
            case 'danger': filterText = ' (เสี่ยง)'; break;
        }
        
        headerText.textContent = `ผู้ป่วยทั้งหมด ${count} คน${filterText}`;
    }
}

// Show/hide no results message
function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🔍</div>
                <h3 style="margin-bottom: 10px; color: #374151;">ไม่พบข้อมูล</h3>
                <p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
            </div>
        `;
        
        const patientsList = document.getElementById('patientsList');
        patientsList.appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Setup patient card interactions
function setupPatientInteractions() {
    const patientCards = document.querySelectorAll('.patient-card');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Patient card click handlers
    patientCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.patient-name').textContent;
            const age = this.querySelector('.age').textContent;
            const bp = this.querySelector('.bp').textContent;
            const glucose = this.querySelector('.glucose').textContent;
            const location = this.querySelector('.patient-location').textContent;
            
            openPatientModal(name, age, bp, glucose, location);
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
        });
        
        // Touch feedback
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        card.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'กำลังโหลด...';
            this.disabled = true;
            
            // Simulate loading more patients
            setTimeout(() => {
                loadMorePatients();
                this.style.display = 'none';
            }, 1500);
        });
    }
}

// Load more patients (mockup)
function loadMorePatients() {
    const additionalPatients = [
        {
            name: "นายปิยะ เฉลียวฉลาด",
            age: 44,
            bp: "132/88",
            glucose: 105,
            location: "เขตบางนา",
            status: "warning",
            avatar: "ป"
        },
        {
            name: "นางจิราพร สวยงาม", 
            age: 39,
            bp: "118/78",
            glucose: 92,
            location: "เขตบางกะปิ",
            status: "normal",
            avatar: "จ"
        },
        // Add more as needed...
    ];
    
    const patientsList = document.getElementById('patientsList');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    additionalPatients.forEach((patient, index) => {
        const patientCard = createPatientCard(patient);
        patientsList.insertBefore(patientCard, loadMoreContainer);
        
        // Animate in
        setTimeout(() => {
            patientCard.classList.add('slide-up');
        }, index * 100);
    });
    
    showToast(`โหลดผู้ป่วยเพิ่ม ${additionalPatients.length} คน`, 'success');
}

// Create patient card element
function createPatientCard(patient) {
    const card = document.createElement('div');
    card.className = `patient-card ${patient.status}`;
    card.dataset.status = patient.status;
    
    const statusText = {
        'normal': '✅ ปกติ',
        'warning': '⚠️ เฝ้าระวัง', 
        'danger': '🚨 เสี่ยง'
    };
    
    card.innerHTML = `
        <div class="patient-avatar ${patient.status}">
            <span class="avatar-text">${patient.avatar}</span>
        </div>
        <div class="patient-info">
            <div class="patient-name">${patient.name}</div>
            <div class="patient-details">
                <span class="age">${patient.age} ปี</span>
                <span class="separator">•</span>
                <span class="bp">${patient.bp}</span>
                <span class="separator">•</span>
                <span class="glucose">${patient.glucose}</span>
            </div>
            <div class="patient-location">${patient.location}</div>
        </div>
        <div class="patient-status">
            <div class="status-badge ${patient.status}">${statusText[patient.status]}</div>
            <div class="last-update">เพิ่งเพิ่ม</div>
        </div>
    `;
    
    // Add click handler
    card.addEventListener('click', function() {
        const name = this.querySelector('.patient-name').textContent;
        const age = this.querySelector('.age').textContent;
        const bp = this.querySelector('.bp').textContent;
        const glucose = this.querySelector('.glucose').textContent;
        const location = this.querySelector('.patient-location').textContent;
        
        openPatientModal(name, age, bp, glucose, location);
    });
    
    return card;
}

// Open patient detail modal
function openPatientModal(name, age, bp, glucose, location) {
    const modal = document.getElementById('patientModal');
    const nameElement = document.getElementById('modalPatientName');
    const ageElement = document.getElementById('modalAge');
    const addressElement = document.getElementById('modalAddress');
    const bpElement = document.getElementById('modalBP');
    const glucoseElement = document.getElementById('modalGlucose');
    
    // Update modal content
    nameElement.textContent = name;
    ageElement.textContent = age;
    addressElement.textContent = location;
    bpElement.textContent = bp + ' mmHg';
    glucoseElement.textContent = glucose + ' mg/dL';
    
    // Show modal
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Setup action buttons
    setupModalActions(name);
}

// Close patient modal
function closePatientModal() {
    const modal = document.getElementById('patientModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Setup modal action buttons
function setupModalActions(patientName) {
    const actionBtns = document.querySelectorAll('.modal-content .action-btn');
    
    actionBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true)); // Remove old listeners
    });
    
    // Re-select after cloning
    const newActionBtns = document.querySelectorAll('.modal-content .action-btn');
    
    newActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            handlePatientAction(action, patientName);
        });
    });
}

// Handle patient actions
function handlePatientAction(action, patientName) {
    closePatientModal();
    
    switch(action) {
        case '📞 ติดต่อ':
            contactPatient(patientName);
            break;
        case '✏️ แก้ไข':
            editPatient(patientName);
            break;
        case '⚠️ ติดตาม':
            followUpPatient(patientName);
            break;
    }
}

// Contact patient
function contactPatient(name) {
    showToast(`กำลังติดต่อ ${name}`, 'info');
    
    // Simulate calling
    setTimeout(() => {
        if (confirm(`โทรหา ${name}?`)) {
            showToast('เริ่มการโทร...', 'success');
        }
    }, 1000);
}

// Edit patient
function editPatient(name) {
    showToast(`เปิดหน้าแก้ไขข้อมูล ${name}`, 'info');
    // In a real app, this would navigate to edit form
}

// Follow up patient
function followUpPatient(name) {
    showToast(`เพิ่ม ${name} ในรายการติดตาม`, 'warning');
    
    // Add visual indicator
    setTimeout(() => {
        showToast('เพิ่มในรายการติดตามแล้ว', 'success');
    }, 1500);
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '70px',
        left: '20px',
        right: '20px',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1002',
        transform: 'translateY(-100px)',
        transition: 'transform 0.3s ease',
        textAlign: 'center'
    });
    
    switch(type) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        default:
            toast.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Pull to refresh functionality
let pullToRefresh = {
    startY: 0,
    currentY: 0,
    threshold: 100,
    isRefreshing: false
};

document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
        pullToRefresh.startY = e.touches[0].clientY;
    }
});

document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && !pullToRefresh.isRefreshing) {
        pullToRefresh.currentY = e.touches[0].clientY;
        const pullDistance = pullToRefresh.currentY - pullToRefresh.startY;
        
        if (pullDistance > 0) {
            e.preventDefault();
            
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                const opacity = Math.min(pullDistance / pullToRefresh.threshold, 1);
                appContainer.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
                appContainer.style.opacity = 1 - opacity * 0.2;
            }
        }
    }
});

document.addEventListener('touchend', function(e) {
    if (window.scrollY === 0 && !pullToRefresh.isRefreshing) {
        const pullDistance = pullToRefresh.currentY - pullToRefresh.startY;
        const appContainer = document.querySelector('.app-container');
        
        if (pullDistance > pullToRefresh.threshold) {
            pullToRefresh.isRefreshing = true;
            
            if (appContainer) {
                appContainer.style.transition = 'all 0.3s ease';
                appContainer.style.transform = 'translateY(30px)';
            }
            
            setTimeout(() => {
                refreshPatientsList();
                pullToRefresh.isRefreshing = false;
                
                if (appContainer) {
                    appContainer.style.transform = '';
                    appContainer.style.opacity = '';
                    setTimeout(() => {
                        appContainer.style.transition = '';
                    }, 300);
                }
            }, 1500);
        } else {
            if (appContainer) {
                appContainer.style.transition = 'all 0.3s ease';
                appContainer.style.transform = '';
                appContainer.style.opacity = '';
                setTimeout(() => {
                    appContainer.style.transition = '';
                }, 300);
            }
        }
        
        pullToRefresh.startY = 0;
        pullToRefresh.currentY = 0;
    }
});

// Refresh patients list
function refreshPatientsList() {
    showToast('รีเฟรชรายการผู้ป่วย...', 'info');
    
    // Simulate refresh by updating last update times
    const lastUpdateElements = document.querySelectorAll('.last-update');
    lastUpdateElements.forEach(element => {
        const randomMinutes = Math.floor(Math.random() * 30) + 1;
        element.textContent = `${randomMinutes} นาทีที่แล้ว`;
    });
    
    setTimeout(() => {
        showToast('รีเฟรชเรียบร้อย', 'success');
    }, 1000);
}

// Swipe to delete functionality (optional)
function setupSwipeToDelete() {
    const patientCards = document.querySelectorAll('.patient-card');
    
    patientCards.forEach(card => {
        let startX = 0;
        let currentX = 0;
        let isSwiper = false;
        
        card.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isSwiper = true;
        });
        
        card.addEventListener('touchmove', function(e) {
            if (!isSwiper) return;
            
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50 && diffX > 0) {
                // Swipe left - show delete option
                this.style.transform = `translateX(-${Math.min(diffX, 80)}px)`;
                this.style.background = '#fee2e2';
            }
        });
        
        card.addEventListener('touchend', function() {
            if (isSwiper) {
                const diffX = startX - currentX;
                
                if (diffX > 80) {
                    // Show delete confirmation
                    const name = this.querySelector('.patient-name').textContent;
                    if (confirm(`ลบ ${name} จากรายการ?`)) {
                        this.style.transform = 'translateX(-100%)';
                        setTimeout(() => {
                            this.remove();
                            showToast('ลบรายการแล้ว', 'success');
                        }, 300);
                    } else {
                        this.style.transform = '';
                        this.style.background = '';
                    }
                } else {
                    this.style.transform = '';
                    this.style.background = '';
                }
            }
            
            isSwiper = false;
            startX = 0;
            currentX = 0;
        });
    });
}

// Sort functionality
function setupSortOptions() {
    const sortOptions = [
        { label: 'ชื่อ (ก-ฮ)', value: 'name-asc' },
        { label: 'ชื่อ (ฮ-ก)', value: 'name-desc' },
        { label: 'อายุ (น้อย-มาก)', value: 'age-asc' },
        { label: 'อายุ (มาก-น้อย)', value: 'age-desc' },
        { label: 'ความเสี่ยง', value: 'risk' },
        { label: 'อัปเดตล่าสุด', value: 'recent' }
    ];
    
    // Add sort button to header if needed
    // This would be implemented based on UI requirements
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    // setupSwipeToDelete(); // Uncomment if needed
    // setupSortOptions(); // Uncomment if needed
});

// Keyboard shortcuts for desktop testing
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePatientModal();
    }
    
    if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        document.querySelector('.search-btn').click();
    }
});

// Battery and network status monitoring
function monitorBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryInfo() {
                const level = Math.round(battery.level * 100);
                const batteryElements = document.querySelectorAll('.battery');
                
                batteryElements.forEach(element => {
                    let icon = '🔋';
                    if (level < 20) icon = '🪫';
                    element.textContent = `${icon} ${level}%`;
                });
            }
            
            battery.addEventListener('levelchange', updateBatteryInfo);
            updateBatteryInfo();
        });
    }
}

function handleNetworkStatus() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        const statusElements = document.querySelectorAll('.signal');
        
        statusElements.forEach(element => {
            element.textContent = isOnline ? '📶' : '📵';
        });
        
        if (!isOnline) {
            showToast('อุปกรณ์ออฟไลน์', 'warning');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Initialize monitoring
document.addEventListener('DOMContentLoaded', function() {
    monitorBattery();
    handleNetworkStatus();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .slide-down {
        animation: slideDown 0.3s ease-out;
    }
    
    .slide-up {
        animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .patient-card {
        transition: all 0.3s ease;
    }
    
    .patient-card:active {
        transform: scale(0.98);
    }
    
    .search-filter-bar {
        background: white;
        padding: 15px 20px;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .search-container {
        position: relative;
        margin-bottom: 15px;
    }
    
    .search-input {
        width: 100%;
        padding: 12px 45px 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 25px;
        font-size: 16px;
        background: #f9fafb;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #667eea;
        background: white;
    }
    
    .clear-search {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 16px;
        color: #9ca3af;
        display: none;
        cursor: pointer;
    }
    
    .filter-buttons {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 5px;
    }
    
    .filter-btn {
        padding: 8px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        background: white;
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn.active {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .filter-btn.normal.active {
        background: #10b981;
        border-color: #10b981;
    }
    
    .filter-btn.warning.active {
        background: #f59e0b;
        border-color: #f59e0b;
    }
    
    .filter-btn.danger.active {
        background: #ef4444;
        border-color: #ef4444;
    }
    
    .patient-stats {
        padding: 15px 20px;
        background: white;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .stats-row {
        display: flex;
        justify-content: space-around;
        gap: 15px;
    }
    
    .mini-stat {
        text-align: center;
        flex: 1;
        padding: 10px;
        border-radius: 12px;
    }
    
    .mini-stat.normal {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
    }
    
    .mini-stat.warning {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
    }
    
    .mini-stat.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
    }
    
    .mini-stat .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 4px;
    }
    
    .mini-stat .stat-text {
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .patients-list {
        padding: 10px 20px 20px 20px;
    }
    
    .patient-card {
        background: white;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border-left: 4px solid transparent;
        cursor: pointer;
    }
    
    .patient-card.normal {
        border-left-color: #10b981;
    }
    
    .patient-card.warning {
        border-left-color: #f59e0b;
    }
    
    .patient-card.danger {
        border-left-color: #ef4444;
    }
    
    .patient-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 1.2rem;
    }
    
    .patient-avatar.normal {
        background: #10b981;
    }
    
    .patient-avatar.warning {
        background: #f59e0b;
    }
    
    .patient-avatar.danger {
        background: #ef4444;
    }
    
    .patient-info {
        flex: 1;
    }
    
    .patient-name {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
    }
    
    .patient-details {
        font-size: 0.85rem;
        color: #6b7280;
        margin-bottom: 4px;
    }
    
    .separator {
        margin: 0 6px;
    }
    
    .patient-location {
        font-size: 0.8rem;
        color: #9ca3af;
    }
    
    .patient-status {
        text-align: right;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 4px;
        display: inline-block;
    }
    
    .status-badge.normal {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
    }
    
    .status-badge.warning {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
    }
    
    .status-badge.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
    }
    
    .last-update {
        font-size: 0.7rem;
        color: #9ca3af;
    }
    
    .load-more-container {
        text-align: center;
        padding: 20px;
    }
    
    .load-more-btn {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .load-more-btn:hover {
        background: #e5e7eb;
    }
    
    .load-more-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);