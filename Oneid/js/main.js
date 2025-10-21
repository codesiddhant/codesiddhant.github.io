// ============================================
// RAuth OneID - Main JavaScript
// ============================================

// Application State
const appState = {
    currentScreen: 'screen-onboarding',
    currentCarouselSlide: 0,
    currentTab: 'approvals',
    userData: {
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        phone: '',
        location: ''
    },
    darkMode: false
};

// ============================================
// Utility Functions
// ============================================

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active', 'slide-left');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 50);
        appState.currentScreen = screenId;
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 16px 24px;
        background: ${type === 'success' ? '#00B894' : '#E74C3C'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Onboarding & Carousel
// ============================================

function initCarousel() {
    const indicators = document.querySelectorAll('.indicator');
    const slides = document.querySelectorAll('.carousel-slide');

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            setCarouselSlide(index);
        });
    });

    // Auto-advance carousel
    setInterval(() => {
        appState.currentCarouselSlide = (appState.currentCarouselSlide + 1) % slides.length;
        setCarouselSlide(appState.currentCarouselSlide);
    }, 4000);
}

function setCarouselSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });

    appState.currentCarouselSlide = index;
}

// ============================================
// Phone Input & Verification
// ============================================

document.getElementById('btnNext')?.addEventListener('click', () => {
    const phoneInput = document.getElementById('phoneInput');
    const phone = phoneInput.value.trim();

    if (phone.length !== 10) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
    }

    appState.userData.phone = phone;
    showModal('verificationModal');
});

document.getElementById('btnWhatsApp')?.addEventListener('click', () => {
    const phone = appState.userData.phone;
    const message = `RAuth OneID Verification Token: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    
    showToast('Opening WhatsApp...', 'success');
    setTimeout(() => {
        // Simulate verification success
        hideModal('verificationModal');
        showToast('Verification successful!', 'success');
        setTimeout(() => showScreen('screen-basic-info'), 1000);
    }, 2000);
});

document.getElementById('btnSMS')?.addEventListener('click', () => {
    const phone = appState.userData.phone;
    const message = `RAuth OneID Verification Token: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    
    showToast('Opening SMS...', 'success');
    setTimeout(() => {
        // Simulate verification success
        hideModal('verificationModal');
        showToast('Verification successful!', 'success');
        setTimeout(() => showScreen('screen-basic-info'), 1000);
    }, 2000);
});

// Close modals on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.parentElement.classList.remove('active');
        }
    });
});

// ============================================
// Basic Info Form
// ============================================

// Gender selector
document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        appState.userData.gender = btn.dataset.value;
    });
});

document.getElementById('btnBasicInfoNext')?.addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const gender = appState.userData.gender;
    const dob = document.getElementById('dob').value;

    if (!firstName || !lastName || !gender || !dob) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    appState.userData.firstName = firstName;
    appState.userData.lastName = lastName;
    appState.userData.dob = dob;

    // Update profile with user data
    document.getElementById('profileName').textContent = `${firstName} ${lastName}`;
    document.getElementById('profilePhone').textContent = `+91 ${appState.userData.phone}`;

    showScreen('screen-location');
});

// ============================================
// Location Permission
// ============================================

document.getElementById('btnAllowLocation')?.addEventListener('click', () => {
    showToast('Location access granted', 'success');
    appState.userData.location = 'Mumbai, India'; // Simulated
    setTimeout(() => showScreen('screen-home'), 500);
});

document.getElementById('btnSkipLocation')?.addEventListener('click', () => {
    showToast('You can enable location later in settings', 'success');
    setTimeout(() => showScreen('screen-home'), 500);
});

// ============================================
// Home Dashboard - Tabs
// ============================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
        
        appState.currentTab = tabName;
    });
});

// ============================================
// Approval Cards
// ============================================

// Handle approval card clicks to show modal
document.querySelectorAll('.approval-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't trigger if clicking action buttons
        if (e.target.closest('.approval-actions')) return;
        
        const appName = card.querySelector('h4').textContent;
        const appType = card.querySelector('.approval-type').textContent;
        const location = card.querySelector('.approval-meta span:last-child').textContent;
        const device = card.querySelector('.approval-device span:last-child').textContent;
        const iconBg = card.querySelector('.app-icon').style.background;
        
        // Update modal
        document.getElementById('modalAppName').textContent = appName;
        document.getElementById('modalDescription').textContent = 
            `${appName} is requesting ${appType.toLowerCase()}. Do you want to approve this request?`;
        document.getElementById('modalLocation').textContent = location.split('•')[0].trim();
        document.getElementById('modalDevice').textContent = device;
        document.getElementById('modalTime').textContent = location.split('•')[1]?.trim() || 'Just now';
        document.getElementById('modalAppIcon').style.background = iconBg;
        
        // Store current card for later removal
        appState.currentApprovalCard = card;
        
        showModal('approvalModal');
    });
});

// Quick approve/deny buttons on cards
document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.approval-card');
        const appName = card.querySelector('h4').textContent;
        
        card.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            card.remove();
            showToast(`${appName} request approved`, 'success');
        }, 300);
    });
});

document.querySelectorAll('.btn-deny').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.approval-card');
        const appName = card.querySelector('h4').textContent;
        
        card.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
            card.remove();
            showToast(`${appName} request denied`, 'error');
        }, 300);
    });
});

// Modal approve/deny buttons
document.getElementById('btnApproveModal')?.addEventListener('click', () => {
    const appName = document.getElementById('modalAppName').textContent;
    const card = appState.currentApprovalCard;
    
    hideModal('approvalModal');
    
    if (card) {
        card.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            card.remove();
            showToast(`${appName} request approved`, 'success');
        }, 300);
    }
});

document.getElementById('btnDenyModal')?.addEventListener('click', () => {
    const appName = document.getElementById('modalAppName').textContent;
    const card = appState.currentApprovalCard;
    
    hideModal('approvalModal');
    
    if (card) {
        card.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
            card.remove();
            showToast(`${appName} request denied`, 'error');
        }, 300);
    }
});

// ============================================
// My Apps - App Details Navigation
// ============================================

document.querySelectorAll('.app-item').forEach(item => {
    item.addEventListener('click', () => {
        const appName = item.querySelector('h4').textContent;
        const appIcon = item.querySelector('.app-icon');
        const iconBg = appIcon.style.background;
        const iconClass = appIcon.querySelector('.material-symbols-rounded').textContent;
        
        // Update app details screen
        document.getElementById('appDetailsTitle').textContent = appName;
        document.getElementById('appDetailsName').textContent = appName;
        document.getElementById('appDetailsIcon').style.background = iconBg;
        document.getElementById('appDetailsIcon').querySelector('.material-symbols-rounded').textContent = iconClass;
        
        showScreen('screen-app-details');
    });
});

// ============================================
// Navigation - Back Buttons
// ============================================

document.getElementById('btnBackFromAppDetails')?.addEventListener('click', () => {
    showScreen('screen-home');
});

document.getElementById('btnBackFromProfile')?.addEventListener('click', () => {
    showScreen('screen-home');
});

document.getElementById('btnBackFromKYC')?.addEventListener('click', () => {
    showScreen('screen-profile');
});

document.getElementById('btnBackFromInfo')?.addEventListener('click', () => {
    showScreen('screen-home');
    document.getElementById('sidebar').classList.remove('active');
});

// ============================================
// Profile Navigation
// ============================================

document.getElementById('btnProfile')?.addEventListener('click', () => {
    showScreen('screen-profile');
});

document.getElementById('btnManageKYC')?.addEventListener('click', () => {
    showScreen('screen-kyc');
});

document.getElementById('btnLogout')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...', 'success');
        setTimeout(() => {
            // Reset state
            appState.userData = {
                firstName: '',
                lastName: '',
                gender: '',
                dob: '',
                phone: '',
                location: ''
            };
            showScreen('screen-onboarding');
        }, 1000);
    }
});

// ============================================
// Session Management
// ============================================

document.querySelectorAll('.btn-revoke').forEach(btn => {
    btn.addEventListener('click', () => {
        if (confirm('Are you sure you want to revoke this session?')) {
            const card = btn.closest('.session-card');
            card.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                card.remove();
                showToast('Session revoked successfully', 'success');
            }, 300);
        }
    });
});

document.getElementById('btnRevokeAll')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to revoke all sessions? You will need to login again on all devices.')) {
        const sessionsList = document.getElementById('sessionsList');
        sessionsList.style.opacity = '0';
        setTimeout(() => {
            sessionsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No active sessions</p>';
            sessionsList.style.opacity = '1';
            showToast('All sessions revoked', 'success');
        }, 300);
    }
});

// ============================================
// KYC Document Management
// ============================================

document.querySelectorAll('.btn-upload').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.document-card');
        const docName = card.querySelector('h4').textContent;
        
        // Simulate file upload
        showToast(`Uploading ${docName}...`, 'success');
        
        setTimeout(() => {
            card.classList.remove('upload');
            card.classList.add('pending');
            card.querySelector('.document-content p').textContent = 'Under review';
            card.querySelector('.status-icon').textContent = 'pending';
            btn.remove();
            
            showToast(`${docName} uploaded successfully`, 'success');
        }, 1500);
    });
});

document.getElementById('btnAddDocument')?.addEventListener('click', () => {
    showToast('File picker opening...', 'success');
});

document.getElementById('btnSubmitVerification')?.addEventListener('click', () => {
    showToast('Verification submitted for review', 'success');
});

// ============================================
// Sidebar Menu
// ============================================

document.getElementById('btnMenu')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('active');
});

document.getElementById('btnCloseSidebar')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('active');
});

// Menu items navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const infoType = item.dataset.info;
        
        // Hide sidebar
        document.getElementById('sidebar').classList.remove('active');
        
        // Load info content
        loadInfoContent(infoType);
        
        // Show info screen
        showScreen('screen-info');
    });
});

function loadInfoContent(type) {
    const infoContainer = document.getElementById('infoContainer');
    const contentTemplate = document.getElementById(`${type}-content`);
    
    if (contentTemplate) {
        infoContainer.innerHTML = contentTemplate.innerHTML;
        
        // Update title
        const titles = {
            'how-it-works': 'How OneID Works',
            'privacy': 'Privacy Policy',
            'pre-kyc': 'What is Pre-KYC?',
            'contact': 'Contact Us',
            'settings': 'App Settings'
        };
        document.getElementById('infoTitle').textContent = titles[type] || 'Info';
        
        // Bind settings dark mode toggle
        if (type === 'settings') {
            const darkModeToggle = document.getElementById('settingsDarkMode');
            if (darkModeToggle) {
                darkModeToggle.checked = appState.darkMode;
                darkModeToggle.addEventListener('change', () => {
                    toggleDarkMode();
                });
            }
        }
    }
}

// ============================================
// Dark Mode
// ============================================

function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    document.body.classList.toggle('dark-mode', appState.darkMode);
    localStorage.setItem('darkMode', appState.darkMode);
    
    // Update settings toggle if on settings page
    const settingsToggle = document.getElementById('settingsDarkMode');
    if (settingsToggle) {
        settingsToggle.checked = appState.darkMode;
    }
}

document.getElementById('darkModeToggle')?.addEventListener('click', toggleDarkMode);

// Load dark mode preference
window.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        appState.darkMode = true;
        document.body.classList.add('dark-mode');
    }
});

// ============================================
// Tablet Layout Detection
// ============================================

function checkTabletLayout() {
    const screenHome = document.getElementById('screen-home');
    if (window.innerWidth >= 1024) {
        screenHome?.classList.add('tablet-mode');
    } else {
        screenHome?.classList.remove('tablet-mode');
    }
}

window.addEventListener('resize', checkTabletLayout);
window.addEventListener('DOMContentLoaded', checkTabletLayout);

// ============================================
// Animations for dynamic content
// ============================================

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    console.log('RAuth OneID App Initialized');
    console.log('Current Screen:', appState.currentScreen);
});