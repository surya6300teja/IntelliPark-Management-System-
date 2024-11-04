const API_URL = 'http://localhost:3000/api';
let isAdminAuthenticated = false;

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user logged in as admin from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    isAdminAuthenticated = urlParams.get('admin') === 'true';

    // Show initial page based on admin status
    if (isAdminAuthenticated) {
        showPage('reportPage');
    } else {
        showPage('dashboardPage');
    }

    // Add click event listeners to all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Check if trying to access reports
            if (pageId === 'reportPage' && !isAdminAuthenticated) {
                // Hide all pages first
                document.querySelectorAll('.page-content').forEach(page => {
                    page.classList.add('hidden');
                });
                showAdminVerification();
            } else {
                showPage(pageId);
            }
        });
    });

    // Admin verification form handler
    document.getElementById('adminVerifyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === 'admin' && password === '1234') {
            isAdminAuthenticated = true;
            hideAdminVerification();
            showPage('reportPage');
        } else {
            alert('Invalid admin credentials');
        }

        // Clear the form
        this.reset();
    });

    // Logout button handler
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});

// Function to show admin verification modal
function showAdminVerification() {
    document.getElementById('adminVerifyModal').style.display = 'block';
}

// Function to hide admin verification modal
function hideAdminVerification() {
    document.getElementById('adminVerifyModal').style.display = 'none';
}

// Function to show page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.remove('hidden');
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // Load page-specific data
    switch(pageId) {
        case 'dashboardPage':
            loadDashboardData();
            break;
        case 'slotBookingPage':
            initializeSlotBooking();
            break;
        case 'feedbackPage':
            initializeFeedbackForm();
            break;
        case 'reportPage':
            loadReportData();
            break;
    }
}