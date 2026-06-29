const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, isDemoMode } = require('../config/supabase');
const mockDb = require('../config/mockDb');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_token_for_local_development_2026';
const ADMIN_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || 'AdminSecureSignupSecretCode2026';

/**
 * Register Admin
 */
exports.registerAdmin = async (req, res) => {
  const { username, email, password, registrationCode } = req.body;

  // 1. Basic validation
  if (!username || !email || !password || !registrationCode) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // 2. Validate registration code
  if (registrationCode !== ADMIN_REGISTRATION_CODE) {
    return res.status(401).json({ success: false, message: 'Invalid Admin Registration Secret Code.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- DEMO MODE Adaptor ---
    if (isDemoMode) {
      const exists = mockDb.admins.find(
        u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        return res.status(400).json({ success: false, message: 'Username or Email already registered.' });
      }

      const newAdmin = {
        id: `admin-${Date.now()}`,
        username,
        email,
        password: hashedPassword,
        created_at: new Date().toISOString()
      };
      
      mockDb.admins.push(newAdmin);
      return res.status(201).json({
        success: true,
        message: 'Admin registered successfully (Demo Mode).'
      });
    }

    // --- SUPABASE Adaptor ---
    // Check conflicts
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Username or Email already registered.' });
    }

    // Save
    const { error: insertError } = await supabase
      .from('admins')
      .insert([{ username, email, password: hashedPassword }]);

    if (insertError) throw insertError;

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.'
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

/**
 * Login Admin
 */
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email/Username and Password are required.' });
  }

  try {
    let adminUser = null;

    // --- DEMO MODE Adaptor ---
    if (isDemoMode) {
      adminUser = mockDb.admins.find(
        u => u.username.toLowerCase() === email.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
      );
    } else {
      // --- SUPABASE Adaptor ---
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .or(`username.eq.${email},email.eq.${email}`)
        .maybeSingle();

      if (error) throw error;
      adminUser = data;
    }

    if (!adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: adminUser.id, username: adminUser.username, email: adminUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      admin: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};
