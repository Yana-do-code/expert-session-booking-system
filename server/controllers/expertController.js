const Expert = require('../models/Expert');

const SEED_EXPERTS = [
  {
    name: 'Pt. Rajendra Sharma',
    category: 'Vedic Astrology',
    experience: 22,
    rating: 4.9,
    bio: 'Renowned Vedic astrologer with over two decades of experience in Jyotish Shastra. Specialises in birth chart analysis, planetary transits, and dasha predictions.',
    avatar: '',
    hourlyRate: 2100,
    available: true,
  },
  {
    name: 'Acharya Sunita Devi',
    category: 'Vedic Astrology',
    experience: 15,
    rating: 4.8,
    bio: 'Expert in Parashari and Jaimini systems of Vedic astrology. Helps clients navigate career, marriage, and health challenges through precise chart readings.',
    avatar: '',
    hourlyRate: 1800,
    available: true,
  },
  {
    name: 'Pt. Vikram Joshi',
    category: 'Vedic Astrology',
    experience: 18,
    rating: 4.7,
    bio: 'Specialises in muhurta (auspicious timing), kundali matching, and remedial astrology including gemstone and mantra recommendations.',
    avatar: '',
    hourlyRate: 1500,
    available: true,
  },
  {
    name: 'Priya Nair',
    category: 'Tarot',
    experience: 9,
    rating: 4.8,
    bio: 'Certified tarot reader and intuitive coach. Uses Rider-Waite and Thoth decks to provide clarity on love, career, and spiritual growth.',
    avatar: '',
    hourlyRate: 1200,
    available: true,
  },
  {
    name: 'Meera Kapoor',
    category: 'Tarot',
    experience: 6,
    rating: 4.5,
    bio: 'Combines tarot with angel card readings and chakra healing to deliver holistic guidance sessions for personal transformation.',
    avatar: '',
    hourlyRate: 900,
    available: true,
  },
  {
    name: 'Dr. Anand Mishra',
    category: 'Numerology',
    experience: 14,
    rating: 4.7,
    bio: 'Pioneer in Chaldean and Pythagorean numerology. Analyses name numbers, life path, and destiny numbers to guide major life decisions.',
    avatar: '',
    hourlyRate: 1400,
    available: true,
  },
  {
    name: 'Sheetal Arora',
    category: 'Numerology',
    experience: 8,
    rating: 4.6,
    bio: 'Numerology consultant specialising in business name analysis, lucky number identification, and personal year forecasts.',
    avatar: '',
    hourlyRate: 1000,
    available: true,
  },
  {
    name: 'Acharya Deepak Vastu',
    category: 'Vastu Shastra',
    experience: 20,
    rating: 4.9,
    bio: 'Leading Vastu expert with 20 years of experience transforming homes and offices. Blends traditional Vastu principles with modern architecture for maximum harmony.',
    avatar: '',
    hourlyRate: 2500,
    available: true,
  },
  {
    name: 'Rekha Pandey',
    category: 'Vastu Shastra',
    experience: 11,
    rating: 4.6,
    bio: 'Vastu consultant for residential and commercial spaces. Focuses on energy alignment, five-element balance, and directional corrections.',
    avatar: '',
    hourlyRate: 1600,
    available: true,
  },
  {
    name: 'Pt. Suresh Palmist',
    category: 'Palmistry',
    experience: 17,
    rating: 4.8,
    bio: 'Master palmist trained in both Indian and Western traditions. Reads the lines of fate, heart, head, and life to reveal a person\'s past, present, and future.',
    avatar: '',
    hourlyRate: 1300,
    available: true,
  },
  {
    name: 'Kavita Menon',
    category: 'Palmistry',
    experience: 7,
    rating: 4.4,
    bio: 'Intuitive palmist and energy reader who combines hand analysis with aura reading for a comprehensive personality and destiny report.',
    avatar: '',
    hourlyRate: 800,
    available: true,
  },
  {
    name: 'Pt. Ramesh Shastri',
    category: 'Puja Services',
    experience: 25,
    rating: 4.9,
    bio: 'Vedic pandit with 25 years of experience conducting Satyanarayan, Griha Pravesh, Navgraha, and Rudrabhishek pujas with full Vedic rituals.',
    avatar: '',
    hourlyRate: 3000,
    available: true,
  },
  {
    name: 'Acharya Mohan Das',
    category: 'Puja Services',
    experience: 16,
    rating: 4.7,
    bio: 'Specialises in Kaal Sarp Dosha puja, Mangal Dosha nivaran, and custom yagnas for health, wealth, and spiritual upliftment.',
    avatar: '',
    hourlyRate: 2200,
    available: true,
  },
  {
    name: 'Panditji Krishnamurthy',
    category: 'Puja Services',
    experience: 20,
    rating: 4.8,
    bio: 'Expert in South Indian Vedic rituals, Homam ceremonies, and Nakshatra-based pujas for individual and family well-being.',
    avatar: '',
    hourlyRate: 2800,
    available: true,
  },
  {
    name: 'Dr. Neha Astro',
    category: 'Horoscope',
    experience: 12,
    rating: 4.7,
    bio: 'Specialises in daily, weekly, and annual horoscope forecasting for all 12 rashis. Integrates Western sun signs with Vedic moon sign analysis.',
    avatar: '',
    hourlyRate: 1100,
    available: true,
  },
  {
    name: 'Acharya Rohit Verma',
    category: 'Horoscope',
    experience: 10,
    rating: 4.5,
    bio: 'Creates personalised annual horoscope reports covering career, love, health, and finance with month-by-month predictions based on planetary positions.',
    avatar: '',
    hourlyRate: 950,
    available: true,
  },
  {
    name: 'Jyotishi Lalita Devi',
    category: 'Horoscope',
    experience: 14,
    rating: 4.6,
    bio: 'Combines Vedic moon sign horoscopes with tarot insights to deliver highly accurate and actionable monthly and yearly predictions.',
    avatar: '',
    hourlyRate: 1250,
    available: true,
  },
  {
    name: 'Pt. Ashok Tiwari',
    category: 'Vedic Astrology',
    experience: 30,
    rating: 5.0,
    bio: 'One of India\'s most respected Jyotishacharyas with 30 years of practice. Known for pinpoint accuracy in predicting major life events through Vimshotarri dasha.',
    avatar: '',
    hourlyRate: 3500,
    available: true,
  },
  {
    name: 'Sonal Mehta',
    category: 'Tarot',
    experience: 4,
    rating: 4.3,
    bio: 'Young and intuitive tarot reader specialising in relationship readings, career crossroads, and spiritual awakening guidance for millennials.',
    avatar: '',
    hourlyRate: 700,
    available: true,
  },
  {
    name: 'Acharya Dinesh Vastu',
    category: 'Vastu Shastra',
    experience: 13,
    rating: 4.5,
    bio: 'Vastu and Feng Shui consultant who blends Eastern wisdom to optimise living and workspaces for prosperity, health, and positive relationships.',
    avatar: '',
    hourlyRate: 1700,
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
