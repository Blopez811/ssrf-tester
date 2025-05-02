const express = require('express');
const axios = require('axios');
const app = express();
const { exec } = require('child_process');
const fs = require('fs');
const dns = require('dns');

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

app.post('/exec', (req, res) => {
  const { cmd } = req.body;
  console.log(`Executing command: ${cmd}`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return res.status(500).send(err.message);
    }
    res.send({
      stdout,
      stderr
    });
  });
});

app.get('/env', (req, res) => {
  res.send(process.env);
});

app.post('/dns', (req, res) => {
  const { hostname } = req.body;
  dns.lookup(hostname, (err, address, family) => {
    if (err) return res.status(500).send(err.toString());
    res.send({ address, family });
  });
});

app.post('/read', (req, res) => {
  const { path } = req.body;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err.toString());
    res.send(data);
  });
});

app.post('/ping', (req, res) => {
  const { target } = req.body;
  exec(`ping -c 2 ${target}`, (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);
    res.send(stdout);
  });
});



try{
  app.listen(3001, () => console.log(`SSRF Tester running on port ${PORT}`));

} catch (err) {
  console.log('failed to start server: ', err)
}






