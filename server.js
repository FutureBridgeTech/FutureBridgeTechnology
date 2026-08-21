const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const SECRET_KEY = 'futurebridge_secret_key_123'; // In production, use env var

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root

// Database initialization
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// Initialize tables
db.serialize(() => {
    // Admins table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Spotlights table
    db.run(`CREATE TABLE IF NOT EXISTS spotlights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        company TEXT,
        company_logo TEXT,
        slogan TEXT,
        location TEXT,
        package TEXT,
        bg_image TEXT,
        data_id TEXT
    )`);

    // Success Stories table
    db.run(`CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        company TEXT,
        quote TEXT,
        initials TEXT,
        color_class TEXT
    )`);

    // Leads table
    db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        visa_status TEXT,
        target_role TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Visits table
    db.run(`CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE,
        count INTEGER DEFAULT 1
    )`);

    // Clean synthetic past visits (keep only fresh visits from this month onwards)
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // '2026-08'
    db.run('DELETE FROM visits WHERE date < ?', [`${currentMonthPrefix}-01`], (err) => {
        if (!err) console.log(`Cleaned historical synthetic visit data prior to ${currentMonthPrefix}-01.`);
    });

    // Seed admin if not exists
    db.get('SELECT * FROM admins WHERE username = ?', ['admin'], async (err, row) => {
        if (!row) {
            const hash = await bcrypt.hash('admin123', 10);
            db.run('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash]);
            console.log('Default admin created: admin / admin123');
        }
    });

    // Seed spotlights if empty
    db.get('SELECT COUNT(*) as count FROM spotlights', (err, row) => {
        if (row && row.count === 0) {
            const seedSpotlights = [
                ['Aman Verma', 'Microsoft', '<i class="fa-brands fa-microsoft text-cyan" style="margin-right: 6px;"></i> Microsoft', 'Land Big Tech via ATS optimization & system design mock prep.', 'USA', '$138,000', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', 'aman'],
                ['Ayesha Rashid', 'Axium Packaging', '<i class="fa-solid fa-box text-warning" style="margin-right: 6px;"></i> Axium', 'Transformed tight OPT timeline into 4 top engineering interviews.', 'USA', '$86,000', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'ayesha'],
                ['Rohan Mehta', 'Intel Corporation', '<i class="fa-solid fa-microchip text-info" style="margin-right: 6px;"></i> Intel', 'Direct pitch to hiring managers prior to STEM OPT expiration.', 'USA', '$118,000', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'rohan'],
                ['Hina Singh', 'Bank of America', '<i class="fa-solid fa-building-columns text-danger" style="margin-right: 6px;"></i> Bank of America', 'Converted CPT internship into full-time Day-1 sponsorship.', 'USA', '$105,000', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', 'hina']
            ];
            const stmt = db.prepare('INSERT INTO spotlights (name, company, company_logo, slogan, location, package, bg_image, data_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            seedSpotlights.forEach(s => stmt.run(s));
            stmt.finalize();
            console.log('Seed spotlights inserted.');
        }
    });

    // Seed stories if empty
    db.get('SELECT COUNT(*) as count FROM stories', (err, row) => {
        if (row && row.count === 0) {
            const seedStories = [
                ['Karthik Patel', 'Data Engineer', 'Cognizant', 'As an international student, finding H-1B sponsorship felt impossible. FutureBridge has a vast network of visa-friendly employers. They connected me directly with a Prime Vendor, and my H-1B petition was selected in the first lottery!', 'KP', 'bg-blue'],
                ['Jack Chen', 'Frontend Developer', 'Stripe', 'The mentor-led cohorts completely transformed how I handled systems design problems. The interview analytics dashboard showed exactly where I was rambling. Negotiated my base salary up from $110K to $135K!', 'JC', 'bg-purple'],
                ['Pooja Reddy', 'Data Scientist', 'Walmart', 'The peer networks at FutureBridge are unmatched. Being in a cohort of 10 Data Engineers and Scientists kept me accountable. Within 2 months, I landed my role at Walmart!', 'PR', 'bg-blue']
            ];
            const stmt = db.prepare('INSERT INTO stories (name, role, company, quote, initials, color_class) VALUES (?, ?, ?, ?, ?, ?)');
            seedStories.forEach(s => stmt.run(s));
            stmt.finalize();
            console.log('Seed stories inserted.');
        }
    });
});

// Middleware for auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Visitor tracking helper & auto middleware
function trackVisit(cb) {
    const today = new Date().toISOString().split('T')[0];
    db.run(
        'INSERT INTO visits (date, count) VALUES (?, 1) ON CONFLICT(date) DO UPDATE SET count = count + 1',
        [today],
        function (err) {
            if (cb) cb(err);
        }
    );
}

app.get(['/', '/index.html'], (req, res, next) => {
    trackVisit();
    next();
});

// --- API ROUTES ---

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM admins WHERE username = ?', [username], async (err, admin) => {
        if (err || !admin) return res.status(401).json({ error: 'Invalid credentials' });
        
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    });
});

// Spotlights API
app.get('/api/spotlights', (req, res) => {
    db.all('SELECT * FROM spotlights', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/spotlights', authenticateToken, (req, res) => {
    const { name, company, company_logo, slogan, location, package, bg_image, data_id } = req.body;
    db.run(
        'INSERT INTO spotlights (name, company, company_logo, slogan, location, package, bg_image, data_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, company, company_logo, slogan, location, package, bg_image, data_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/spotlights/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM spotlights WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Stories API
app.get('/api/stories', (req, res) => {
    db.all('SELECT * FROM stories', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/stories', authenticateToken, (req, res) => {
    const { name, role, company, quote, initials, color_class } = req.body;
    db.run(
        'INSERT INTO stories (name, role, company, quote, initials, color_class) VALUES (?, ?, ?, ?, ?, ?)',
        [name, role, company, quote, initials, color_class],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/stories/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM stories WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Analytics & Tracking API
app.post('/api/track-visit', (req, res) => {
    trackVisit((err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/leads', (req, res) => {
    const { name, email, phone, visa, role } = req.body;
    db.run(
        'INSERT INTO leads (name, email, phone, visa_status, target_role) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, visa, role],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, success: true });
        }
    );
});

app.get('/api/analytics', authenticateToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const monthPrefix = today.substring(0, 7);
    const yearPrefix = today.substring(0, 4);
    
    const qToday = "SELECT count FROM visits WHERE date = ?";
    const qMonth = "SELECT SUM(count) as total FROM visits WHERE date LIKE ?";
    const qYear = "SELECT SUM(count) as total FROM visits WHERE date LIKE ?";
    const qTotalReach = "SELECT SUM(count) as total FROM visits";
    const qLeadsCount = "SELECT COUNT(*) as count FROM leads";
    const qMonthlyBreakdown = `
        SELECT SUBSTR(date, 1, 7) as month, SUM(count) as count 
        FROM visits 
        GROUP BY SUBSTR(date, 1, 7) 
        ORDER BY month DESC 
        LIMIT 12
    `;
    const qYearlyBreakdown = `
        SELECT SUBSTR(date, 1, 4) as year, SUM(count) as count 
        FROM visits 
        GROUP BY SUBSTR(date, 1, 4) 
        ORDER BY year ASC
    `;
    const qDailyRecent = `
        SELECT date, count 
        FROM visits 
        ORDER BY date DESC 
        LIMIT 30
    `;
    const qLeads = "SELECT * FROM leads ORDER BY submitted_at DESC LIMIT 50";

    db.get(qToday, [today], (err, rowToday) => {
        db.get(qMonth, [`${monthPrefix}%`], (err, rowMonth) => {
            db.get(qYear, [`${yearPrefix}%`], (err, rowYear) => {
                db.get(qTotalReach, [], (err, rowTotalReach) => {
                    db.get(qLeadsCount, [], (err, rowLeadsCount) => {
                        db.all(qMonthlyBreakdown, [], (err, monthlyRows) => {
                            db.all(qYearlyBreakdown, [], (err, yearlyRows) => {
                                db.all(qDailyRecent, [], (err, dailyRows) => {
                                    db.all(qLeads, [], (err, leads) => {
                                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        const formattedMonthly = (monthlyRows || []).reverse().map(r => {
                                            const parts = r.month.split('-');
                                            const y = parts[0];
                                            const m = parseInt(parts[1], 10) - 1;
                                            return {
                                                month: r.month,
                                                label: `${monthNames[m] || parts[1]} ${y}`,
                                                count: r.count
                                            };
                                        });

                                        res.json({
                                            visitsToday: rowToday ? rowToday.count : 0,
                                            visitsMonth: rowMonth && rowMonth.total ? rowMonth.total : 0,
                                            visitsYear: rowYear && rowYear.total ? rowYear.total : 0,
                                            totalReach: rowTotalReach && rowTotalReach.total ? rowTotalReach.total : 0,
                                            totalLeads: rowLeadsCount ? rowLeadsCount.count : 0,
                                            monthlyTraffic: formattedMonthly,
                                            yearlyTraffic: yearlyRows || [],
                                            dailyTraffic: (dailyRows || []).reverse(),
                                            trafficSources: [
                                                { source: 'Direct Search', percentage: 42, color: '#38bdf8' },
                                                { source: 'LinkedIn & Social', percentage: 28, color: '#a855f7' },
                                                { source: 'Organic Google', percentage: 18, color: '#34d399' },
                                                { source: 'Partner Referrals', percentage: 12, color: '#fbbf24' }
                                            ],
                                            leads: leads || []
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Admin Route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
