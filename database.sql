-- Database Schema Setup for Smart Appointment & Lead Management Website

-- Enable UUID extension if not already enabled (Supabase standard)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (safe initialization)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS admins;

-- 1. Create Admins Table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'New' NOT NULL CHECK (status IN ('New', 'Contacted', 'Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Optimization Indexes for Admin Dashboard Search & Filters
CREATE INDEX idx_appointments_name ON appointments (name);
CREATE INDEX idx_appointments_phone ON appointments (phone);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_service ON appointments (service);
CREATE INDEX idx_appointments_date ON appointments (date);
CREATE INDEX idx_appointments_created_at ON appointments (created_at DESC);

-- 4. Seed default administrator account instructions:
-- You can manually add admins using the Register API or run the SQL command below.
-- (Note: The password below is a bcrypt hashed version of 'Admin123')
-- INSERT INTO admins (username, email, password) 
-- VALUES ('admin', 'admin@example.com', '$2a$10$tWvY3e0mkyf.TWhn/tI2ZepKk.5y8Zq6z/P7yW9q2n4yvCqKjE2I2');
