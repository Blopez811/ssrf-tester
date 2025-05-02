const express = require('express');
const axios = require('axios');
const app = express();

PORT = process.env.PORT || 3001
app.use(express.json());

app.get('/', (req, res) => res.send('OK'));

app.post('/fetch', async (req, res) => {
  const { url } = req.body;
  console.log(`Attempting to fetch: ${url}`);
  try {
    const response = await axios.get(url, { timeout: 3000 });
    console.log(`Fetched successfully: ${response.status}`);
    res.send({
      status: response.status,
      headers: response.headers,
      data: response.data
    });
  } catch (err) {
    console.error('Error occurred while fetching:', err.message);
    res.status(500).send(err.toString());
  }
});

try{
  app.listen(3001, () => console.log(`SSRF Tester running on port ${PORT}`));

} catch (err) {
  console.log('failed to start server: ', err)
}






