import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  // Clear existing data in reverse order of relations
  await prisma.supportTicket.deleteMany({});
  await prisma.testResult.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.studentStats.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const adminHash = hashPassword('admin123');
  const prabalHash = hashPassword('gamingwithprabal@123');
  const studentHash = hashPassword('student123');

  // Seed default admin
  await prisma.user.create({
    data: {
      email: 'admin@achl.com',
      password: adminHash,
      name: 'Admin User',
      role: 'Admin',
    },
  });

  // Seed user requested admin Prabal Jaiswal
  const prabalAdmin = await prisma.user.create({
    data: {
      email: 'prabaljaiswal69420@gmail.com',
      password: prabalHash,
      name: 'Prabal Jaiswal',
      role: 'Admin',
    },
  });

  // Seed default student stats for Prabal
  await prisma.studentStats.create({
    data: {
      userId: prabalAdmin.id,
      attendance: 98.4,
      feesPaid: 'Paid in Full ($499)'
    }
  });

  // Seed default student
  const student = await prisma.user.create({
    data: {
      email: 'student@achl.com',
      password: studentHash,
      name: 'Student User',
      role: 'Student',
    },
  });

  // Seed default student stats
  await prisma.studentStats.create({
    data: {
      userId: student.id,
      attendance: 94.8,
      feesPaid: 'Paid in Full ($499)'
    }
  });

  // Seed Courses
  const coursesData = [
    {
      slug: 'critical-thinking-problem-design',
      title: 'Critical Thinking & Problem Design',
      category: 'Critical Thinking',
      duration: '6 Weeks',
      format: 'Live Program',
      price: '$499',
      desc: 'Deconstruct complex systems, identify hidden assumptions, and define high-leverage problems before writing code.',
      thumbnailText: 'THINK',
      level: 'Intermediate',
      instructor: 'Prof. Evelyn Vance',
      instructorTitle: 'Director of Cognitive Studies',
      outcomes: [
        'Master 12 cognitive templates for root-cause analysis.',
        'Deconstruct complex systems using first-principles modeling.',
        'Differentiate between symptoms and actual engineering bottlenecks.',
        'Pitch and justify your problem space to stakeholders with sound logic.'
      ],
      curriculum: [
        {
          module: 'Module 1: Foundations of Thinking Systems',
          lessons: ['Mental Model Architecture', 'Logical Fallacy Audits', 'First-Principles Deconstruction']
        },
        {
          module: 'Module 2: Problem Identification & Framing',
          lessons: ['Symptom vs Cause Identification', 'Leverage Mapping', 'Context Drafting']
        },
        {
          module: 'Module 3: Hypothesis Design & Validation',
          lessons: ['Scientific Method in Products', 'Designing Falsifiable Tests', 'Reviewing Empirical Feedback']
        }
      ],
      faqs: [
        { q: 'Who is this program for?', a: 'Aspiring engineers, product owners, and founders who want to frame and solve complex problems before wasting capital.' },
        { q: 'Are classes live or recorded?', a: 'We run live weekly seminars with recorded review sessions and continuous group discussions.' }
      ]
    },
    {
      slug: 'venture-validation',
      title: 'Venture & Idea Validation',
      category: 'Entrepreneurship',
      duration: '8 Weeks',
      format: 'Program-based',
      price: '$699',
      desc: 'A hands-on framework to validate startup ideas, test actual market demand, and pitch using first-principles thinking.',
      thumbnailText: 'VALIDATE',
      level: 'Beginner to Intermediate',
      instructor: 'Marcus Chen',
      instructorTitle: 'Venture Architect & Investor',
      outcomes: [
        'Construct a repeatable validation script that yields high-signal customer inputs.',
        'Design landing pages and ads to test actual purchase intent.',
        'Calculate market sizing and model unit economics accurately.',
        'Validate your startup value proposition before writing code.'
      ],
      curriculum: [
        {
          module: 'Module 1: Problem-Solution Architecture',
          lessons: ['Validating Customer Pain Points', 'Customer Persona Mapping', 'Hypothesis Identification']
        },
        {
          module: 'Module 2: Smoke Testing & Intent Capture',
          lessons: ['Designing High-Signal Smoke Tests', 'Landing Page Experiments', 'Metrics & Program Analysis']
        },
        {
          module: 'Module 3: Financial & Economic Modeling',
          lessons: ['Unit Economics Basics', 'LTV and CAC Modeling', 'Traction Pitch Design']
        }
      ],
      faqs: [
        { q: 'Do I need a business background?', a: 'No. We teach venture building starting from first principles.' },
        { q: 'Is there a final project?', a: 'Yes. You will present your validation data and customer interviews to a panel of startup mentors.' }
      ]
    },
    {
      slug: 'startup-building-execution',
      title: 'Startup Building & Technical Execution',
      category: 'Startup Building',
      duration: '10 Weeks',
      format: 'Interactive Bootcamp',
      price: '$899',
      desc: 'Build and deploy production-ready applications. Understand software architecture, database design, and cloud scaling.',
      thumbnailText: 'BUILD',
      level: 'Advanced',
      instructor: 'Sarah Jenkins',
      instructorTitle: 'Former CTO & Founder',
      outcomes: [
        'Design robust database schemas and write optimized queries.',
        'Build scalable backend services using production-level Node/Vite routers.',
        'Configure automated deployments and CI/CD pipelines.',
        'Integrate payment structures, WebSockets, and authentication flows.'
      ],
      curriculum: [
        {
          module: 'Module 1: Architecture & System Schema Design',
          lessons: ['Relational vs Non-Relational schemas', 'Data Access Patterns', 'System State Design']
        },
        {
          module: 'Module 2: Core Engineering Execution',
          lessons: ['Restful API development', 'Auth JWT structures', 'WebSockets and Events']
        },
        {
          module: 'Module 3: Cloud Operations & Deployments',
          lessons: ['VPC, Docker, and Containerization', 'Automated CI/CD workflows', 'Monitoring and Scaling']
        }
      ],
      faqs: [
        { q: 'Are there coding prerequisites?', a: 'Yes. You should be familiar with basic JavaScript or Python loops and web fundamentals.' },
        { q: 'Will I get career placement?', a: 'We share active student portfolios directly with our program partner companies and startups.' }
      ]
    },
    {
      slug: 'ai-modern-thinking',
      title: 'AI & Modern Thinking Skills',
      category: 'AI & Modern Skills',
      duration: '4 Weeks',
      format: 'Micro-learning',
      price: '$299',
      desc: 'Co-pilot your intellectual workflow. Use generative models to pressure-test your decisions and brainstorm faster.',
      thumbnailText: 'CO-PILOT',
      level: 'All Levels',
      instructor: 'Dr. Liam Patel',
      instructorTitle: 'AI Research Director',
      outcomes: [
        'Learn prompt engineering systems that minimize hallucination.',
        'Use LLMs to brainstorm edge cases and pressure-test product ideas.',
        'Automate internal workflows and data extraction using AI APIs.',
        'Set up local AI dev environments.'
      ],
      curriculum: [
        {
          module: 'Module 1: Intellectual Co-piloting',
          lessons: ['Finetuning Prompts', 'Hallucination Mitigation', 'Prompt Chaining Workflows']
        },
        {
          module: 'Module 2: Automation Pipelines',
          lessons: ['Connecting API Workflows', 'Retrieval Augmented Generation (RAG)', 'Local Model Setup']
        }
      ],
      faqs: [
        { q: 'Do I need hardware?', a: 'A standard laptop is sufficient; we run all heavy compute workloads via cloud APIs.' }
      ]
    }
  ];

  for (const c of coursesData) {
    await prisma.course.create({ data: c });
  }

  // Enroll Prabal and Student in Critical Thinking
  await prisma.enrollment.create({
    data: {
      userId: prabalAdmin.id,
      courseSlug: 'critical-thinking-problem-design',
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseSlug: 'critical-thinking-problem-design',
    },
  });

  // Add default tasks for Prabal and Student
  const tasksData = [
    { userId: prabalAdmin.id, text: 'Analyze root causes in Case Study 2', completed: false },
    { userId: prabalAdmin.id, text: 'Submit first-principles problem canvas', completed: true },
    { userId: student.id, text: 'Analyze root causes in Case Study 2', completed: false },
    { userId: student.id, text: 'Submit first-principles problem canvas', completed: true },
    { userId: student.id, text: 'Watch Week 2 live class replay', completed: false },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: t });
  }

  // Seed Tests
  const questionsList = [
    {
      q: 'What is first-principles thinking?',
      options: [
        'Reasoning by copying what other successful products are doing',
        'Deconstructing a problem to its basic truths and building a solution up from there',
        'Analyzing user flow logs in a terminal database',
        'Relying on historical case studies blindly'
      ],
      answerIdx: 1
    },
    {
      q: 'Which of the following is a cognitive bias where people favor information that confirms their existing beliefs?',
      options: [
        'Confirmation Bias',
        'Sunk Cost Fallacy',
        'Dunning-Kruger Effect',
        'Availability Heuristic'
      ],
      answerIdx: 0
    },
    {
      q: 'In software engineering, what does the DRY principle stand for?',
      options: [
        'Data Relational Yield',
        'Do Repeat Yesterday',
        'Design Reasoning Yield',
        'Don\'t Repeat Yourself'
      ],
      answerIdx: 3
    },
    {
      q: 'What is premature scaling in entrepreneurship?',
      options: [
        'Refactoring server code early in the design cycle',
        'Growing a company\'s expenses and operational footprint before validating actual product demand',
        'Scaling server instances to meet active traffic loads',
        'Hiring a lead engineer to build the MVP'
      ],
      answerIdx: 1
    },
    {
      q: 'What is a smoke test in venture validation?',
      options: [
        'Testing database queries to see if server responses lag',
        'A test to capture purchase intent or interest (e.g., email signups) before building the product',
        'Testing server firewalls under load',
        'Testing if a compiled React bundle produces warnings'
      ],
      answerIdx: 1
    }
  ];

  const test1 = await prisma.test.create({
    data: {
      title: 'Cognitive Semantics & First Principles Exam',
      slug: 'cognitive-semantics-exam',
      duration: 10,
      questions: questionsList,
      isActive: true
    }
  });

  // Seed previous test result
  await prisma.testResult.create({
    data: {
      userId: student.id,
      testId: test1.id,
      score: 80,
      topperScore: 100,
      rank: 4,
      mistakes: [2]
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
