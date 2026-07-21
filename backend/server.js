import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from root .env first, fallback to backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
app.set('trust proxy', 1); // Trust reverse proxy headers (Render, Cloudflare, etc.)
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Security: Dynamic CORS settings for production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Token helper methods (Zero dependency HMAC-SHA256 signature)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-please-change-in-production-to-something-very-strong';

const signToken = (payload) => {
  let expMs = 7 * 24 * 60 * 60 * 1000; // default 7 days for students
  if (payload.role === 'SuperAdmin') {
    expMs = 12 * 60 * 60 * 1000; // 12 hours
  } else if (payload.role === 'Admin') {
    expMs = 24 * 60 * 60 * 1000; // 1 day
  }
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + expMs })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

// Authentication guard middleware
const authGuard = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
  req.user = decoded;
  next();
};

// Security: Rate Limiters to prevent abuse / DOS attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { error: 'Too many login or registration attempts. Please try again later.' }
});

const ticketLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many tickets submitted. Please try again after an hour.' }
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/support/tickets', ticketLimiter);

// --- API ROUTES ---

// 1. Authentication Endpoints
app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing name, email, or password.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    let finalRole = role || 'Student';
    if (finalRole === 'Admin' || finalRole === 'SuperAdmin') {
      finalRole = 'Student';
    }
    const userRole = email === 'prabaljaiswal69420@gmail.com' ? 'SuperAdmin' : finalRole;
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        role: userRole
      }
    });

    // Create default student stats (attendance & payment)
    await prisma.studentStats.create({
      data: {
        userId: newUser.id,
        attendance: 100.0,
        feesPaid: 'Paid in Full ($499)'
      }
    });

    // Auto-enroll new user in the critical thinking course as default
    await prisma.enrollment.create({
      data: {
        userId: newUser.id,
        courseSlug: 'critical-thinking-problem-design'
      }
    });

    // Generate starter study tasks
    const tasksData = [
      { userId: newUser.id, text: 'Analyze root causes in Case Study 2', completed: false },
      { userId: newUser.id, text: 'Submit first-principles problem canvas', completed: true },
      { userId: newUser.id, text: 'Watch Week 2 live class replay', completed: false }
    ];
    for (const task of tasksData) {
      await prisma.task.create({ data: task });
    }

    res.status(201).json({
      token: signToken({ id: newUser.id, email: newUser.email, role: newUser.role }),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Force SuperAdmin role for the owner
    if (user.email === 'prabaljaiswal69420@gmail.com' && user.role !== 'SuperAdmin') {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'SuperAdmin' }
      });
    }

    res.json({
      token: signToken({ id: user.id, email: user.email, role: user.role }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. Courses Catalog
app.get('/api/courses', async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

app.get('/api/courses/:slug', authGuard, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await prisma.course.findUnique({
      where: { slug }
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Verify enrollment for students/non-admins
    if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseSlug: { userId: req.user.id, courseSlug: slug }
        }
      });
      if (!enrollment) {
        return res.status(403).json({ error: 'Access forbidden. You are not enrolled in this program.' });
      }
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
});

// 3. User Enrollments
app.get('/api/enrollments', authGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access forbidden. You can only view your own enrollments.' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId }
    });

    res.json(enrollments.map(e => e.courseSlug));
  } catch (error) {
    next(error);
  }
});

app.post('/api/enrollments', authGuard, async (req, res, next) => {
  try {
    const { userId, courseSlug } = req.body;
    if (!userId || !courseSlug) {
      return res.status(400).json({ error: 'userId and courseSlug are required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access forbidden. You can only enroll yourself.' });
    }

    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseSlug: { userId: parseInt(userId), courseSlug }
      }
    });

    if (existing) {
      return res.json({ message: 'User already enrolled in this course.' });
    }

    await prisma.enrollment.create({
      data: {
        userId: parseInt(userId),
        courseSlug
      }
    });

    res.status(201).json({ message: 'Enrolled successfully.' });
  } catch (error) {
    next(error);
  }
});

// 4. Study Tasks checklist
app.get('/api/tasks', authGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access forbidden. You can only view your own tasks.' });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { id: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', authGuard, async (req, res, next) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).json({ error: 'userId and text are required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access forbidden. You can only add tasks for yourself.' });
    }

    const task = await prisma.task.create({
      data: {
        userId: parseInt(userId),
        text,
        completed: false
      }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

app.put('/api/tasks/:id', authGuard, async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { completed } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== task.userId) {
      return res.status(403).json({ error: 'Access forbidden. You can only modify your own tasks.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !!completed }
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// 5. Student Stats & Analytics
app.get('/api/dashboard/student-stats', authGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access forbidden. You can only view your own stats.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return res.status(401).json({ error: 'User session invalid. Please log in again.' });
    }

    let stats = await prisma.studentStats.findUnique({
      where: { userId }
    });

    // Fallback if not created yet
    if (!stats) {
      stats = await prisma.studentStats.create({
        data: {
          userId,
          attendance: 95.0,
          feesPaid: 'Paid in Full ($499)'
        }
      });
    }

    // Fetch latest test score
    const latestResult = await prisma.testResult.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { test: true }
    });

    res.json({
      attendance: stats.attendance,
      feesPaid: stats.feesPaid,
      latestTestScore: latestResult ? `${latestResult.score}/100` : 'N/A',
      latestTestTitle: latestResult ? latestResult.test.title : 'N/A',
      upcomingTestTitle: 'First-Principles Reasoning Sync',
      upcomingTestDate: 'July 25, 2026'
    });
  } catch (error) {
    next(error);
  }
});

// 6. Support Tickets
app.post('/api/support/tickets', authGuard, async (req, res, next) => {
  try {
    const { userId, subject, message } = req.body;
    if (!userId || !subject || !message) {
      return res.status(400).json({ error: 'userId, subject, and message are required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access forbidden. You can only submit tickets for yourself.' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: parseInt(userId),
        subject,
        message
      }
    });

    res.status(201).json({ message: 'Ticket submitted successfully.', ticketId: ticket.id });
  } catch (error) {
    next(error);
  }
});

// 7. Test Console APIs
app.get('/api/tests', authGuard, async (req, res, next) => {
  try {
    const tests = await prisma.test.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        duration: true
      }
    });
    res.json(tests);
  } catch (error) {
    next(error);
  }
});

app.get('/api/tests/results', authGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access forbidden. You can only view your own test results.' });
    }

    const results = await prisma.testResult.findMany({
      where: { userId },
      include: { test: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(results.map(r => ({
      id: r.id,
      score: r.score,
      topperScore: r.topperScore,
      rank: r.rank,
      mistakes: r.mistakes,
      testTitle: r.test.title,
      questions: r.test.questions,
      createdAt: r.createdAt
    })));
  } catch (error) {
    next(error);
  }
});

app.get('/api/tests/:slug', authGuard, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const test = await prisma.test.findUnique({
      where: { slug }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    // SECURITY CHECK: Strip correct answerIdx to prevent inspection cheating!
    const questionsArray = test.questions;
    const strippedQuestions = questionsArray.map((q) => {
      return {
        q: q.q,
        options: q.options
      };
    });

    res.json({
      id: test.id,
      title: test.title,
      slug: test.slug,
      duration: test.duration,
      questions: strippedQuestions
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/tests/:slug/submit', authGuard, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { userId, answers } = req.body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'userId and answers array are required.' });
    }

    if (req.user.role !== 'Admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ error: 'Access forbidden. You can only submit tests for yourself.' });
    }

    const test = await prisma.test.findUnique({
      where: { slug }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const questionsArray = test.questions;
    let correctCount = 0;
    const mistakes = [];

    questionsArray.forEach((q, idx) => {
      const studentAnswer = answers[idx];
      if (studentAnswer === q.answerIdx) {
        correctCount++;
      } else {
        mistakes.push(idx);
      }
    });

    const scorePercentage = Math.round((correctCount / questionsArray.length) * 100);
    const mockTopperScore = 100;
    const mockRank = scorePercentage >= 90 ? 1 : scorePercentage >= 80 ? 4 : 8;

    const result = await prisma.testResult.create({
      data: {
        userId: parseInt(userId),
        testId: test.id,
        score: scorePercentage,
        topperScore: mockTopperScore,
        rank: mockRank,
        mistakes: mistakes
      }
    });

    res.status(201).json({
      resultId: result.id,
      score: scorePercentage,
      topperScore: mockTopperScore,
      rank: mockRank,
      mistakes
    });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN LEVEL PROTECTION MIDDLEWARE ---
const adminGuard = (req, res, next) => {
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin')) {
    return res.status(403).json({ error: 'Access forbidden. Admins or Super Admins only.' });
  }
  next();
};

const superAdminGuard = (req, res, next) => {
  if (!req.user || req.user.role !== 'SuperAdmin') {
    return res.status(403).json({ error: 'Access forbidden. Super Admins only.' });
  }
  next();
};

const investorGuard = (req, res, next) => {
  const allowed = ['Investor', 'Admin', 'SuperAdmin'];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access forbidden. Restricted to Investors and Admins.' });
  }
  next();
};

// Support message tickets for admins
app.get('/api/admin/tickets', authGuard, adminGuard, async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

// Analytics reporting endpoint
app.get('/api/analytics', authGuard, investorGuard, async (req, res, next) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'Student' } });
    const totalAdmins = await prisma.user.count({ where: { role: { in: ['Admin', 'SuperAdmin'] } } });
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const totalTickets = await prisma.supportTicket.count();
    const totalTestsTaken = await prisma.testResult.count();
    
    res.json({
      totalStudents,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      totalTickets,
      totalTestsTaken,
      uniqueVisitsMonth: 12450,
      pageViewsMonth: 48900,
      avgSessionDuration: '4m 32s',
      conversionRate: '4.8%'
    });
  } catch (error) {
    next(error);
  }
});

// Super Admin seat management endpoints
app.post('/api/superadmin/create-admin', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing name, email, or password.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword(password),
        role: 'Admin'
      }
    });

    res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/superadmin/enrollments', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const { userId, courseSlug } = req.body;
    if (!userId || !courseSlug) {
      return res.status(400).json({ error: 'userId and courseSlug are required.' });
    }
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseSlug: { userId: parseInt(userId), courseSlug }
      }
    });
    if (existing) {
      return res.status(400).json({ error: 'User is already enrolled in this program.' });
    }
    await prisma.enrollment.create({
      data: {
        userId: parseInt(userId),
        courseSlug
      }
    });
    res.status(201).json({ message: 'Program added to user account successfully.' });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/superadmin/enrollments', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const { userId, courseSlug } = req.body;
    if (!userId || !courseSlug) {
      return res.status(400).json({ error: 'userId and courseSlug are required.' });
    }
    await prisma.enrollment.delete({
      where: {
        userId_courseSlug: { userId: parseInt(userId), courseSlug }
      }
    });
    res.json({ message: 'Program removed from user account successfully.' });
  } catch (error) {
    next(error);
  }
});

// 8. Admin Panel APIs
app.get('/api/admin/stats', authGuard, adminGuard, async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalCourses = await prisma.course.count();
    const totalEnrollments = await prisma.enrollment.count();
    const completedTasks = await prisma.task.count({
      where: { completed: true }
    });

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      completedTasks,
      totalRevenue: totalEnrollments * 499
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', authGuard, adminGuard, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        enrollments: {
          select: {
            courseSlug: true
          }
        },
        studentStats: {
          select: {
            attendance: true,
            feesPaid: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/users/:id/role', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ id: updatedUser.id, name: updatedUser.name, role: updatedUser.role });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/users/:id/reset-password', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }

    const hashedPassword = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/users/:id/student-stats', authGuard, adminGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { attendance, feesPaid } = req.body;

    const updatedStats = await prisma.studentStats.upsert({
      where: { userId },
      update: {
        attendance: parseFloat(attendance),
        feesPaid
      },
      create: {
        userId,
        attendance: parseFloat(attendance),
        feesPaid
      }
    });

    res.json(updatedStats);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/users/:id', authGuard, superAdminGuard, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    if (req.user.id === userId) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/courses', authGuard, adminGuard, async (req, res, next) => {
  try {
    const { slug, title, category, duration, format, price, desc, thumbnailText, level, instructor, instructorTitle, outcomes, curriculum, faqs } = req.body;
    
    if (!slug || !title || !price) {
      return res.status(400).json({ error: 'Slug, title, and price are required.' });
    }

    const newCourse = await prisma.course.create({
      data: {
        slug,
        title,
        category: category || 'General',
        duration: duration || '4 Weeks',
        format: format || 'Recorded',
        price,
        desc: desc || '',
        thumbnailText: thumbnailText || 'ACHL',
        level: level || 'Intermediate',
        instructor: instructor || 'Staff Operator',
        instructorTitle: instructorTitle || 'ACHL Lead Instructor',
        outcomes: outcomes || [],
        curriculum: curriculum || [],
        faqs: faqs || []
      }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/courses/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id);
    const { title, category, duration, format, price, desc, thumbnailText, level, instructor, instructorTitle, outcomes, curriculum, faqs } = req.body;

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        category,
        duration,
        format,
        price,
        desc,
        thumbnailText,
        level,
        instructor,
        instructorTitle,
        outcomes,
        curriculum,
        faqs
      }
    });

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/courses/:id', authGuard, adminGuard, async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id);

    await prisma.course.delete({
      where: { id: courseId }
    });

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// --- STUDY NOTES ENDPOINTS ---
app.get('/api/notes/:courseSlug/:moduleIdx/:lessonIdx', authGuard, async (req, res, next) => {
  try {
    const { courseSlug, moduleIdx, lessonIdx } = req.params;
    const userId = req.user.id;
    const note = await prisma.studyNote.findUnique({
      where: {
        userId_courseSlug_moduleIdx_lessonIdx: {
          userId,
          courseSlug,
          moduleIdx: parseInt(moduleIdx),
          lessonIdx: parseInt(lessonIdx)
        }
      }
    });
    res.json({ content: note ? note.content : '' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/notes/:courseSlug/:moduleIdx/:lessonIdx', authGuard, async (req, res, next) => {
  try {
    const { courseSlug, moduleIdx, lessonIdx } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const note = await prisma.studyNote.upsert({
      where: {
        userId_courseSlug_moduleIdx_lessonIdx: {
          userId,
          courseSlug,
          moduleIdx: parseInt(moduleIdx),
          lessonIdx: parseInt(lessonIdx)
        }
      },
      update: { content },
      create: {
        userId,
        courseSlug,
        moduleIdx: parseInt(moduleIdx),
        lessonIdx: parseInt(lessonIdx),
        content
      }
    });
    res.json(note);
  } catch (error) {
    next(error);
  }
});

// --- LESSON COMPLETIONS ENDPOINTS ---
app.get('/api/completions/:courseSlug', authGuard, async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    const userId = req.user.id;
    const completions = await prisma.lessonCompletion.findMany({
      where: { userId, courseSlug }
    });
    const keys = completions.map(c => `${c.courseSlug}_m${c.moduleIdx}_l${c.lessonIdx}`);
    res.json(keys);
  } catch (error) {
    next(error);
  }
});

app.post('/api/completions/:courseSlug', authGuard, async (req, res, next) => {
  try {
    const { courseSlug } = req.params;
    const { moduleIdx, lessonIdx } = req.body;
    const userId = req.user.id;
    const uniqueKey = {
      userId_courseSlug_moduleIdx_lessonIdx: {
        userId,
        courseSlug,
        moduleIdx: parseInt(moduleIdx),
        lessonIdx: parseInt(lessonIdx)
      }
    };
    const existing = await prisma.lessonCompletion.findUnique({
      where: uniqueKey
    });
    if (existing) {
      await prisma.lessonCompletion.delete({
        where: uniqueKey
      });
      res.json({ completed: false });
    } else {
      await prisma.lessonCompletion.create({
        data: {
          userId,
          courseSlug,
          moduleIdx: parseInt(moduleIdx),
          lessonIdx: parseInt(lessonIdx)
        }
      });
      res.json({ completed: true });
    }
  } catch (error) {
    next(error);
  }
});

// --- USER SELF DELETION ENDPOINT ---
app.delete('/api/users/me', authGuard, async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ message: 'User account and all associated data permanently deleted.' });
  } catch (error) {
    next(error);
  }
});

// Centralized error handler to catch unhandled Promise rejections and DB crashes safely
app.use((err, req, res, _next) => {
  console.error('[Centralized Error Log]', err.stack || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An internal database or server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`[ACHL Backend Running] Listening on http://localhost:${PORT}`);
});
