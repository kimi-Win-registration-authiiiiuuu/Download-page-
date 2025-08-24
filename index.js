// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUC9dI7I6ssJyj9a6MxNwt2UPlYvO8Eyk",
    authDomain: "kimiapifirebase.firebaseapp.com",
    databaseURL: "https://kimiapifirebase-default-rtdb.firebaseio.com",
    projectId: "kimiapifirebase",
    storageBucket: "kimiapifirebase.firebasestorage.app",
    messagingSenderId: "982417347295",
    appId: "1:982417347295:web:58a63f7eb9a49e6dc9cf6a",
    measurementId: "G-KXZYPV6R1G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const database = firebase.database();

// Function to get device information
function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: screen.width,
        screenHeight: screen.height,
        cookieEnabled: navigator.cookieEnabled,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date: new Date().toISOString()
    };
}

// Function to generate a unique ID for the visitor
function generateVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
}

// Track page view
function trackPageView() {
    const visitorId = generateVisitorId();
    const deviceInfo = getDeviceInfo();
    
    analytics.logEvent('page_view', {
        visitor_id: visitorId,
        ...deviceInfo
    });
    
    // Store visit in database
    const visitData = {
        visitorId: visitorId,
        type: 'page_visit',
        ...deviceInfo
    };
    
    database.ref('visits/').push(visitData);
    
    // Update stats (function remains but UI is hidden)
    updateStats();
}

// Track download button click
function trackDownloadButtonClick() {
    const visitorId = generateVisitorId();
    const deviceInfo = getDeviceInfo();
    
    analytics.logEvent('download_button_click', {
        visitor_id: visitorId,
        ...deviceInfo
    });
    
    // Store button click in database
    const clickData = {
        visitorId: visitorId,
        type: 'button_click',
        ...deviceInfo
    };
    
    database.ref('button_clicks/').push(clickData);
    
    // Initiate download
    window.location.href = 'https://apk.e-droid.net/apk/app3601702-6qc1pr.apk?v=4';
    
    // Track the actual download
    trackDownload();
}

// Track download
function trackDownload() {
    const visitorId = generateVisitorId();
    const deviceInfo = getDeviceInfo();
    
    analytics.logEvent('download', {
        visitor_id: visitorId,
        ...deviceInfo
    });
    
    // Store download in database
    const downloadData = {
        visitorId: visitorId,
        type: 'download',
        ...deviceInfo
    };
    
    database.ref('downloads/').push(downloadData);
}

// Update statistics (function remains but UI is hidden)
function updateStats() {
    const statsRef = database.ref('/');
    
    statsRef.once('value').then((snapshot) => {
        const visits = snapshot.child('visits').numChildren();
        const downloads = snapshot.child('downloads').numChildren();
        const buttonClicks = snapshot.child('button_clicks').numChildren();
        
        // Statistics are still being collected but not displayed
        console.log('Stats:', { visits, downloads, buttonClicks });
    });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Track initial page view
    trackPageView();
    
    // Add click event to download button
    document.getElementById('downloadButton').addEventListener('click', function(e) {
        e.preventDefault();
        trackDownloadButtonClick();
    });
    
    // Generate a random app icon color
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#673AB7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const appIcon = document.getElementById('appIcon');
    appIcon.style.backgroundColor = randomColor;
    
    // JS for "helpful" button actions
    document.querySelectorAll(".helpful-btns button").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.style.background = "#6ea0ff";
            btn.style.borderColor = "#6ea0ff";
        });
    });
});