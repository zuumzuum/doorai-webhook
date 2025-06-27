import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/customers - Fetch all customers
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement actual Supabase query when database schema is ready
    // Example implementation:
    // const { data: customers, error } = await supabase
    //   .from('customers')
    //   .select(`
    //     id,
    //     name,
    //     email,
    //     phone,
    //     status,
    //     language,
    //     inquiry_date,
    //     last_contact,
    //     budget,
    //     area,
    //     messages,
    //     appointments,
    //     tags,
    //     hot_score,
    //     last_activity,
    //     response_time,
    //     engagement_level,
    //     property_views,
    //     follow_up_count
    //   `)
    //   .order('hot_score', { ascending: false });
    // 
    // if (error) {
    //   console.error('Supabase error:', error);
    //   return NextResponse.json(
    //     { error: 'Failed to fetch customers' },
    //     { status: 500 }
    //   );
    // }
    // 
    // return NextResponse.json(customers);

    // Mock response for development - remove when backend is ready
    const mockCustomers = [
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
      // Add more mock customers as needed
    ];

    return NextResponse.json(mockCustomers);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Implement customer creation when database schema is ready
    // Example implementation:
    // const { data: customer, error } = await supabase
    //   .from('customers')
    //   .insert([body])
    //   .select()
    //   .single();
    // 
    // if (error) {
    //   console.error('Supabase error:', error);
    //   return NextResponse.json(
    //     { error: 'Failed to create customer' },
    //     { status: 500 }
    //   );
    // }
    // 
    // return NextResponse.json(customer, { status: 201 });

    // Mock response for development
    console.log('Creating customer:', body);
    return NextResponse.json(
      { message: 'Customer creation endpoint ready for backend implementation' },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}