export type MarketplaceItem = {
  id: string;
  category?: string;
  title: string;
  price: number;
  seller: string;
  college: string;
  imageUrl: string;
  sellerAvatar: string;
  daysLeft?: string;
  description?: string;
  location?: string;
  postedAt?: string;
  condition?: string;
};

export type MessageThread = {
  id: string;
  listingId: string;
  userName: string;
  avatar: string;
  listingTitle: string;
  listingImage: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
};

export const categoryFilters = [
  { id: 'all', label: 'All', icon: 'home' },
  { id: 'furniture', label: 'Furniture', icon: 'chair' },
  { id: 'electronics', label: 'Electronics', icon: 'laptop' },
  { id: 'books', label: 'Books', icon: 'menu-book' },
  { id: 'kitchen', label: 'Kitchen', icon: 'restaurant' },
];

export const locationFilters = ['My College', 'Nearby Colleges', 'All Colleges'];

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    category: 'furniture',
    title: 'IKEA Desk - Perfect for Studying',
    price: 45,
    seller: 'Sarah Chen',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1616627453385-7087e8d3f8f0?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    daysLeft: '5d left',
    description: 'A sturdy IKEA desk with plenty of workspace. Ideal for dorm rooms, apartments, or a study corner.',
    location: 'MIT Campus Center',
    postedAt: '2026-03-10',
    condition: 'Like New',
  },
  {
    id: '2',
    category: 'electronics',
    title: 'MacBook Pro 2021 14"',
    price: 1200,
    seller: 'Alex Kim',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    description: 'M1 Pro MacBook in excellent condition with charger included. Great battery health and no dents.',
    location: 'MIT Student Center',
    postedAt: '2026-03-12',
    condition: 'Good',
  },
  {
    id: '3',
    category: 'books',
    title: 'Business Statistics Textbook',
    price: 32,
    seller: 'Maya Patel',
    college: 'Stanford',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    description: 'Business statistics textbook with light notes inside. Useful for intro business and econ classes.',
    location: 'Stanford Main Quad',
    postedAt: '2026-03-08',
    condition: 'Fair',
  },
  {
    id: '4',
    category: 'kitchen',
    title: 'Indoor Plants + Pot Set',
    price: 28,
    seller: 'Ethan Ross',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80',
    daysLeft: '10d left',
    description: 'A bundle of easy-care indoor plants with ceramic pots. Perfect for brightening up a dorm room.',
    location: 'Harvard Yard',
    postedAt: '2026-03-14',
    condition: 'Good',
  },
  {
    id: '5',
    category: 'furniture',
    title: 'Rolling Storage Cart for Dorm',
    price: 24,
    seller: 'Nina Brooks',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
    description: 'Slim rolling cart that fits beside a desk or bed. Great for snacks, notebooks, and chargers.',
    location: 'Harvard Science Center',
    postedAt: '2026-03-13',
    condition: 'Good',
  },
  {
    id: '6',
    category: 'electronics',
    title: 'Sony Noise Cancelling Headphones',
    price: 140,
    seller: 'Jordan Lee',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    daysLeft: '3d left',
    description: 'Comfortable over-ear headphones with strong battery life and a carrying case.',
    location: 'Stata Center',
    postedAt: '2026-03-15',
    condition: 'Like New',
  },
  {
    id: '7',
    category: 'books',
    title: 'Organic Chemistry Study Bundle',
    price: 38,
    seller: 'Priya Sharma',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    description: 'Textbook, solution manual, and color-coded reaction sheets used for midterms and finals.',
    location: 'Lamont Library',
    postedAt: '2026-03-11',
    condition: 'Fair',
  },
  {
    id: '8',
    category: 'kitchen',
    title: 'Mini Rice Cooker',
    price: 26,
    seller: 'Daniel Park',
    college: 'Stanford',
    imageUrl:
      'https://images.unsplash.com/photo-1585515656763-7e84c8f2f0f0?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    description: 'Compact rice cooker that is ideal for dorm cooking and quick meals.',
    location: 'Tresidder Memorial Union',
    postedAt: '2026-03-09',
    condition: 'Good',
  },
  {
    id: '9',
    category: 'furniture',
    title: 'Bedside Lamp with USB Port',
    price: 18,
    seller: 'Grace Miller',
    college: 'University of California, Berkeley',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    description: 'Warm light lamp with a built-in USB charging port and compact base.',
    location: 'Sproul Plaza',
    postedAt: '2026-03-12',
    condition: 'Like New',
  },
  {
    id: '10',
    category: 'electronics',
    title: '27-inch Monitor for Remote Work',
    price: 110,
    seller: 'Marcus White',
    college: 'University of California, Berkeley',
    imageUrl:
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80',
    daysLeft: '2d left',
    description: 'Crisp 1080p monitor with HDMI cable included. Works well for coding and classes.',
    location: 'Doe Library',
    postedAt: '2026-03-16',
    condition: 'Good',
  },
  {
    id: '11',
    category: 'books',
    title: 'Data Structures Interview Prep Set',
    price: 22,
    seller: 'Olivia Nguyen',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    description: 'Three popular prep books with notes and highlighted problem-solving patterns.',
    location: 'MIT Hayden Library',
    postedAt: '2026-03-07',
    condition: 'Good',
  },
  {
    id: '12',
    category: 'kitchen',
    title: 'Kitchen Starter Pack',
    price: 34,
    seller: 'Leo Martinez',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    description: 'Pan, spatula, bowls, and utensils bundled together for an off-campus apartment setup.',
    location: 'Harvard Square',
    postedAt: '2026-03-10',
    condition: 'Fair',
  },
];

export const messageThreads: MessageThread[] = [
  {
    id: 't1',
    listingId: '1',
    userName: 'Sarah Chen',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    listingTitle: 'IKEA Desk - Perfect for Studying',
    listingImage:
      'https://images.unsplash.com/photo-1616627453385-7087e8d3f8f0?auto=format&fit=crop&w=400&q=80',
    lastMessage: "Yes, it's still available! When can you pick it up?",
    updatedAt: '04:30 AM',
    unreadCount: 1,
  },
  {
    id: 't2',
    listingId: '2',
    userName: 'Alex Kim',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    listingTitle: 'MacBook Pro 2021 14"',
    listingImage:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'Thanks for asking! No scratches at all.',
    updatedAt: '01:45 PM',
    unreadCount: 0,
  },
  {
    id: 't3',
    listingId: '6',
    userName: 'Jordan Lee',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    listingTitle: 'Sony Noise Cancelling Headphones',
    listingImage:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'I can meet after my 2 PM class if that works for you.',
    updatedAt: '11:12 AM',
    unreadCount: 1,
  },
  {
    id: 't4',
    listingId: '10',
    userName: 'Marcus White',
    avatar:
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80',
    listingTitle: '27-inch Monitor for Remote Work',
    listingImage:
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'Yes, the monitor stand is included.',
    updatedAt: 'Yesterday',
    unreadCount: 0,
  },
];

export const threadMessages: Record<string, ChatMessage[]> = {
  t1: [
    { id: 'm1', sender: 'other', text: 'Hi! Is this still available?', time: '04:00 AM' },
    {
      id: 'm2',
      sender: 'me',
      text: "Yes, it's still available! When can you pick it up?",
      time: '04:30 AM',
    },
    { id: 'm3', sender: 'other', text: 'Great! How about tomorrow afternoon?', time: '04:35 AM' },
  ],
  t2: [
    {
      id: 'm4',
      sender: 'other',
      text: 'Thanks for asking! No scratches at all.',
      time: '01:45 PM',
    },
  ],
  t3: [
    { id: 'm5', sender: 'me', text: 'Could you do $120 if I pick up today?', time: '10:58 AM' },
    {
      id: 'm6',
      sender: 'other',
      text: 'I can meet after my 2 PM class if that works for you.',
      time: '11:12 AM',
    },
  ],
  t4: [
    { id: 'm7', sender: 'me', text: 'Is the monitor stand included too?', time: 'Yesterday' },
    { id: 'm8', sender: 'other', text: 'Yes, the monitor stand is included.', time: 'Yesterday' },
  ],
};
