// API utility functions for frontend-backend communication

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth token
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    if (!token) console.warn('API Warning: No auth token found in localStorage');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// User/Auth API
export const authAPI = {
    register: async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        return res.json();
    },
    login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },
    getMe: async () => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },
};

// NGO API
export const ngoAPI = {
    getAll: async (category?: string, search?: string) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (search) params.append('search', search);

        const res = await fetch(`${API_BASE_URL}/ngos?${params.toString()}`);
        return res.json();
    },
    getById: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/ngos/${id}`);
        return res.json();
    },
    getStats: async () => {
        const res = await fetch(`${API_BASE_URL}/ngos/stats/overview`);
        return res.json();
    },
    create: async (data: {
        name: string;
        description: string;
        category: string;
        location: string;
        targetAmount: number;
        image?: string;
        walletAddress?: string;
        isRegisteredOnChain?: boolean;
    }) => {
        const res = await fetch(`${API_BASE_URL}/ngos`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return res.json();
    },
    update: async (id: string, data: Partial<{
        name: string;
        description: string;
        category: string;
        location: string;
        targetAmount: number;
        image?: string;
    }>) => {
        const res = await fetch(`${API_BASE_URL}/ngos/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return res.json();
    },
    delete: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/ngos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return res.json();
    },
};

// Donation API
export const donationAPI = {
    getUserDonations: async () => {
        const res = await fetch(`${API_BASE_URL}/donations`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },
    getUserStats: async () => {
        const res = await fetch(`${API_BASE_URL}/donations/stats/me`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },
    create: async (ngoId: string, amount: number, message?: string, blockchainHash?: string, blockNumber?: number) => {
        const res = await fetch(`${API_BASE_URL}/donations`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ngoId, amount, message, blockchainHash, blockNumber, paymentMethod: blockchainHash ? 'ethereum' : 'credit-card' }),
        });
        return res.json();
    },
    getNGODonations: async (ngoId: string) => {
        const res = await fetch(`${API_BASE_URL}/donations/ngo/${ngoId}`);
        return res.json();
    },
    getAllDonations: async () => {
        const res = await fetch(`${API_BASE_URL}/donations/admin/all`, {
            headers: getAuthHeaders(),
        });
        return res.json();
    },
};

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface NGO {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    targetAmount: number;
    raisedAmount: number;
    image: string;
    walletAddress?: string;
    isActive: boolean;
    progress: number;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
}

export interface Donation {
    _id: string;
    amount: number;
    ngo: NGO;
    donor: User;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    message?: string;
    isAnonymous: boolean;
    transactionId: string;
    blockchainHash?: string;
    blockNumber?: number;
    createdAt: string;
}
