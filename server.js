const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const DATA_DIR = path.join(__dirname, 'user-data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const STATS_FILE = path.join(DATA_DIR, 'question-stats.json');

// Ensure data directory exists
async function initDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize files if they don't exist
        try {
            await fs.access(PROGRESS_FILE);
        } catch {
            await fs.writeFile(PROGRESS_FILE, '{}');
        }
        
        try {
            await fs.access(STATS_FILE);
        } catch {
            await fs.writeFile(STATS_FILE, '{}');
        }
    } catch (error) {
        console.error('Error initializing data directory:', error);
    }
}

// Get progress
app.get('/api/progress', async (req, res) => {
    try {
        const data = await fs.readFile(PROGRESS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json({});
    }
});

// Save progress
app.post('/api/progress', async (req, res) => {
    try {
        await fs.writeFile(PROGRESS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get question stats
app.get('/api/stats', async (req, res) => {
    try {
        const data = await fs.readFile(STATS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.json({});
    }
});

// Save question stats
app.post('/api/stats', async (req, res) => {
    try {
        await fs.writeFile(STATS_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reset all data
app.post('/api/reset', async (req, res) => {
    try {
        await fs.writeFile(PROGRESS_FILE, '{}');
        await fs.writeFile(STATS_FILE, '{}');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

initDataDir().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📊 Data stored in: ${DATA_DIR}`);
    });
});
