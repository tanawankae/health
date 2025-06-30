// Mobile Health Dashboard - Analytics Page
// Handles charts and analytics functionality

document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    initializeCharts();
    
    // Update time every minute
    setInterval(updateTime, 60000);
    
    // Setup quick actions
    setupQuickActions();
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

// Initialize all charts
function initializeCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    
    createRiskChart();
    createAgeChart();
    createBPTrendChart();
}

// Create risk distribution chart
function createRiskChart() {
    const ctx = document.getElementById('riskChart');
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
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
                borderWidth: 3,
                borderColor: '#ffffff',
                cutout: '60%'
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return `${context.label}: ${context.parsed} คน (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1500,
                easing: 'easeOutCubic'
            }
        }
    });
}

// Create age distribution chart
function createAgeChart() {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['20-30', '31-40', '41-50', '51-60', '60+'],
            datasets: [{
                label: 'จำนวนคน',
                data: [2, 4, 6, 5, 3],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} คน`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#6b7280',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutCubic'
            }
        }
    });
}

// Create blood pressure trend chart
function createBPTrendChart() {
    const ctx = document.getElementById('bpTrendChart');
    if (!ctx) return;
    
    // Sample trend data for the last 7 days
    const labels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
    const systolicData = [125, 128, 130, 127, 132, 129, 128];
    const diastolicData = [80, 82, 85, 81, 88, 83, 82];
    
    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ความดันบน',
                data: systolicData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'ความดันล่าง',
                data: diastolicData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    cornerRadius: 8,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} mmHg`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 160,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + ' mmHg';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeOutCubic'
            }
        }
    });
}

// Setup quick actions
function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.quick-action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            handleQuickAction(action);
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
}

// Handle quick actions
function handleQuickAction(action) {
    switch(action) {
        case 'ส่งออกรายงาน':
            exportReport();
            break;
        case 'กรองข้อมูล':
            openFilterModal();
            break;
        case 'แชร์ข้อมูล':
            shareData();
            break;
        case 'รีเฟรช':
            refreshData();
            break;
        default:
            showToast(`ฟีเจอร์ ${action} กำลังพัฒนา`, 'info');
    }
}

// Export report functionality
function exportReport() {
    showToast('กำลังสร้างรายงาน...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showToast('ส่งออกรายงานเรียบร้อย', 'success');
    }, 2000);
}

// Open filter modal
function openFilterModal() {
    showToast('เปิดตัวกรองข้อมูล', 'info');
}

// Share data functionality
function shareData() {
    if (navigator.share) {
        navigator.share({
            title: 'Health Dashboard Report',
            text: 'รายงานสุขภาพจาก Health Dashboard',
            url: window.location.href
        }).then(() => {
            showToast('แชร์ข้อมูลเรียบร้อย', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Fallback share for browsers that don't support Web Share API
function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('คัดลอกลิงก์เรียบร้อย', 'success');
    }).catch(() => {
        showToast('ไม่สามารถแชร์ได้', 'error');
    });
}

// Refresh data
function refreshData() {
    showToast('กำลังรีเฟรชข้อมูล...', 'info');
    
    // Add loading animation to charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.style.opacity = '0.5';
    });
    
    // Simulate data refresh
    setTimeout(() => {
        chartContainers.forEach(container => {
            container.style.opacity = '1';
        });
        
        // Re-initialize charts with new data
        initializeCharts();
        showToast('รีเฟรชข้อมูลเรียบร้อย', 'success');
    }, 1500);
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
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Period selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const periodSelect = document.querySelector('.period-select');
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            const period = this.value;
            showToast(`เปลี่ยนช่วงเวลาเป็น: ${period}`, 'info');
            
            // Here you would normally update charts with new data
            setTimeout(() => {
                initializeCharts();
            }, 500);
        });
    }
});

// Insight card interactions
document.addEventListener('DOMContentLoaded', function() {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showToast(`เปิดรายละเอียด: ${title}`, 'info');
        });
    });
    
    // Action buttons in insight cards
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showToast('เปิดรายละเอียดผู้ป่วยเสี่ยงสูง', 'info');
        });
    });
});

// Area analysis interactions
document.addEventListener('DOMContentLoaded', function() {
    const areaItems = document.querySelectorAll('.area-item');
    
    areaItems.forEach(item => {
        item.addEventListener('click', function() {
            const areaName = this.querySelector('.area-name').textContent;
            showToast(`ดูรายละเอียด: ${areaName}`, 'info');
        });
    });
});

// Scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elements = document.querySelectorAll('.chart-container, .insight-card, .area-item');
    elements.forEach(el => observer.observe(el));
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', observeElements);

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .chart-container,
    .insight-card,
    .area-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Battery and network status (same as main script)
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
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Initialize status monitoring
document.addEventListener('DOMContentLoaded', function() {
    monitorBattery();
    handleNetworkStatus();
});