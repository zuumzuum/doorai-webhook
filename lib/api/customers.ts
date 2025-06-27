'use client';

import { Customer } from '@/lib/hooks/use-hot-score';

// API client functions for customer operations
export const customerApi = {
  // Fetch all customers
  async getCustomers(): Promise<Customer[]> {
    const response = await fetch('/api/customers');
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  },

  // Fetch specific customer
  async getCustomer(id: number): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer ${id}`);
    }
    return response.json();
  },

  // Create new customer
  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      throw new Error('Failed to create customer');
    }
    return response.json();
  },

  // Update customer
  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update customer ${id}`);
    }
    return response.json();
  },

  // Delete customer
  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete customer ${id}`);
    }
  },

  // Update customer status
  async updateCustomerStatus(id: number, status: Customer['status']): Promise<Customer> {
    return this.updateCustomer(id, { status });
  },
};

// SWR cache keys for consistent caching
export const customerCacheKeys = {
  all: '/api/customers',
  detail: (id: number) => `/api/customers/${id}`,
  byStatus: (status: Customer['status']) => `/api/customers?status=${status}`,
  search: (query: string) => `/api/customers?search=${encodeURIComponent(query)}`,
};