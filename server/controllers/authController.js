import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import resilientStore from '../models/resilientStore.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'brand-builder-jwt-secret-key-2026';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '281883142806-j9aqfp522gv4phq85kiq3k1mq2ntii62.apps.googleusercontent.com';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Strict Gmail Regex rule
export const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

function generateToken(user) {
  const userId = user._id || user.id;
  return jwt.sign(
    { id: String(userId), email: user.email },
    JWT_SECRET,
    { expiresIn: '14d' }
  );
}

function sanitizeUser(user) {
  return {
    id: String(user._id || user.id),
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    avatarUrl: user.avatarUrl || null,
    authProvider: user.authProvider || 'local'
  };
}

/**
 * POST /api/auth/register
 * Custom credentials registration (Strict @gmail.com rule)
 */
export async function handleRegister(req, res) {
  try {
    const { email, password, displayName } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Strict Domain Validation
    if (!GMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Only @gmail.com addresses are permitted.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existing = await resilientStore.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this @gmail.com address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await resilientStore.createUser({
      email: cleanEmail,
      password: hashedPassword,
      displayName: displayName?.trim() || cleanEmail.split('@')[0],
      authProvider: 'local'
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully.'
    });
  } catch (err) {
    console.error('[authController] Register error:', err);
    return res.status(500).json({ error: 'Failed to create account.', details: err.message });
  }
}

/**
 * POST /api/auth/login
 * Custom credentials login (Strict @gmail.com rule)
 */
export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!GMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Only @gmail.com addresses are permitted.' });
    }

    const user = await resilientStore.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.password && user.authProvider === 'google') {
      return res.status(400).json({ error: 'This account was created with Google. Please use Google Sign-In.' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
      message: 'Logged in successfully.'
    });
  } catch (err) {
    console.error('[authController] Login error:', err);
    return res.status(500).json({ error: 'Login failed.', details: err.message });
  }
}

/**
 * POST /api/auth/google
 * Google One-Click OAuth token verification
 */
export async function handleGoogleAuth(req, res) {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required.' });
    }

    let payload = null;

    if (googleClient && GOOGLE_CLIENT_ID) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
      } catch (verifyErr) {
        console.warn('[authController] Google token verification error:', verifyErr.message);
        return res.status(401).json({ error: 'Google token verification failed.', details: verifyErr.message });
      }
    } else {
      // In development when GOOGLE_CLIENT_ID is not configured yet, decode payload safely
      try {
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          payload = decoded;
        }
      } catch (e) {
        return res.status(400).json({ error: 'Invalid Google token format.' });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google token.' });
    }

    const cleanEmail = payload.email.trim().toLowerCase();

    // Enforce strict @gmail.com domain rule
    if (!GMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: 'Only @gmail.com accounts are permitted.' });
    }

    let user = await resilientStore.findUserByEmail(cleanEmail);

    if (!user) {
      // Create new Google auth user
      user = await resilientStore.createUser({
        email: cleanEmail,
        googleId: payload.sub,
        displayName: payload.name || cleanEmail.split('@')[0],
        avatarUrl: payload.picture || null,
        authProvider: 'google'
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user = await resilientStore.updateUser(user._id || user.id, {
        googleId: payload.sub,
        avatarUrl: user.avatarUrl || payload.picture
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
      message: 'Google authentication successful.'
    });
  } catch (err) {
    console.error('[authController] Google auth error:', err);
    return res.status(500).json({ error: 'Google sign-in failed.', details: err.message });
  }
}

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
export async function handleGetMe(req, res) {
  try {
    const user = await resilientStore.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user.', details: err.message });
  }
}
