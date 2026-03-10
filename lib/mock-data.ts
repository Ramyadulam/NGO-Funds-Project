
export interface NGO {
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
    goal: number;
    raised: number;
}

export interface Donation {
    id: string;
    ngoId: string;
    ngoName: string;
    amount: number;
    date: string;
    transactionHash: string;
}

export const MOCK_NGOS: NGO[] = [
    {
        id: '1',
        name: 'Global Health Initiative',
        description: 'Providing essential healthcare services to underserved communities worldwide.',
        category: 'Healthcare',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=250',
        goal: 50000,
        raised: 35000,
    },
    {
        id: '2',
        name: 'Education for All',
        description: 'Empowering children through quality education and learning resources.',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400&h=250',
        goal: 30000,
        raised: 12000,
    },
    {
        id: '3',
        name: 'Green Earth Foundation',
        description: 'Protecting our planet through reforestation and sustainable practices.',
        category: 'Environment',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=400&h=250',
        goal: 100000,
        raised: 75000,
    },
    {
        id: '4',
        name: 'Clean Water Project',
        description: 'Building sustainable water systems for communities in need.',
        category: 'Sanitation',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400&h=250',
        goal: 25000,
        raised: 18000,
    },
];

export const MOCK_DONATIONS: Donation[] = [
    {
        id: 'd1',
        ngoId: '1',
        ngoName: 'Global Health Initiative',
        amount: 500,
        date: '2026-01-15',
        transactionHash: '0x123...abc',
    },
    {
        id: 'd2',
        ngoId: '3',
        ngoName: 'Green Earth Foundation',
        amount: 1000,
        date: '2026-01-13',
        transactionHash: '0x456...def',
    },
];
