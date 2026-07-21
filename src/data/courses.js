export const COURSES = [
  {
    slug: 'critical-thinking-problem-design',
    title: 'Critical Thinking & Problem Design',
    category: 'Critical Thinking',
    duration: '6 Weeks',
    format: 'Live Cohort',
    level: 'Intermediate',
    price: '$499',
    priceVal: 499,
    instructor: 'Prof. Evelyn Vance',
    instructorTitle: 'Director of Cognitive Studies',
    desc: 'Deconstruct complex systems, identify hidden assumptions, and define high-leverage problems before writing code.',
    thumbnailText: 'THINK',
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
    format: 'Cohort-based',
    level: 'Beginner to Intermediate',
    price: '$699',
    priceVal: 699,
    instructor: 'Marcus Chen',
    instructorTitle: 'Venture Architect & Investor',
    desc: 'A hands-on framework to validate startup ideas, test actual market demand, and pitch using first-principles thinking.',
    thumbnailText: 'VALIDATE',
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
        lessons: ['Designing High-Signal Smoke Tests', 'Landing Page Experiments', 'Metrics & Cohort Analysis']
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
    level: 'Advanced',
    price: '$899',
    priceVal: 899,
    instructor: 'Sarah Jenkins',
    instructorTitle: 'Former CTO & Founder',
    desc: 'Build and deploy production-ready applications. Understand software architecture, database design, and cloud scaling.',
    thumbnailText: 'BUILD',
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
      { q: 'Will I get career placement?', a: 'We share active student portfolios directly with our cohort partner companies and startups.' }
    ]
  },
  {
    slug: 'ai-modern-thinking',
    title: 'AI & Modern Thinking Skills',
    category: 'AI & Modern Skills',
    duration: '4 Weeks',
    format: 'Micro-learning',
    level: 'All Levels',
    price: '$299',
    priceVal: 299,
    instructor: 'Dr. Liam Patel',
    instructorTitle: 'AI Research Director',
    desc: 'Co-pilot your intellectual workflow. Use generative models to pressure-test your decisions and brainstorm faster.',
    thumbnailText: 'CO-PILOT',
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
