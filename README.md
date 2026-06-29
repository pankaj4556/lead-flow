# LeadFlow | Smart Appointment & Lead Management CRM

A responsive full-stack SaaS platform designed for small healthcare clinics, academic institutes, coaching centers, and service-based professionals to automate appointment scheduling, replace manual paper logging, qualify requests in a pipeline CRM, and monitor intake metrics.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (bundled with Vite), Tailwind CSS (dynamic dark/light mode switches, custom animations, and typography transitions), Axios, Lucide React, React Router DOM.
*   **Analytics**: Chart.js registered with React-Chartjs-2 (renders line charts for daily/monthly volumes, bar charts for services, and status doughnuts).
*   **Backend**: Node.js, Express.js. Includes sliding-window IP rate-limiters, password encryptors, JWT authentication header verification, and validation middleware.
*   **Database**: Supabase (PostgreSQL client integration).
*   **Notifications**: Nodemailer SMTP dispatcher.

---

## 📂 Project Directory Structure

```
capstone_01/
├── database.sql           # SQL Database setup script
├── README.md              # Project installation and details manual
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.js     # Supabase client connector (with Demo Mode fallback)
│   │   │   └── mockDb.js       # Local In-Memory DB (populated with 12 mock seeds)
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT validation route guard
│   │   │   └── rateLimiter.js  # IP rate limits (prevents brute-force & booking spam)
│   │   ├── controllers/
│   │   │   ├── authController.js        # Admin login/register logic
│   │   │   ├── appointmentController.js # CRUD & status modifications
│   │   │   └── analyticsController.js   # Analytics stats & charts aggregations
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── appointments.js
│   │   │   └── analytics.js
│   │   ├── services/
│   │   │   └── emailService.js # Nodemailer client/admin notification triggers
│   │   └── index.js            # Express server bootstrap
│   ├── .env.example            # Backend env template
│   ├── .env                    # Local environment variables
│   ├── package.json            # Server dependencies
│   └── test-api.js             # Automated API test suite
└── frontend/
    ├── index.html              # Core HTML structure (with SEO & OG tags)
    ├── vite.config.js          # Vite React compiler settings
    ├── tailwind.config.js      # Tailwind style tokens, fonts, and dark mode class mapping
    ├── postcss.config.js       # PostCSS config
    ├── package.json            # Client dependencies
    ├── public/
    │   ├── robots.txt          # Crawling instructions
    │   └── sitemap.xml         # Search engine index mapping
    └── src/
        ├── main.jsx            # React root DOM injector
        ├── index.css           # Tailwind base, global scrollbars, and glassmorphism styles
        ├── App.jsx             # Main Router (hides headers/footers in CRM screens)
        ├── context/
        │   └── AuthContext.jsx # Global auth provider (synchronizes sessions with LocalStorage)
        ├── components/
        │   ├── Navbar.jsx      # Responsive header with theme toggles
        │   ├── Footer.jsx      # SEO optimized semantic footer
        │   ├── ProtectedRoute.jsx # Router session check guard
        │   ├── WhatsappButton.jsx # Floating micro-animated chat button
        │   └── Dashboard/
        │       ├── Sidebar.jsx # CRM navigation bar
        │       ├── StatCard.jsx# Dashboard statistics display
        │       ├── AppointmentModal.jsx # View/Edit lead log modal
        │       └── AnalyticsCharts.jsx # ChartJS visuals for trends and statuses
        ├── pages/
        │   ├── Home.jsx        # Landing page with CTA, stats, and testimonials
        │   ├── About.jsx       # Vision, mission, and why choose us grids
        │   ├── Services.jsx    # Service cards with auto-fill booking link anchors
        │   ├── Contact.jsx     # Contact form with HSR Layout Google Map embed
        │   ├── BookAppointment.jsx # Booking form with client validation rules
        │   ├── AdminLogin.jsx  # Admin sign-in / registration panel
        │   └── AdminDashboard.jsx # Protected pipeline dashboard view
        └── utils/
            ├── api.js          # Axios API request coordinator
            └── csvExport.js    # Client-side CSV export trigger
```

---

## ⚡ Quick Start: Dynamic "Demo Mode" (No Setup Required)

To make evaluation simple, LeadFlow features an **intelligent dual-mode backend adaptor**. If no Supabase credentials are provided in `.env`, the system automatically enters **Demo Mode**:
*   Stores credentials and appointments in **In-Memory arrays**.
*   Pre-populates the admin panel on boot with **12 realistic sample leads** (with historical dates, services, and statuses).
*   Logs outgoing emails directly to the server console.

**Steps to run locally in Demo Mode:**
1.  Open your terminal inside the root workspace folder.
2.  Navigate to the `backend` folder, install packages, and boot the server:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  Open a second terminal, navigate to the `frontend` folder, install, and boot the Vite server:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
4.  Open the local browser to the URL displayed in the terminal (typically `http://localhost:5173`).
5.  Navigate to `/admin/login` or click "Admin Gateway" in the footer.
6.  Log in using the seeded test administrator credentials:
    *   **Email/Username:** `admin@example.com`
    *   **Password:** `Admin123`

---

## 💾 Production Database Setup (Supabase / Postgres)

To switch from Demo Mode to a persistent PostgreSQL database:
1.  Create a project on [Supabase](https://supabase.com/).
2.  Open the **SQL Editor** in your Supabase project dashboard.
3.  Copy and paste the query structure inside [database.sql](file:///c:/Users/hp/OneDrive/Desktop/capstone%20_01/database.sql) into the query box and click **Run**.
4.  Open `backend/.env` and update the environment variables:
    ```env
    SUPABASE_URL=https://your-project-id.supabase.co
    SUPABASE_KEY=your-supabase-service-role-or-anon-key
    ```
5.  Restart the backend server. The console will print `🚀 Connected to Supabase Database successfully.`

---

## 🔒 Security Measures

*   **JWT Token Verification**: Admin endpoints (stats, charts, lead CRUD, status updates) require a valid token passed in the `Authorization: Bearer <token>` header.
*   **Password Hashing**: Admin passwords are encrypted via `bcryptjs` before insertion into the database.
*   **IP Rate Limiting**: Mounts sliding-window rate limiters:
    *   `authLimiter` restricts login/register attempts to 15 per 15 minutes.
    *   `bookingLimiter` restricts appointment requests to 30 per hour to prevent spam.
*   **Input Validation**: Enforces string bounds, proper email formats via regex, correct date bounds (restricts past bookings), and predefined values on both client and server layers.
*   **Registration Secret**: Public administrator creation requires an `ADMIN_REGISTRATION_CODE` configuration from `.env` to prevent unauthorized admin sign-ups.

---

## 📈 API Documentation

All request parameters are parsed as JSON. Headers require `Content-Type: application/json`.

### 1. Authentication Endpoints

#### `POST /api/auth/register`
Creates a new administrative user.
*   **Body**:
    ```json
    {
      "username": "admin_username",
      "email": "admin@example.com",
      "password": "SecurePassword123!",
      "registrationCode": "AdminSecureSignupSecretCode2026"
    }
    ```
*   **Responses**:
    *   `201 Created` on registration success.
    *   `401 Unauthorized` if the secret registration code is incorrect.

#### `POST /api/auth/login`
Authenticates credentials and signs a JWT session token.
*   **Body**:
    ```json
    {
      "email": "admin@example.com",
      "password": "Password123"
    }
    ```
*   **Responses**:
    *   `200 OK` on success. Returns `token` and `admin` details.
    *   `401 Unauthorized` on mismatch.

---

### 2. Appointments CRUD Endpoints

#### `POST /api/appointments`
Public route to submit booking slot requests.
*   **Body**:
    ```json
    {
      "name": "Aarav Sharma",
      "phone": "9876543210",
      "email": "aarav@example.com",
      "age": 28,
      "service": "General Consultation",
      "date": "2026-06-25",
      "time": "10:30 AM",
      "message": "Routine checkup request."
    }
    ```
*   **Responses**:
    *   `201 Created` on insertion. Returns newly created entry with assigned status `New`. Fires automated email alerts.
    *   `400 Bad Request` if field validation checks fail.

#### `GET /api/appointments`
Protected CRM route to retrieve inquiries. Supports multi-faceted search and filter configurations.
*   **Headers**: `Authorization: Bearer <token>`
*   **Query Filters**:
    *   `name` (matches sub-string)
    *   `phone` (matches phone digits)
    *   `status` (`New`, `Contacted`, `Pending`, `Confirmed`, `Completed`, `Cancelled`)
    *   `service` (matches specific service category)
    *   `startDate` / `endDate` (limits dates range)
*   **Responses**:
    *   `200 OK`. Returns `count` and `data` (sorted descending by creation date).

#### `GET /api/appointments/:id`
Protected route to retrieve details of a single record.
*   **Headers**: `Authorization: Bearer <token>`
*   **Responses**:
    *   `200 OK` with details object.
    *   `404 Not Found` if record does not exist.

#### `PUT /api/appointments/:id`
Protected route to modify all details of a lead entry.
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**: Full JSON payload matching the appointment schema.
*   **Responses**:
    *   `200 OK` with updated details.

#### `PATCH /api/appointments/:id/status`
Protected route to directly patch status.
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "status": "Confirmed"
    }
    ```
*   **Responses**:
    *   `200 OK` with updated details.

#### `DELETE /api/appointments/:id`
Protected route to remove appointment from database.
*   **Headers**: `Authorization: Bearer <token>`
*   **Responses**:
    *   `200 OK`.

---

### 3. Analytics Endpoints

#### `GET /api/analytics/stats`
Protected route supplying charts datasets and conversion statistics.
*   **Headers**: `Authorization: Bearer <token>`
*   **Responses**:
    *   `200 OK` with payload:
        ```json
        {
          "stats": {
            "totalLeads": 15,
            "pendingLeads": 5,
            "confirmedLeads": 6,
            "completedAppointments": 3,
            "cancelledAppointments": 1,
            "leadConversionRate": 60
          },
          "charts": {
            "dailyAppointments": [ { "date": "06-24", "count": 2 } ],
            "monthlyAppointments": [ { "month": "Jun 2026", "count": 15 } ],
            "serviceWiseDemand": [ { "service": "General Consultation", "count": 5 } ],
            "statusDistribution": [ { "status": "Confirmed", "count": 6 } ]
          }
        }
        ```

---

## 🚀 Production Deployment Instructions

### 1. Backend Server Deployment (Render)
1.  Create a web service on [Render](https://render.com/).
2.  Link your GitHub repository containing the backend code.
3.  Set the **Build Command** to: `cd backend && npm install`.
4.  Set the **Start Command** to: `cd backend && npm start`.
5.  Add the environment variables in Render's dashboard:
    *   `PORT=10000` (Render binds automatically, but good to declare)
    *   `NODE_ENV=production`
    *   `SUPABASE_URL`
    *   `SUPABASE_KEY`
    *   `JWT_SECRET`
    *   `ADMIN_REGISTRATION_CODE`
    *   `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (For SMTP alerts)

### 2. Frontend React Deployment (Vercel)
1.  Deploy to [Vercel](https://vercel.com/) and connect your repository.
2.  Set the **Framework Preset** to **Vite**.
3.  Set the **Root Directory** to `frontend`.
4.  Configure the **Build Command** to: `npm run build`.
5.  Configure the **Output Directory** to: `dist`.
6.  Add the environment variables:
    *   `VITE_API_URL`= `https://your-backend-render-url.onrender.com/api`
    *   `VITE_WHATSAPP_PHONE`= `918062178600` (The business phone number for click-to-chat links)
7.  Deploy! Vercel handles single-page app (SPA) rewrites. If you encounter routing issues on page refreshes, create a `vercel.json` file in your `frontend` root:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/" }
      ]
    }
    ```
