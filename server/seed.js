require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./src/models/Service');
const Portfolio = require('./src/models/Portfolio');
const User = require('./src/models/User');
const Client = require('./src/models/Client');

const services = [
  {
    name: 'Large Format Prints',
    slug: 'large-format',
    icon: 'Printer',
    shortDescription: 'High-impact large format printing for outdoor and indoor displays.',
    fullDescription: 'Rokit Media offers premium large format printing services ideal for billboards, signage, banners, and exhibition displays. We use state-of-the-art wide-format printers to deliver sharp, vibrant imagery at any scale. Whether you need a single oversized print or a large production run, our team ensures consistent quality every time.',
    features: ['Billboard printing', 'Outdoor signage', 'Exhibition displays', 'Vehicle wraps', 'Wall graphics', 'UV-resistant inks'],
    startingPrice: '₦5,000',
    turnaround: '2-5 business days',
    featured: true,
    displayOrder: 1,
  },
  {
    name: 'Idea Creation',
    slug: 'idea-creation',
    icon: 'Lightbulb',
    shortDescription: 'Creative concepts and visual strategies that set your brand apart.',
    fullDescription: 'Our creative team works with you to develop original ideas that communicate your brand message powerfully. From campaign concepts to visual storytelling, we bring your vision to life. We combine market insights with artistic talent to produce ideas that are not just beautiful, but strategically effective.',
    features: ['Brand concept development', 'Campaign ideation', 'Visual strategy', 'Mood boards', 'Creative briefs', 'Market research'],
    startingPrice: '₦20,000',
    turnaround: '3-7 business days',
    featured: true,
    displayOrder: 2,
  },
  {
    name: 'Graphic Design',
    slug: 'graphic-design',
    icon: 'Palette',
    shortDescription: 'Professional graphic design for print and digital media.',
    fullDescription: 'From business cards to full publication layouts, our graphic design team delivers eye-catching visuals across all media. We specialise in print design, digital assets, packaging, and corporate stationery. Every design is crafted to reflect your brand identity and communicate your message clearly.',
    features: ['Flyers & posters', 'Business cards', 'Brochures', 'Magazines', 'Packaging design', 'Social media graphics'],
    startingPrice: '₦3,500',
    turnaround: '1-3 business days',
    featured: true,
    displayOrder: 3,
  },
  {
    name: 'Branding',
    slug: 'branding',
    icon: 'Layers',
    shortDescription: 'Complete brand identity development for businesses of all sizes.',
    fullDescription: 'Your brand is more than a logo — it is the entire experience your customers have with you. Rokit Media provides comprehensive branding services including logo design, brand guidelines, color palettes, typography selection, and brand collateral. We have helped hundreds of Nigerian businesses establish powerful, lasting brand identities.',
    features: ['Logo design', 'Brand guidelines', 'Color system', 'Typography', 'Brand stationery', 'Brand audit'],
    startingPrice: '₦30,000',
    turnaround: '5-10 business days',
    featured: true,
    displayOrder: 4,
  },
  {
    name: 'Web Design',
    slug: 'web-design',
    icon: 'Monitor',
    shortDescription: 'Modern, responsive websites that convert visitors into customers.',
    fullDescription: 'We design and develop fast, beautiful, responsive websites that work on all devices. From landing pages to full e-commerce solutions, our web team combines stunning design with solid engineering. Every website we build is SEO-optimised, accessible, and built to grow with your business.',
    features: ['Responsive design', 'E-commerce', 'CMS integration', 'SEO optimization', 'Performance optimised', 'Hosting setup'],
    startingPrice: '₦80,000',
    turnaround: '7-21 business days',
    featured: true,
    displayOrder: 5,
  },
  {
    name: 'Roll-Up Banners',
    slug: 'roll-up-banners',
    icon: 'Flag',
    shortDescription: 'Portable, professional roll-up banners for events and exhibitions.',
    fullDescription: 'Our roll-up banners are perfect for exhibitions, trade shows, office lobbies, and events. We offer print and hardware packages, so you get everything you need in one order. Available in standard and custom sizes with full-colour printing on premium media.',
    features: ['Full-colour print', 'Hardware included', 'Standard & custom sizes', 'Carry bag included', 'Quick turnaround', 'Durable materials'],
    startingPrice: '₦8,000',
    turnaround: '1-3 business days',
    featured: false,
    displayOrder: 6,
  },
];

const portfolioItems = [
  {
    title: 'Aramyd Corporate Branding',
    category: 'branding',
    description: 'Full brand identity including logo, business cards, and stationery for Aramyd Ltd.',
    images: [{ url: 'https://rokitonline.com/img/banner%20jobs/aramyd.jpg', isCover: true }],
    tags: ['branding', 'logo', 'stationery'],
    featured: true,
  },
  {
    title: 'Covenant Church Banner',
    category: 'banner-prints',
    description: 'Large format banner print for Covenant Church event campaign.',
    images: [{ url: 'https://rokitonline.com/img/banner%20jobs/covenant.jpg', isCover: true }],
    tags: ['banner', 'large-format', 'church'],
    featured: true,
  },
];

const clients = [
  { name: 'Covenant Church', logoUrl: 'https://via.placeholder.com/150x60?text=Covenant', displayOrder: 1 },
  { name: 'Aramyd Ltd', logoUrl: 'https://via.placeholder.com/150x60?text=Aramyd', displayOrder: 2 },
  { name: 'Sterling Bank', logoUrl: 'https://via.placeholder.com/150x60?text=Sterling+Bank', displayOrder: 3 },
  { name: 'YOUWIN Nigeria', logoUrl: 'https://via.placeholder.com/150x60?text=YOUWIN', displayOrder: 4 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Service.deleteMany();
    await Portfolio.deleteMany();
    await Client.deleteMany();

    await Service.insertMany(services);
    console.log(`✅ ${services.length} services seeded`);

    await Portfolio.insertMany(portfolioItems);
    console.log(`✅ ${portfolioItems.length} portfolio items seeded`);

    await Client.insertMany(clients);
    console.log(`✅ ${clients.length} clients seeded`);

    // Create admin user if doesn't exist
    const adminEmail = 'admin@rokitmedia.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({ name: 'Rokit Admin', email: adminEmail, password: 'RokitAdmin2026!', role: 'admin' });
      console.log(`✅ Admin user created: ${adminEmail} / RokitAdmin2026!`);
    } else {
      console.log(`ℹ️  Admin user already exists`);
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
