export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const [binance, okx] = await Promise.allSettled([
      fetch('https://api.binance.com/api/v3/ticker/24hr').then(r => r.json()),
      fetch('https://www.okx.com/api/v5/market/tickers?instType=SPOT').then(r => r.json())
    ]);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        binance: binance.status === 'fulfilled' ? binance.value : null,
        okx: okx.status === 'fulfilled' ? okx.value : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
