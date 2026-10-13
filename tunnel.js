const localtunnel = require('localtunnel');
const http = require('http');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log('----------------------------------------------------');
    console.log('🚀 JeevanSeva is LIVE on the Internet!');
    console.log('🌐 Public URL:', tunnel.url);
    console.log('🔑 Tunnel IP Password (if asked): 171.61.2.10');
    console.log('----------------------------------------------------');

    tunnel.on('close', () => {
      console.log('Tunnel closed.');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
  }
})();
