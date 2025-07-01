// Public LINE Webhook using Pages Router to bypass Vercel auth
export default function handler(req, res) {
  console.log(`🔍 LINE Webhook (Pages Router) - ${req.method}`);
  console.log('Query:', req.query);
  console.log('Headers:', req.headers);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Line-Signature');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    const tenantId = req.query.tenantId || 'not specified';
    
    return res.status(200).json({
      message: 'LINE Webhook Endpoint - Pages Router',
      tenantId: tenantId,
      method: 'GET',
      timestamp: new Date().toISOString(),
      status: 'active',
      note: 'This is a public endpoint using Pages Router to bypass authentication'
    });
  }
  
  if (req.method === 'POST') {
    const tenantId = req.query.tenantId || 'not specified';
    
    console.log('POST request body:', req.body);
    
    // For LINE webhook, return 200 OK
    return res.status(200).json({
      message: 'Webhook received',
      tenantId: tenantId,
      timestamp: new Date().toISOString()
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 