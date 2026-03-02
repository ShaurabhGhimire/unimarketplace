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

export const inboxThreads = [
  {
    id: 't1',
    buyerName: 'Ariana',
    listingTitle: 'IKEA Desk - Perfect for Studying',
    lastMessage: 'Can you meet near the library at 4pm?',
    unread: true,
    updatedAt: '11:42 AM',
  },
  {
    id: 't2',
    buyerName: 'Daniel',
    listingTitle: 'MacBook Pro 2021 14"',
    lastMessage: 'Would you take $1100 if I pick up today?',
    unread: false,
    updatedAt: 'Yesterday',
  },
  {
    id: 't3',
    buyerName: 'Sofia',
    listingTitle: 'Indoor Plants + Pot Set',
    lastMessage: 'Still available?',
    unread: false,
    updatedAt: 'Fri',
  },
];
