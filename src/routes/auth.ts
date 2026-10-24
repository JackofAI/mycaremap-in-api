import { Router, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserByToken,
  saveUserCareState
} from '../db';

export const authRouter = Router();

// Helper to extract Bearer token
function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// POST /api/auth/register - Register new user and optionally attach current careState
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { name, emailOrPhone, password, careState } = req.body;
    if (!emailOrPhone || !password) {
      res.status(400).json({ success: false, error: 'Email/Mobile and password are required' });
      return;
    }

    const session = registerUser(name || '', emailOrPhone, password, careState);
    res.json({
      success: true,
      message: 'Account created successfully. Your Care Map has been securely saved.',
      data: session
    });
  } catch (error: any) {
    console.error('[Auth] Registration error:', error.message);
    res.status(400).json({ success: false, error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login - Authenticate existing user and return their careState
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      res.status(400).json({ success: false, error: 'Email/Mobile and password are required' });
      return;
    }

    const session = loginUser(emailOrPhone, password);
    res.json({
      success: true,
      message: 'Logged in successfully',
      data: session
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error.message);
    res.status(401).json({ success: false, error: error.message || 'Invalid credentials' });
  }
});

// GET /api/auth/me - Verify session and get active user info
authRouter.get('/me', (req: Request, res: Response) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ success: false, error: 'No authorization token provided' });
      return;
    }

    const user = getUserByToken(token);
    if (!user) {
      res.status(401).json({ success: false, error: 'Session expired or invalid' });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          emailOrPhone: user.emailOrPhone,
          createdAt: user.createdAt
        },
        token: user.token,
        careState: user.careState
      }
    });
  } catch (error: any) {
    console.error('[Auth] Session check error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to verify session' });
  }
});

// POST /api/auth/logout - Logout user
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// PUT /api/auth/sync - Explicitly save careState for authenticated user
authRouter.put('/sync', (req: Request, res: Response) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required to save to user account' });
      return;
    }

    const user = getUserByToken(token);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid or expired session' });
      return;
    }

    const updatedState = saveUserCareState(user.id, req.body);
    res.json({
      success: true,
      message: 'Care map synchronized to your account',
      data: { state: updatedState }
    });
  } catch (error: any) {
    console.error('[Auth] Sync error:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Failed to sync care state' });
  }
});
