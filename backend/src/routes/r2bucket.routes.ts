import express from 'express';
import axios from 'axios';

const router = express.Router();

const R2_BASE_URL = process.env.CLOUDFLARE_R2_BUCKET_URL;

if (!R2_BASE_URL) {
  console.error('CLOUDFLARE_R2_BUCKET_URL environment variable is missing!');
}

router.get('/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  try {
    const r2Response = await axios.get(`${R2_BASE_URL}/${fileName}`, {
      responseType: 'stream', // to pipe large files
    });

    // Set CORS and caching headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', r2Response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    r2Response.data.pipe(res); // stream it to the client
  } catch (error) {
    console.error('Failed to fetch from R2:', error);
    res.status(500).send('Failed to fetch model.');
  }
});

export default router;