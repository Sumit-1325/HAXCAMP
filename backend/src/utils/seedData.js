const image = (slug) => `https://picsum.photos/seed/nexora-${slug}/800/600`;

export const SEED_PRODUCTS = [
  {
    name: 'Aurora Wireless Headphones',
    description:
      'Over-ear ANC headphones with 40-hour battery life, memory-foam earcups and a low-latency dongle for calls.',
    price: 8999,
    category: 'Audio',
    image: image('aurora-headphones'),
    stock: 24,
  },
  {
    name: 'PulsePro Wireless Earbuds',
    description:
      'Compact TWS earbuds with active noise cancellation, transparency mode and a pocketable charging case.',
    price: 4499,
    category: 'Audio',
    image: image('pulsepro-earbuds'),
    stock: 38,
  },
  {
    name: 'KeyForge Mechanical Keyboard',
    description:
      'Hot-swappable 75% mechanical keyboard with gasket mount, PBT keycaps and per-key RGB lighting.',
    price: 6499,
    category: 'Keyboards',
    image: image('keyforge-keyboard'),
    stock: 16,
  },
  {
    name: 'SlimType Wireless Keyboard',
    description:
      'Low-profile scissor-switch keyboard that pairs with three devices at once over Bluetooth.',
    price: 2999,
    category: 'Keyboards',
    image: image('slimtype-keyboard'),
    stock: 4,
  },
  {
    name: 'GlidePro Wireless Mouse',
    description:
      'Ergonomic 6-button mouse with a 16K DPI sensor and silent switches.',
    price: 2499,
    category: 'Mice',
    image: image('glidepro-mouse'),
    stock: 42,
  },
  {
    name: 'PrecisionErgo Vertical Mouse',
    description:
      'Vertical-grip mouse designed to keep the wrist neutral during long work sessions.',
    price: 3499,
    category: 'Mice',
    image: image('precisionergo-mouse'),
    stock: 3,
  },
  {
    name: 'ClearView 27" 4K Monitor',
    description:
      '27-inch 4K IPS display with 99% sRGB coverage, USB-C 65W power delivery and a height-adjustable stand.',
    price: 24999,
    category: 'Monitors',
    image: image('clearview-27'),
    stock: 11,
  },
  {
    name: 'UltraWide 34" Curved Monitor',
    description:
      '34-inch 21:9 curved ultrawide for split-screen workflows, with a built-in KVM switch.',
    price: 38999,
    category: 'Monitors',
    image: image('ultrawide-34'),
    stock: 6,
  },
  {
    name: 'FocusCam HD Webcam',
    description:
      '1080p60 webcam with autofocus, dual noise-cancelling mics and a privacy shutter.',
    price: 4999,
    category: 'Webcams',
    image: image('focuscam-hd'),
    stock: 21,
  },
  {
    name: 'DeskMate Laptop Stand',
    description:
      'Aluminium laptop riser with adjustable height that lifts the screen to eye level.',
    price: 1999,
    category: 'Accessories',
    image: image('deskmate-stand'),
    stock: 30,
  },
  {
    name: 'CableNest Organizer Kit',
    description:
      'Magnetic cable clips, sleeves and a weighted base to keep a desk free of clutter.',
    price: 899,
    category: 'Accessories',
    image: image('cablenest-kit'),
    stock: 0,
  },
  {
    name: 'LumaBar Desk Light',
    description:
      'Screen-bar lamp with adjustable colour temperature and zero glare on the monitor.',
    price: 3299,
    category: 'Lighting',
    image: image('lumabar-light'),
    stock: 18,
  },
  {
    name: 'Halo Ring Light',
    description:
      '10-inch ring light with a tripod and phone mount for video calls and recording.',
    price: 2799,
    category: 'Lighting',
    image: image('halo-ringlight'),
    stock: 2,
  },
];
