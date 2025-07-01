import crypto from 'crypto';

export async function verifyLineSignature(body: string, signature: string): Promise<boolean> {
  try {
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    if (!channelSecret) {
      console.error('LINE_CHANNEL_SECRET is not set');
      return false;
    }

    console.log('Verifying LINE signature...');
    console.log('Channel Secret exists:', !!channelSecret);
    console.log('Signature received:', signature);

    const hash = crypto
      .createHmac('sha256', channelSecret)
      .update(body, 'utf8')
      .digest('base64');

    // LINE署名は 'sha256=' プレフィックスなしで送信される
    const expectedSignature = hash;
    const result = signature === expectedSignature;

    console.log('Generated hash:', hash);
    console.log('Signature valid:', result);

    return result;
  } catch (error) {
    console.error('Error verifying LINE signature:', error);
    return false;
  }
} 