# Project Documentation: LeadFlow CRM

## 1. Project Overview
**Title:** LeadFlow – Smart Appointment & Lead Management CRM
**Author:** Pankaj Kumar (NIT Hamirpur, 3rd Year Electrical Engineering)
**Domain:** Web Development (LaunchED Global Internship Capstone Project)

LeadFlow is a responsive, full-stack SaaS platform built specifically for small healthcare clinics, academic institutes, coaching centers, and service-based professionals. It automates appointment scheduling, eliminates manual paper logging, qualifies requests through a pipeline CRM, and visualizes intake metrics through real-time data analytics.

---

## 2. Problem Statement
Small businesses and service professionals often struggle with managing appointments using manual methods like paper logs or disconnected spreadsheets. This traditional approach leads to:
*   Missed or double-booked appointments.
*   Disorganized client tracking and follow-up.
*   Zero insights into business performance, popular services, or conversion rates.
*   A lack of a professional online interface for clients to request services.

---

## 3. Objectives
The primary objectives of the LeadFlow project were to:
1.  **Automate Scheduling:** Provide an easy-to-use frontend for clients to request appointments.
2.  **Centralize Management:** Build a secure admin dashboard to manage, filter, and track the status of all leads.
3.  **Provide Insights:** Implement visual charts to track daily/monthly volumes and service demand.
4.  **Ensure Security:** Protect endpoints with authentication and prevent spam via rate limiting.

---

## 4. Tech Stack & Technologies Used
*   **Frontend:** React.js, Vite, Tailwind CSS (for modern UI and dark mode support).
*   **Data Visualization:** Chart.js with React-Chartjs-2.
*   **Backend:** Node.js, Express.js.
*   **Database:** Supabase (PostgreSQL), along with a custom In-Memory Demo Mode for local testing.
*   **Security:** JSON Web Tokens (JWT) for secure admin sessions, `bcryptjs` for password hashing, and Express rate-limiters.

---

## 5. System Architecture & Workflow
The system utilizes a modern Client-Server architecture:
1.  **Client Layer:** Users interact with the React frontend to view services and submit booking requests.
2.  **API Layer:** The Node/Express backend receives the data, validates the input, and stores it in the database. 
3.  **Admin Layer:** The business owner logs into the React frontend using a secure admin gateway. The frontend requests data from protected backend API routes using a Bearer token.
4.  **Database Layer:** Supabase PostgreSQL securely stores `Admins` and `Appointments` tables.

---

## 6. Database Schema Summary
The database consists of two core tables:

**1. `admins` Table**
*   `id`: UUID (Primary Key)
*   `username`: VARCHAR (Unique)
*   `email`: VARCHAR (Unique)
*   `password`: VARCHAR (Hashed)
*   `created_at`: TIMESTAMP

**2. `appointments` Table**
*   `id`: UUID (Primary Key)
*   `name`, `phone`, `email`, `age`: Client Details
*   `service`, `date`, `time`, `message`: Appointment Details
*   `status`: VARCHAR (Values: New, Contacted, Pending, Confirmed, Completed, Cancelled)
*   `created_at`: TIMESTAMP

*(Indexes are applied on name, phone, status, service, and date to optimize backend search queries).*

---

## 7. Major Functionalities
*   **Dynamic Landing Page:** Features a hero section, service cards, and an integrated booking form.
*   **Dual-Mode Database Adaptor:** The app intelligently switches to a mock In-Memory database filled with sample data if Supabase credentials are not provided, allowing for instant zero-configuration testing.
*   **Secure Admin Gateway:** JWT-protected dashboard access.
*   **Interactive CRM:** A data table to view, edit, filter, and change the status of appointments.
*   **Data Analytics Dashboard:** Visual graphs displaying conversion rates, pending leads, and service demands.
*   **Anti-Spam Security:** IP Rate-Limiting restricts excessive booking requests (max 30 per hour per IP) and protects the admin login.

---

## 8. Challenges Faced & Solutions
**Challenge 1: Securing the Backend API**
*   *Problem:* The public booking form could be targeted by bots, and the CRM data needed strict protection.
*   *Solution:* Implemented custom sliding-window rate-limiting middleware in Express to throttle requests. I used JWT to ensure that only authenticated administrators with valid tokens could access the CRM data routes.

**Challenge 2: Complex Data Aggregation for Analytics**
*   *Problem:* The frontend charts required aggregated data (e.g., counting appointments per month/service) rather than raw database rows.
*   *Solution:* Instead of burdening the frontend with data processing, I wrote aggregation logic in the backend controller to group and count the data efficiently before sending it to the client.

---

## 9. Conclusion
LeadFlow successfully demonstrates a complete full-stack web development lifecycle. It provides a highly functional, production-ready SaaS application that solves a real-world problem for service-based businesses by replacing inefficient manual processes with a secure, centralized digital CRM system.
