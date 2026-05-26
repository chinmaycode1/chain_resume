import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  wallet_address?: string;
}

interface Resume {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  title: string;
  summary: string;
  education: any[];
  experience: any[];
  skills: any[];
  projects: any[];
  links: any[];
}

interface AIScore {
  ats_score: number;
  impact_score: number;
  skill_relevance_score: number;
  overall_score: number;
}

interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Resume state
  resume: Resume | null;
  setResume: (resume: Resume | null) => void;
  
  // AI Score state
  aiScore: AIScore | null;
  setAIScore: (score: AIScore | null) => void;
  
  // Wallet state
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      
      resume: null,
      setResume: (resume) => set({ resume }),
      
      aiScore: null,
      setAIScore: (aiScore) => set({ aiScore }),
      
      walletAddress: null,
      setWalletAddress: (walletAddress) => set({ walletAddress }),
      
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'chainresume-storage',
      partialize: (state) => ({
        user: state.user,
        resume: state.resume,
        aiScore: state.aiScore,
        walletAddress: state.walletAddress,
      }),
    }
  )
);
