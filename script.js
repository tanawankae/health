// Mobile Health Dashboard - Main Script
// Handles home page functionality and mini chart

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    updateTime();
    createMiniChart();
    
    // Update time every minute
    setInterval(updateTime, 60000);
});

// Initialize dashboard with sample data
function initializeDashboard() {
    // Sample patient data for mockup
    const patients = [
        {name: "นางสาวสมใจ ใจดี", age: 45, systolic: 120, diastolic: 80, glucose: 95},
        {name: "นายวิชัย เก่งกาจ", age: 52, systolic: 140, diastolic: 90, glucose: 110},
        {name: "นางประภา สุขใส", age: 38, systolic: 110, diastolic: 70, glucose: 85},
        {name: "นายสมชาย ดีมาก", age: 65, systolic: 160, diastolic: 100, glucose: 180},
        {name: "นางสาวมาลี ใจงาม", age: 29, systolic: 115, diastolic: 75, glucose: 90},
        {name: "นายอภิชัย แข็งแรง", age: 48, systolic: 135, diastolic: 85, glucose: 125},
        {name: "นางสุดา เบิกบาน", age: 41, systolic: 125, diastolic: 82, glucose: 100},
        {name: "นายกิตติ ร่าเริง", age: 56, systolic: 150, diastolic: 95, glucose: 145},
        {name: "นางสาววิไล สดใส", age: 33, systolic: 108, diastolic: 68, glucose: 88},
        {name: "นายปิยะ เฉลียวฉลาด", age: 44, systolic: 132, diastolic: 88, glucose: 105},
        {name: "นางจิราพร สวยงาม", age: 39, systolic: 118, diastolic: 78, glucose: 92},
        {name: "นายสุรชัย กล้าหาญ", age: 61, systolic: 155, diastolic: 98, glucose: 165},
        {name: "นางสาวพิมพ์ใจ น่ารัก", age: 27, systolic: 112, diastolic: 72, glucose: 82},
        {name: "นายธนกร มั่นคง", age: 50, systolic: 142, diastolic: 92, glucose: 130},
        {name: "นางรัศมี แจ่มใส", age: 46, systolic: 128, diastolic: 84, glucose: 98},
        {name: "นายชาคริต ใจกว้าง", age: 35, systolic: 122, diastolic: 80, glucose: 95},
        {name: "นางสาวศิริกาญจน์ อ่อนหวาน", age: 31, systolic: 116, diastolic: 76, glucose: 87},
        {name: "นายอนันต์ มีชัย", age: 58, systolic: 148, diastolic: 94, glucose: 155},
        {name: "นางภาวนา เรืองรอง", age: 42, systolic: 126, diastolic: 83, glucose: 102},
        {name: "นายประดิษฐ์ เจริญรุ่งเรือง", age: 54, systolic: 138, diastolic: 89, glucose: 120}
    ];

    updateDashboardStats(patients);
    animateCounters();
}

// Update dashboard statistics
function updateDashboardStats(patients) {
    let normalCount = 0;
    let warningCount = 0;
    let dangerCount = 0;

    patients.forEach(patient => {
        const bpStatus = getBloodPressureStatus(patient.systolic, patient.diastolic);
        const glucoseStatus = getGlucoseStatus(patient.glucose);
        
        if (bpStatus === 'danger' || glucoseStatus === 'danger') {
            dangerCount++;
        } else if (bpStatus === 'warning' || glucoseStatus === 'warning') {
            warningCount++;
        } else {
            normalCount++;
        }
    });

    // Update elements with animation
    const normalElement = document.getElementById('normalCount');
    const warningElement = document.getElementById('warningCount');
    const dangerElement = document.getElementById('dangerCount');
    const totalElement = document.getElementById('totalCount');

    if (normalElement) animateNumber(normalElement, normalCount);
    if (warningElement) animateNumber(warningElement, warningCount);
    if (dangerElement) animateNumber(dangerElement, dangerCount);
    if (totalElement) animateNumber(totalElement, patients.length);
}

// Animate number counting
function animateNumber(element, target) {
    const start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Animate counter elements on load
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-up');
        }, index * 100);
    });
}

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

// Create mini risk chart for home page
function createMiniChart() {
    const canvas = document.getElementById('miniRiskChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ปกติ', 'เฝ้าระวัง', 'เสี่ยง'],
            datasets: [{
                data: [8, 7, 5],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b', 
                    '#ef4444'
                ],
                borderWidth: 0,
                cutout: '65%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500
            }
        }
    });
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

// Touch interactions for cards
document.addEventListener('DOMContentLoaded', function() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        card.addEventListener('touchcancel', function() {
            this.style.transform = '';
        });
    });
});

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
            
            // Visual feedback for pull to refresh
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
            // Trigger refresh
            pullToRefresh.isRefreshing = true;
            
            if (appContainer) {
                appContainer.style.transition = 'all 0.3s ease';
                appContainer.style.transform = 'translateY(30px)';
            }
            
            // Simulate refresh
            setTimeout(() => {
                initializeDashboard();
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
            // Reset position
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

// Activity simulation for demo
function simulateActivity() {
    const activities = [
        { icon: '👤', title: 'เพิ่มผู้ป่วยใหม่', desc: 'นางสาวมาลี ใจงาม', time: '5 นาทีที่แล้ว', status: 'normal' },
        { icon: '⚠️', title: 'ตรวจพบความเสี่ยงสูง', desc: 'นายสมชาย ดีมาก', time: '1 ชั่วโมงที่แล้ว', status: 'danger' },
        { icon: '📊', title: 'สร้างรายงานรายสัปดาห์', desc: 'รายงานสัปดาห์ที่ 25', time: '2 ชั่วโมงที่แล้ว', status: '' }
    ];
    
    // Update activity times periodically
    setInterval(() => {
        activities.forEach((activity, index) => {
            const time = Math.floor(Math.random() * 60) + 1;
            activity.time = `${time} นาทีที่แล้ว`;
        });
    }, 30000);
}

// Initialize activity simulation
document.addEventListener('DOMContentLoaded', simulateActivity);

// Haptic feedback for supported devices
function hapticFeedback(type = 'light') {
    if (navigator.vibrate) {
        switch(type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(50);
                break;
            case 'heavy':
                navigator.vibrate([100, 50, 100]);
                break;
        }
    }
}

// Add haptic feedback to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .action-card, .nav-item');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => hapticFeedback('light'));
    });
});

// Smooth scroll for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Service Worker registration for PWA capabilities (commented out for development)
// Uncomment and create sw.js file if you want PWA features
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// Dark mode detection and handling
function handleDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme(e) {
        const isDark = e.matches;
        document.body.classList.toggle('dark-mode', isDark);
    }
    
    prefersDark.addListener(updateTheme);
    updateTheme(prefersDark);
}

// Initialize dark mode handling
document.addEventListener('DOMContentLoaded', handleDarkMode);

// Battery status monitoring (if supported)
function monitorBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryInfo() {
                const level = Math.round(battery.level * 100);
                const batteryElements = document.querySelectorAll('.battery');
                
                batteryElements.forEach(element => {
                    let icon = '🔋';
                    if (level < 20) icon = '🪫';
                    else if (level < 50) icon = '🔋';
                    else icon = '🔋';
                    
                    element.textContent = `${icon} ${level}%`;
                });
            }
            
            battery.addEventListener('levelchange', updateBatteryInfo);
            battery.addEventListener('chargingchange', updateBatteryInfo);
            updateBatteryInfo();
        });
    }
}

// Initialize battery monitoring
document.addEventListener('DOMContentLoaded', monitorBattery);

// Network status handling
function handleNetworkStatus() {
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        const statusElements = document.querySelectorAll('.signal');
        
        statusElements.forEach(element => {
            element.textContent = isOnline ? '📶' : '📵';
        });
        
        if (!isOnline) {
            // Show offline message
            showToast('อุปกรณ์ออฟไลน์', 'warning');
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
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
    
    // Set background color based on type
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
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateY(-100px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// Initialize network status handling
document.addEventListener('DOMContentLoaded', handleNetworkStatus);