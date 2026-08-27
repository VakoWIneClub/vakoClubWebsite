// API endpoint to receive webhooks from Printify

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const event = req.body;
  console.log('Received Printify webhook:', JSON.stringify(event));

  // TODO: verify signature if Printify provides one, update DB, trigger notifications, etc.

  res.status(200).json({ received: true });
};
