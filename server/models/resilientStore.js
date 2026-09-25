import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './User.js';
import BrandSession from './BrandSession.js';
import { isDbConnected } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'brand_sessions.json');

// Ensure local fallback data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory already exists
  }
}

function readJson(file, defaultValue = []) {
  try {
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`[resilientStore] Error reading ${file}:`, e.message);
  }
  return defaultValue;
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn(`[resilientStore] Error writing ${file}:`, e.message);
  }
}

export const resilientStore = {
  // ----------------------------------------------------
  // USER OPERATIONS
  // ----------------------------------------------------
  async findUserByEmail(email) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (isDbConnected()) {
      return await User.findOne({ email: cleanEmail });
    }
    const users = readJson(USERS_FILE, []);
    return users.find(u => u.email === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isDbConnected()) {
      return await User.findById(id);
    }
    const users = readJson(USERS_FILE, []);
    return users.find(u => u._id === String(id) || u.id === String(id)) || null;
  },

  async createUser(userData) {
    if (isDbConnected()) {
      const user = new User(userData);
      return await user.save();
    }
    const users = readJson(USERS_FILE, []);
    const newUser = {
      _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 7),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeJson(USERS_FILE, users);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (isDbConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    }
    const users = readJson(USERS_FILE, []);
    const index = users.findIndex(u => u._id === String(id) || u.id === String(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...updateData };
      writeJson(USERS_FILE, users);
      return users[index];
    }
    return null;
  },

  // ----------------------------------------------------
  // BRAND SESSION OPERATIONS
  // ----------------------------------------------------
  async getBrandSessionsByUser(userId) {
    const cleanUserId = String(userId);
    if (isDbConnected()) {
      return await BrandSession.find({ userId }).sort({ createdAt: -1 });
    }
    const sessions = readJson(SESSIONS_FILE, []);
    return sessions
      .filter(s => String(s.userId) === cleanUserId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createBrandSession(sessionData) {
    if (isDbConnected()) {
      const session = new BrandSession(sessionData);
      return await session.save();
    }
    const sessions = readJson(SESSIONS_FILE, []);
    const newSession = {
      _id: 'bs_' + Date.now() + Math.random().toString(36).substring(2, 7),
      ...sessionData,
      createdAt: new Date().toISOString()
    };
    sessions.push(newSession);
    writeJson(SESSIONS_FILE, sessions);
    return newSession;
  },

  async deleteBrandSession(sessionId, userId) {
    const cleanSessionId = String(sessionId);
    const cleanUserId = String(userId);

    if (isDbConnected()) {
      return await BrandSession.findOneAndDelete({ _id: cleanSessionId, userId: cleanUserId });
    }
    const sessions = readJson(SESSIONS_FILE, []);
    const filtered = sessions.filter(s => !(String(s._id) === cleanSessionId && String(s.userId) === cleanUserId));
    const deleted = sessions.length !== filtered.length;
    if (deleted) {
      writeJson(SESSIONS_FILE, filtered);
    }
    return deleted ? { _id: cleanSessionId } : null;
  }
};

export default resilientStore;
