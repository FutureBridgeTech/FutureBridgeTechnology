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

// Admin Route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
