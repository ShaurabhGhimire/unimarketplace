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
  { id: 'decor', label: 'Decor', icon: 'weekend' },
  { id: 'clothing', label: 'Clothing', icon: 'checkroom' },
  { id: 'sports', label: 'Sports', icon: 'sports-basketball' },
  { id: 'other', label: 'Other', icon: 'category' },
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
    id: '5',
    category: 'decor',
    title: 'Aesthetic Fairy Light Set',
    price: 14,
    seller: 'Nina Brooks',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
    description: 'Warm white fairy lights perfect for decorating a dorm room or apartment.',
    location: 'Harvard Yard',
    postedAt: '2026-03-13',
    condition: 'Like New',
  },
  {
    id: '6',
    category: 'clothing',
    title: 'North Face Puffer Jacket (M)',
    price: 55,
    seller: 'Jordan Lee',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    description: 'Barely worn puffer jacket in size medium. Great for cold New England winters.',
    location: 'Stata Center',
    postedAt: '2026-03-15',
    condition: 'Like New',
  },
  {
    id: '7',
    category: 'sports',
    title: 'Yoga Mat + Resistance Bands',
    price: 20,
    seller: 'Priya Sharma',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1601925228689-f41af3e36f08?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    description: 'Non-slip yoga mat with a set of three resistance bands. Lightly used.',
    location: 'Lamont Library',
    postedAt: '2026-03-11',
    condition: 'Good',
  },
  {
    id: '8',
    category: 'other',
    title: 'Desk Fan + Humidifier Bundle',
    price: 30,
    seller: 'Leo Martinez',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    description: 'Small desk fan and mini humidifier sold together. Great for dorm comfort.',
    location: 'Harvard Square',
    postedAt: '2026-03-10',
    condition: 'Good',
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
    listingId: '3',
    userName: 'Maya Patel',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    listingTitle: 'Business Statistics Textbook',
    listingImage:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'I can meet after my 2 PM class if that works for you.',
    updatedAt: '11:12 AM',
    unreadCount: 1,
  },
  {
    id: 't4',
    listingId: '4',
    userName: 'Daniel Park',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    listingTitle: 'Mini Rice Cooker',
    listingImage:
      'https://images.unsplash.com/photo-1585515656763-7e84c8f2f0f0?auto=format&fit=crop&w=400&q=80',
    lastMessage: 'Yes, the rice cooker is still available.',
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
