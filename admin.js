document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api';
    
    // UI Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    
    const navLinks = document.querySelectorAll('.nav-links a[data-target]');
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    
    const spotlightsTableBody = document.getElementById('spotlights-table-body');
    const storiesTableBody = document.getElementById('stories-table-body');
    
    const addSpotlightBtn = document.getElementById('add-spotlight-btn');
    const addStoryBtn = document.getElementById('add-story-btn');
    const addSpotlightModal = document.getElementById('add-spotlight-modal');
    const addStoryModal = document.getElementById('add-story-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    
    const addSpotlightForm = document.getElementById('add-spotlight-form');
    const addStoryForm = document.getElementById('add-story-form');

    // Authentication Check
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
        loadSpotlights();
        loadStories();
    }

    // Login Handle
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('adminToken', data.token);
                loginError.classList.add('hide');
                showDashboard();
                loadAnalytics();
                loadSpotlights();
                loadStories();
            } else {
                loginError.classList.remove('hide');
            }
        } catch (err) {
            console.error(err);
            loginError.classList.remove('hide');
        }
    });

    // Logout Handle
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        loginScreen.classList.remove('hide');
        dashboardScreen.classList.add('hide');
    });

    function showDashboard() {
        loginScreen.classList.add('hide');
        dashboardScreen.classList.remove('hide');
    }

    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        };
    }

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            dashboardViews.forEach(v => v.classList.add('hide'));
            document.getElementById(targetId).classList.remove('hide');
        });
    });

    // Modals
    addSpotlightBtn.addEventListener('click', () => addSpotlightModal.classList.remove('hide'));
    addStoryBtn.addEventListener('click', () => addStoryModal.classList.remove('hide'));
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addSpotlightModal.classList.add('hide');
            addStoryModal.classList.add('hide');
        });
    });

    // Data Loaders
    async function loadAnalytics() {
        try {
            const res = await fetch(`${API_BASE}/analytics`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                document.getElementById('stat-visits-today').innerText = data.visitsToday;
                document.getElementById('stat-visits-month').innerText = data.visitsMonth;
                document.getElementById('stat-total-leads').innerText = data.totalLeads;
                
                const leadsTableBody = document.getElementById('leads-table-body');
                if (leadsTableBody) {
                    leadsTableBody.innerHTML = '';
                    data.leads.forEach(lead => {
                        const tr = document.createElement('tr');
                        const dateStr = new Date(lead.submitted_at).toLocaleDateString();
                        tr.innerHTML = `
                            <td>${dateStr}</td>
                            <td><strong>${lead.name}</strong></td>
                            <td>${lead.email}</td>
                            <td>${lead.phone}</td>
                            <td>${lead.visa_status} / ${lead.target_role}</td>
                        `;
                        leadsTableBody.appendChild(tr);
                    });
                }
            }
        } catch (err) { console.error("Error loading analytics:", err); }
    }

    async function loadSpotlights() {
        try {
            const res = await fetch(`${API_BASE}/spotlights`);
            const data = await res.json();
            spotlightsTableBody.innerHTML = '';
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td>${item.company}</td>
                    <td>${item.location}</td>
                    <td><span style="color:#16A34A;font-weight:bold;">${item.package}</span></td>
                    <td><button class="btn btn-danger" onclick="deleteSpotlight(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
                `;
                spotlightsTableBody.appendChild(tr);
            });
        } catch (err) { console.error(err); }
    }

    async function loadStories() {
        try {
            const res = await fetch(`${API_BASE}/stories`);
            const data = await res.json();
            storiesTableBody.innerHTML = '';
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td>${item.role}</td>
                    <td>${item.company}</td>
                    <td><button class="btn btn-danger" onclick="deleteStory(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
                `;
                storiesTableBody.appendChild(tr);
            });
        } catch (err) { console.error(err); }
    }

    // Form Submissions
    addSpotlightForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('sp-name').value,
            company: document.getElementById('sp-company').value,
            company_logo: document.getElementById('sp-company-logo').value,
            slogan: document.getElementById('sp-slogan').value,
            location: document.getElementById('sp-location').value,
            package: document.getElementById('sp-package').value,
            bg_image: document.getElementById('sp-bg-image').value,
            data_id: document.getElementById('sp-data-id').value
        };
        
        try {
            await fetch(`${API_BASE}/spotlights`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            addSpotlightModal.classList.add('hide');
            addSpotlightForm.reset();
            loadSpotlights();
        } catch(err) { console.error(err); }
    });

    addStoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('st-name').value,
            role: document.getElementById('st-role').value,
            company: document.getElementById('st-company').value,
            quote: document.getElementById('st-quote').value,
            initials: document.getElementById('st-initials').value,
            color_class: document.getElementById('st-color').value
        };
        
        try {
            await fetch(`${API_BASE}/stories`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            addStoryModal.classList.add('hide');
            addStoryForm.reset();
            loadStories();
        } catch(err) { console.error(err); }
    });

    // Global Delete Functions
    window.deleteSpotlight = async function(id) {
        if(confirm('Are you sure you want to delete this spotlight?')) {
            await fetch(`${API_BASE}/spotlights/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            loadSpotlights();
        }
    }

    window.deleteStory = async function(id) {
        if(confirm('Are you sure you want to delete this story?')) {
            await fetch(`${API_BASE}/stories/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            loadStories();
        }
    }
});
