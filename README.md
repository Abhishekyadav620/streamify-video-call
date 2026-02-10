# Streamify

## Running locally (VS Code / Cursor)

1. **Open the project** in VS Code and open a terminal (`` Ctrl+` `` or **Terminal → New Terminal**).

2. **Install dependencies** (once):
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

3. **Backend env**: In `backend` create a `.env` with:
   - `PORT=5001`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET_KEY=your_secret_key`
   (No `FRONTEND_URL` or `NODE_ENV=production` needed for local dev.)

4. **Run the app** — use **one** of these:

   **Option A – One command (backend + frontend together):**
   ```bash
   npm run dev
   ```
   From the project root. This starts the backend on **http://localhost:5001** and the frontend on **http://localhost:5173**.

   **Option B – Two terminals:**
   - **Terminal 1** (backend):
     ```bash
     npm run dev:backend
     ```
   - **Terminal 2** (frontend):
     ```bash
     npm run dev:frontend
     ```

5. **Open in browser:** **http://localhost:5173** (Vite dev server with hot reload).

---

## Deployment (fixing 502 / 503 errors)

If the app was working and then starts returning **502 Bad Gateway** or **503 Service Unavailable**:

1. **Set environment variables** on your hosting platform (Railway, Render, etc.):
   - `NODE_ENV=production`
   - `FRONTEND_URL` = your frontend URL (e.g. `https://yourapp.railway.app`) so CORS allows requests
   - `MONGO_URI`, `JWT_SECRET_KEY`, and any other vars your backend needs

2. **Check the backend is running**: Open `https://your-api-url/api/health` in a browser. If you get `{"ok":true,...}`, the server is up; if not, the process may be sleeping (free tier) or crashed.

3. **Database**: If MongoDB (e.g. Atlas) is paused or the connection string changed, the server will retry connecting and stay up; fix the DB and it will recover.

4. **Redeploy** after adding `FRONTEND_URL` and ensure the backend service is running (no sleep/crash).