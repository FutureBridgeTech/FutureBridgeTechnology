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

    // Global Chart Instances
    let monthChartInstance = null;
    let yearChartInstance = null;
    let dailyChartInstance = null;
    let sourceChartInstance = null;

    // Authentication Check
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
        loadAnalytics();
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
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.remove('hide');
                if (targetId === 'analytics-view') {
                    loadAnalytics();
                }
            }
        });
    });

    // Refresh Analytics Button
    const refreshAnalyticsBtn = document.getElementById('refresh-analytics-btn');
    if (refreshAnalyticsBtn) {
        refreshAnalyticsBtn.addEventListener('click', () => {
            refreshAnalyticsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Refreshing...';
            loadAnalytics().finally(() => {
                setTimeout(() => {
                    refreshAnalyticsBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh Data';
                }, 400);
            });
        });
    }

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
                
                // Update KPI Metric Cards
                const totalReachEl = document.getElementById('stat-total-reach');
                const visitsMonthEl = document.getElementById('stat-visits-month');
                const visitsYearEl = document.getElementById('stat-visits-year');
                const visitsTodayEl = document.getElementById('stat-visits-today');
                const totalLeadsEl = document.getElementById('stat-total-leads');

                if (totalReachEl) totalReachEl.innerText = (data.totalReach || 0).toLocaleString();
                if (visitsMonthEl) visitsMonthEl.innerText = (data.visitsMonth || 0).toLocaleString();
                if (visitsYearEl) visitsYearEl.innerText = (data.visitsYear || 0).toLocaleString();
                if (visitsTodayEl) visitsTodayEl.innerText = (data.visitsToday || 0).toLocaleString();
                if (totalLeadsEl) totalLeadsEl.innerText = (data.totalLeads || 0).toLocaleString();
                
                // Render Charts if Chart.js is loaded
                if (typeof Chart !== 'undefined') {
                    if (data.monthlyTraffic) renderMonthChart(data.monthlyTraffic);
                    if (data.yearlyTraffic) renderYearChart(data.yearlyTraffic);
                    if (data.dailyTraffic) renderDailyChart(data.dailyTraffic);
                    if (data.trafficSources) renderSourceChart(data.trafficSources);
                }

                // Render Leads Table
                const leadsTableBody = document.getElementById('leads-table-body');
                if (leadsTableBody) {
                    leadsTableBody.innerHTML = '';
                    if (!data.leads || data.leads.length === 0) {
                        leadsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No form submissions yet.</td></tr>`;
                    } else {
                        data.leads.forEach(lead => {
                            const tr = document.createElement('tr');
                            const dateStr = lead.submitted_at ? new Date(lead.submitted_at).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'Recently';
                            tr.innerHTML = `
                                <td><span style="font-size: 0.85rem; color: var(--text-muted);">${dateStr}</span></td>
                                <td><strong>${escapeHtml(lead.name)}</strong></td>
                                <td><a href="mailto:${escapeHtml(lead.email)}" style="color:#38bdf8; text-decoration:none;">${escapeHtml(lead.email)}</a></td>
                                <td>${escapeHtml(lead.phone || 'N/A')}</td>
                                <td><span style="background: rgba(56,189,248,0.12); color:#38bdf8; padding:3px 8px; border-radius:4px; font-size:0.82rem; font-weight:600;">${escapeHtml(lead.visa_status || 'Inquiry')}</span> <span style="color:var(--text-muted); font-size:0.85rem;">/ ${escapeHtml(lead.target_role || 'General')}</span></td>
                            `;
                            leadsTableBody.appendChild(tr);
                        });
                    }
                }
            }
        } catch (err) { console.error("Error loading analytics:", err); }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // --- Chart Rendering Functions ---
    function renderMonthChart(monthlyData) {
        const ctx = document.getElementById('monthTrafficChart');
        if (!ctx) return;
        if (monthChartInstance) monthChartInstance.destroy();

        const labels = monthlyData.map(d => d.label);
        const counts = monthlyData.map(d => d.count);

        monthChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Reach / Traffic',
                    data: counts,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.14)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#38bdf8',
                    pointBorderColor: '#ffffff',
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#38bdf8',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (ctx) => ` Traffic Reach: ${ctx.raw.toLocaleString()} visitors`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
                    }
                }
            }
        });
    }

    function renderYearChart(yearlyData) {
        const ctx = document.getElementById('yearTrafficChart');
        if (!ctx) return;
        if (yearChartInstance) yearChartInstance.destroy();

        const labels = yearlyData.map(d => `Year ${d.year}`);
        const counts = yearlyData.map(d => d.count);

        yearChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Yearly Reach',
                    data: counts,
                    backgroundColor: ['#38bdf8', '#a855f7', '#34d399', '#fbbf24', '#f43f5e'],
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: 45
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#a855f7',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (ctx) => ` Yearly Visitors: ${ctx.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
                    }
                }
            }
        });
    }

    function renderDailyChart(dailyData) {
        const ctx = document.getElementById('dailyTrafficChart');
        if (!ctx) return;
        if (dailyChartInstance) dailyChartInstance.destroy();

        const labels = dailyData.map(d => d.date ? d.date.slice(5) : '');
        const counts = dailyData.map(d => d.count);

        dailyChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Reach',
                    data: counts,
                    borderColor: '#34d399',
                    backgroundColor: 'rgba(52, 211, 153, 0.12)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#34d399',
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 10 }, maxRotation: 45 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
                    }
                }
            }
        });
    }

    function renderSourceChart(sourcesData) {
        const ctx = document.getElementById('trafficSourceChart');
        if (!ctx) return;
        if (sourceChartInstance) sourceChartInstance.destroy();

        const labels = sourcesData.map(s => s.source);
        const values = sourcesData.map(s => s.percentage);
        const colors = sourcesData.map(s => s.color);

        sourceChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#cbd5e1',
                            font: { family: "'Inter', sans-serif", size: 11 },
                            padding: 14,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        bodyColor: '#f8fafc',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
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
