const Expert = require('../models/Expert');

const SEED_EXPERTS = [
  {
    name: 'Aarav Sharma',
    category: 'Technology',
    experience: 12,
    rating: 4.8,
    bio: 'Full-stack engineer specializing in distributed systems and cloud-native architecture.',
    avatar: '',
    hourlyRate: 120,
    available: true,
  },
  {
    name: 'Priya Verma',
    category: 'Technology',
    experience: 8,
    rating: 4.6,
    bio: 'Senior frontend engineer focused on React, TypeScript, and design systems.',
    avatar: '',
    hourlyRate: 95,
    available: true,
  },
  {
    name: 'Rahul Mehta',
    category: 'Technology',
    experience: 15,
    rating: 4.9,
    bio: 'Cloud architect with deep AWS and Kubernetes experience.',
    avatar: '',
    hourlyRate: 150,
    available: true,
  },
  {
    name: 'Sneha Iyer',
    category: 'Business',
    experience: 10,
    rating: 4.7,
    bio: 'Strategy consultant helping early-stage startups scale operations.',
    avatar: '',
    hourlyRate: 130,
    available: true,
  },
  {
    name: 'Vikram Patel',
    category: 'Business',
    experience: 18,
    rating: 4.5,
    bio: 'Former management consultant, now advising on go-to-market strategy.',
    avatar: '',
    hourlyRate: 175,
    available: true,
  },
  {
    name: 'Ananya Reddy',
    category: 'Business',
    experience: 6,
    rating: 4.3,
    bio: 'Operations and process improvement expert for SMB and mid-market companies.',
    avatar: '',
    hourlyRate: 80,
    available: true,
  },
  {
    name: 'Kabir Joshi',
    category: 'Design',
    experience: 9,
    rating: 4.8,
    bio: 'Product designer with experience at consumer SaaS startups and design agencies.',
    avatar: '',
    hourlyRate: 110,
    available: true,
  },
  {
    name: 'Meera Kapoor',
    category: 'Design',
    experience: 7,
    rating: 4.6,
    bio: 'UX researcher and interaction designer focused on accessibility.',
    avatar: '',
    hourlyRate: 90,
    available: true,
  },
  {
    name: 'Arjun Nair',
    category: 'Design',
    experience: 11,
    rating: 4.7,
    bio: 'Brand and visual designer who has shipped identity systems for Fortune 500 brands.',
    avatar: '',
    hourlyRate: 125,
    available: true,
  },
  {
    name: 'Riya Malhotra',
    category: 'Marketing',
    experience: 5,
    rating: 4.4,
    bio: 'Growth marketer specializing in paid acquisition and lifecycle email.',
    avatar: '',
    hourlyRate: 75,
    available: true,
  },
  {
    name: 'Devansh Gupta',
    category: 'Marketing',
    experience: 13,
    rating: 4.6,
    bio: 'Content and SEO leader with B2B SaaS expertise.',
    avatar: '',
    hourlyRate: 115,
    available: true,
  },
  {
    name: 'Isha Bansal',
    category: 'Marketing',
    experience: 8,
    rating: 4.5,
    bio: 'Brand marketing strategist working with consumer and lifestyle brands.',
    avatar: '',
    hourlyRate: 100,
    available: true,
  },
  {
    name: 'Nikhil Saxena',
    category: 'Finance',
    experience: 14,
    rating: 4.7,
    bio: 'CFA charterholder advising on equity research and portfolio construction.',
    avatar: '',
    hourlyRate: 160,
    available: true,
  },
  {
    name: 'Tanvi Desai',
    category: 'Finance',
    experience: 9,
    rating: 4.5,
    bio: 'Personal finance and tax planning advisor for young professionals.',
    avatar: '',
    hourlyRate: 85,
    available: true,
  },
  {
    name: 'Aditya Rao',
    category: 'Finance',
    experience: 20,
    rating: 4.9,
    bio: 'Former investment banker, now mentoring on M&A and capital raising.',
    avatar: '',
    hourlyRate: 220,
    available: true,
  },
  {
    name: 'Dr. Kavita Menon',
    category: 'Health',
    experience: 16,
    rating: 4.8,
    bio: 'Clinical psychologist focused on cognitive behavioral therapy.',
    avatar: '',
    hourlyRate: 140,
    available: true,
  },
  {
    name: 'Rohan Bhatia',
    category: 'Health',
    experience: 7,
    rating: 4.4,
    bio: 'Certified nutritionist and sports performance coach.',
    avatar: '',
    hourlyRate: 70,
    available: true,
  },
  {
    name: 'Dr. Pooja Krishnan',
    category: 'Health',
    experience: 11,
    rating: 4.6,
    bio: 'Functional medicine practitioner specializing in chronic conditions.',
    avatar: '',
    hourlyRate: 135,
    available: true,
  },
  {
    name: 'Sameer Khan',
    category: 'Technology',
    experience: 4,
    rating: 4.2,
    bio: 'Mobile engineer building native iOS and Android apps.',
    avatar: '',
    hourlyRate: 65,
    available: true,
  },
  {
    name: 'Neha Agarwal',
    category: 'Marketing',
    experience: 3,
    rating: 4.0,
    bio: 'Social media and influencer marketing specialist.',
    avatar: '',
    hourlyRate: 55,
    available: true,
  },
];

const getExperts = async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 8 } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 8, 1);

    const filter = {};
    if (search) {
      // Escape user-supplied regex special chars to avoid injection.
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safeSearch, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const total = await Expert.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limitNum), 1);

    const experts = await Expert.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      experts,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch experts', error: err.message });
  }
};

const seedExperts = async (req, res) => {
  try {
    await Expert.deleteMany({});
    const inserted = await Expert.insertMany(SEED_EXPERTS);
    res.status(201).json({ message: 'Seed data inserted', count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to seed experts', error: err.message });
  }
};

const getExpertById = async (req, res) => {
  try {
    const { id } = req.params;
    // Guard against malformed ObjectId strings (Mongoose would otherwise throw a CastError).
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid expert id' });
    }

    const expert = await Expert.findById(id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    return res.json(expert);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch expert', error: err.message });
  }
};

module.exports = { getExperts, seedExperts, getExpertById };
