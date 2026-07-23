# Live Stream Platform Deployment Guide

This guide covers how to deploy the RTMP Video Server and the React (Vite) frontend website. It also explains the multi-teacher streaming workflow and how to integrate with Cloudflare.

## 1. System Architecture

- **Backend (Node Media Server):** Handles RTMP ingest from OBS, and provides HTTP-FLV playback and a REST API for stream status.
  - Port `1935`: RTMP ingest (used by OBS)
  - Port `8000`: HTTP-FLV playback & media files (used by frontend player)
  - Port `3000`: REST API & Web Dashboard
- **Frontend (Website):** React + Vite SPA. Reads environment variables to connect to the backend server.

## 2. Multi-Teacher Workflow

The system is designed so that multiple teachers can stream simultaneously. Each teacher streams to a unique **Stream Key** which corresponds to the **Course Slug**.

**Steps for a Teacher:**
1. Open OBS Studio (or any RTMP capable software).
2. Go to **Settings > Stream**.
3. Set Service to **Custom**.
4. Set Server to your RTMP URL (e.g., `rtmp://stream.yourdomain.com/live`).
5. Set Stream Key to the specific course slug (e.g., `intro-to-react`).
6. Start Streaming. 

The website will automatically detect the stream for `intro-to-react` and the video will appear live for all enrolled users currently on the `intro-to-react` Course Player page.

## 3. Deployment Steps

### A. Deploying the RTMP Server
You will need a Virtual Private Server (VPS) (e.g., AWS EC2, DigitalOcean Droplet) because PaaS solutions like Vercel or Heroku do not support long-running RTMP TCP ports out of the box.

1. SSH into your VPS and install Node.js and npm.
2. Clone this repository.
3. Run `npm install` in the root directory.
4. Start the server using a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "rtmp-server"
   ```
5. Ensure your VPS firewall allows traffic on ports `1935`, `8000`, and `3000`.

### B. Deploying the Website
The website is a static bundle and can be deployed anywhere (Vercel, Netlify, Cloudflare Pages, S3).

1. In the `Main/ACHL-Website_Video-streaming` directory, create a `.env` file based on `.env.example`:
   ```env
   VITE_RTMP_API_URL=https://api.yourdomain.com
   VITE_RTMP_HTTP_URL=https://video.yourdomain.com
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the resulting `dist` folder to your static hosting provider of choice.

## 4. Cloudflare Integration

Cloudflare is great for DNS, SSL, and CDN caching, but it handles RTMP traffic differently than HTTP.

### DNS Setup
1. Create an `A` record for `api.yourdomain.com` pointing to your VPS IP (Proxy status: **Proxied** ☁️). This maps to port `3000`.
2. Create an `A` record for `video.yourdomain.com` pointing to your VPS IP (Proxy status: **Proxied** ☁️). This maps to port `8000`.
3. Create an `A` record for `stream.yourdomain.com` pointing to your VPS IP (Proxy status: **DNS Only** ☁️). 
   *Note: Cloudflare's standard proxy does NOT support RTMP (port 1935). You must set it to DNS Only so OBS can connect directly to the VPS.*

### Reverse Proxy (Nginx)
Since Cloudflare only proxies standard HTTP/HTTPS ports (80/443), you should set up Nginx on your VPS to route traffic to ports `3000` and `8000`:
- Map `api.yourdomain.com` -> `localhost:3000`
- Map `video.yourdomain.com` -> `localhost:8000`

This ensures your frontend fetches streams over secure HTTPS connections (`https://`), preventing mixed-content warnings in the browser.

### Cloudflare Rules
Make sure to create a **Cache Rule** in Cloudflare to bypass caching for the `/live/*` paths on `video.yourdomain.com`, otherwise Cloudflare might try to cache the live FLV streams and cause massive latency or playback failure.
