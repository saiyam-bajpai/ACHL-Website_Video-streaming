const NodeMediaServer = require('node-media-server');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure VOD recording directory exists
const vodDir = path.join(__dirname, 'media', 'vod');
if (!fs.existsSync(vodDir)) {
  fs.mkdirSync(vodDir, { recursive: true });
}

// 1. Configure Node Media Server
const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 4096,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*', // Allows cross-origin requests from your main web app
    mediaroot: path.join(__dirname, 'media'),
  },
};

const nms = new NodeMediaServer(nmsConfig);
nms.run();

// 2. Express Server for Web Player & API
const app = express();

// Enable CORS for frontend integration
app.use(cors({
  origin: '*', // Set to your frontend domain in production (e.g., https://yourstartup.com)
  methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));

// API Endpoint to check if a specific course stream is live
app.get('/api/stream-status/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  const isLive = nms.getSession(`/live/${streamKey}`) !== undefined;
  res.json({ streamKey, isLive });
});

app.listen(3000, () => {
  console.log('\n==================================================');
  console.log('🚀 PRODUCTION VIDEO SERVER RUNNING!');
  console.log('1. Web Dashboard: http://localhost:3000');
  console.log('2. OBS Ingest:    rtmp://127.0.0.1/live/<STREAM_KEY>');
  console.log('3. Stream Play:   http://localhost:8000/live/<STREAM_KEY>.flv');
  console.log('==================================================\n');
});