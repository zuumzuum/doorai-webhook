'use client';

import useSWR from 'swr';
import { supabase } from '@/lib/supabase';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'contacted' | 'viewing' | 'negotiating' | 'converted' | 'lost';
  language: 'jp' | 'en';
  inquiryDate: string;
  lastContact: string;
  budget: string;
  area: string;
  messages: number;
  appointments: number;
  tags: string[];
  hotScore: number;
  lastActivity: string;
  responseTime: number; // in minutes
  engagementLevel: 'low' | 'medium' | 'high';
  propertyViews: number;
  followUpCount: number;
}

interface HotScoreFactors {
  recentActivity: number;
  responseSpeed: number;
  engagement: number;
  budget: number;
  propertyViews: number;
  followUps: number;
}

// SWR fetcher function for customers
const customersFetcher = async (url: string): Promise<Customer[]> => {
  // TODO: Replace with actual Supabase query when backend is implemented
  // Example implementation:
  // const { data, error } = await supabase
  //   .from('customers')
  //   .select('*')
  //   .order('hot_score', { ascending: false });
  // 
  // if (error) throw error;
  // return data;

  // Mock data for development - remove when backend is ready
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const mockCustomers: Customer[] = [
    {
      id: 1,
      name: '田中太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
      status: 'negotiating',
      language: 'jp',
      inquiryDate: '2024-01-15',
      lastContact: '2時間前',
      budget: '10-12万円',
      area: '新宿区',
      messages: 12,
      appointments: 2,
      tags: ['初回来店', 'ペット可希望'],
      hotScore: 85,
      lastActivity: '2024-01-20T14:30:00Z',
      responseTime: 5,
      engagementLevel: 'high',
      propertyViews: 8,
      followUpCount: 3
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily@example.com',
      phone: '080-9876-5432',
      status: 'viewing',
      language: 'en',
      inquiryDate: '2024-01-14',
      lastContact: '5時間前',
      budget: '15-20万円',
      area: '渋谷区',
      messages: 8,
      appointments: 1,
      tags: ['外国人', '英語対応'],
      hotScore: 72,
      lastActivity: '2024-01-20T11:00:00Z',
      responseTime: 15,
      engagementLevel: 'high',
      propertyViews: 5,
      followUpCount: 2
    },
    {
      id: 3,
      name: '佐藤花子',
      email: 'sato@example.com',
      phone: '070-1111-2222',
      status: 'contacted',
      language: 'jp',
      inquiryDate: '2024-01-10',
      lastContact: '3日前',
      budget: '8-10万円',
      area: '品川区',
      messages: 5,
      appointments: 0,
      tags: ['学生割引', '保証人不要'],
      hotScore: 45,
      lastActivity: '2024-01-17T09:15:00Z',
      responseTime: 120,
      engagementLevel: 'medium',
      propertyViews: 3,
      followUpCount: 1
    },
    {
      id: 4,
      name: '山田次郎',
      email: 'yamada@example.com',
      phone: '090-3333-4444',
      status: 'converted',
      language: 'jp',
      inquiryDate: '2024-01-12',
      lastContact: '1日前',
      budget: '12-15万円',
      area: '池袋周辺',
      messages: 15,
      appointments: 3,
      tags: ['成約済', 'リピーター'],
      hotScore: 95,
      lastActivity: '2024-01-19T16:45:00Z',
      responseTime: 2,
      engagementLevel: 'high',
      propertyViews: 12,
      followUpCount: 5
    },
    {
      id: 5,
      name: '鈴木美里',
      email: 'suzuki@example.com',
      phone: '080-5555-6666',
      status: 'lead',
      language: 'jp',
      inquiryDate: '2024-01-18',
      lastContact: '1時間前',
      budget: '9-11万円',
      area: '池袋',
      messages: 3,
      appointments: 0,
      tags: ['新規', '急ぎ'],
      hotScore: 68,
      lastActivity: '2024-01-20T15:00:00Z',
      responseTime: 8,
      engagementLevel: 'medium',
      propertyViews: 2,
      followUpCount: 0
    },
    {
      id: 6,
      name: '高橋一郎',
      email: 'takahashi@example.com',
      phone: '070-7777-8888',
      status: 'lost',
      language: 'jp',
      inquiryDate: '2024-01-05',
      lastContact: '1週間前',
      budget: '7-9万円',
      area: '上野',
      messages: 4,
      appointments: 1,
      tags: ['価格重視', '条件厳しい'],
      hotScore: 25,
      lastActivity: '2024-01-13T10:30:00Z',
      responseTime: 240,
      engagementLevel: 'low',
      propertyViews: 1,
      followUpCount: 2
    }
  ];

  return mockCustomers;
};

// SWR fetcher for updating customer status
const updateCustomerStatusFetcher = async (url: string, { arg }: { arg: { customerId: number; status: Customer['status'] } }) => {
  // TODO: Replace with actual Supabase update when backend is implemented
  // Example implementation:
  // const { data, error } = await supabase
  //   .from('customers')
  //   .update({ status: arg.status })
  //   .eq('id', arg.customerId)
  //   .select()
  //   .single();
  // 
  // if (error) throw error;
  // return data;

  // Mock implementation for development
  console.log(`Updating customer ${arg.customerId} status to ${arg.status}`);
  return { id: arg.customerId, status: arg.status };
};

export function useHotScore() {
  // SWR for fetching customers with cache key
  const { 
    data: customers = [], 
    error, 
    isLoading,
    mutate
  } = useSWR('/api/customers', customersFetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Dedupe requests within 5 seconds
  });

  const calculateHotScore = (customer: Omit<Customer, 'hotScore'>): number => {
    const factors: HotScoreFactors = {
      recentActivity: calculateRecentActivityScore(customer.lastActivity),
      responseSpeed: calculateResponseSpeedScore(customer.responseTime),
      engagement: calculateEngagementScore(customer.engagementLevel),
      budget: calculateBudgetScore(customer.budget),
      propertyViews: Math.min(customer.propertyViews * 5, 25), // Max 25 points
      followUps: Math.min(customer.followUpCount * 3, 15) // Max 15 points
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);
    return Math.min(Math.round(totalScore), 100);
  };

  const calculateRecentActivityScore = (lastActivity: string): number => {
    const now = new Date();
    const activityDate = new Date(lastActivity);
    const hoursDiff = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff <= 1) return 25;
    if (hoursDiff <= 6) return 20;
    if (hoursDiff <= 24) return 15;
    if (hoursDiff <= 72) return 10;
    if (hoursDiff <= 168) return 5; // 1 week
    return 0;
  };

  const calculateResponseSpeedScore = (responseTime: number): number => {
    if (responseTime <= 5) return 20;
    if (responseTime <= 15) return 15;
    if (responseTime <= 60) return 10;
    if (responseTime <= 120) return 5;
    return 0;
  };

  const calculateEngagementScore = (level: 'low' | 'medium' | 'high'): number => {
    switch (level) {
      case 'high': return 20;
      case 'medium': return 10;
      case 'low': return 0;
      default: return 0;
    }
  };

  const calculateBudgetScore = (budget: string): number => {
    // Extract numeric value from budget string
    const match = budget.match(/(\d+)/);
    if (!match) return 0;
    
    const budgetAmount = parseInt(match[1]);
    if (budgetAmount >= 15) return 15;
    if (budgetAmount >= 12) return 12;
    if (budgetAmount >= 10) return 10;
    if (budgetAmount >= 8) return 8;
    return 5;
  };

  const updateCustomerStatus = async (customerId: number, newStatus: Customer['status']) => {
    // Optimistic update - update local data immediately
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: newStatus }
        : customer
    );
    
    // Update local cache optimistically
    mutate(updatedCustomers, false);

    try {
      // TODO: Replace with actual API call when backend is implemented
      // await updateCustomerStatusFetcher('/api/customers/update', { 
      //   arg: { customerId, status: newStatus } 
      // });
      
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Customer ${customerId} status updated to ${newStatus}`);
      
      // Revalidate to ensure data consistency
      mutate();
    } catch (error) {
      // Revert optimistic update on error
      mutate();
      console.error('Failed to update customer status:', error);
      throw error;
    }
  };

  const getHotScoreColor = (score: number): string => {
    if (score >= 80) return 'text-red-600 dark:text-red-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getHotScoreLabel = (score: number): string => {
    if (score >= 80) return 'ホット';
    if (score >= 60) return 'ウォーム';
    if (score >= 40) return 'ミディアム';
    return 'コールド';
  };

  const getCustomersByStatus = (status: Customer['status']) => {
    return customers.filter(customer => customer.status === status);
  };

  const getTopHotCustomers = (limit: number = 5) => {
    return [...customers]
      .sort((a, b) => b.hotScore - a.hotScore)
      .slice(0, limit);
  };

  return {
    customers,
    isLoading,
    error,
    calculateHotScore,
    updateCustomerStatus,
    getHotScoreColor,
    getHotScoreLabel,
    getCustomersByStatus,
    getTopHotCustomers,
    mutate // Expose mutate for manual revalidation
  };
}