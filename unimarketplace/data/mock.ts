export type MarketplaceItem = {
  id: string;
  title: string;
  price: number;
  seller: string;
  college: string;
  imageUrl: string;
  sellerAvatar: string;
  daysLeft?: string;
};

export type MessageThread = {
  id: string;
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
    title: 'IKEA Desk - Perfect for Studying',
    price: 45,
    seller: 'Sarah Chen',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1616627453385-7087e8d3f8f0?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    daysLeft: '5d left',
  },
  {
    id: '2',
    title: 'MacBook Pro 2021 14"',
    price: 1200,
    seller: 'Alex Kim',
    college: 'MIT',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    title: 'Business Statistics Textbook',
    price: 32,
    seller: 'Maya Patel',
    college: 'Stanford',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    title: 'Indoor Plants + Pot Set',
    price: 28,
    seller: 'Ethan Ross',
    college: 'Harvard',
    imageUrl:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
    sellerAvatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80',
    daysLeft: '10d left',
  },
];

export const messageThreads: MessageThread[] = [
  {
    id: 't1',
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
};
