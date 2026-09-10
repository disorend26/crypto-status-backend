export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // OKX ve Binance için kimlik istemeyen public endpoint'leri çağırıyoruz
    const [binance, okx] = await Promise.allSettled([
      // Binance public exchange info (ağ durumlarını da içerir)
      fetch('https://api.binance.com/api/v3/exchangeInfo', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }).then(r => r.json()),
      
      // OKX public instruments (Auth istemez)
      fetch('https://www.okx.com/api/v5/public/instruments?instType=SPOT').then(r => r.json())
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
