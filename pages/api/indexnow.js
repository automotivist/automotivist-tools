// pages/api/indexnow.js — IndexNow protocol for instant Bing indexing
const INDEXNOW_KEY = 'automotivist-tools-indexnow-2026';
const HOST = 'https://tools.automotivist.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).json({ error: 'urls array required' });
  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: `${HOST}/${INDEXNOW_KEY}.txt`, urlList: urls }),
    });
    res.status(200).json({ status: response.status, submitted: urls.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
