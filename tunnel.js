const { spawn } = require('child_process');
const path = require('path');

process.env.PATH = `${process.env.PATH};C:\\Program Files (x86)\\cloudflared;C:\\Program Files\\cloudflared`;

console.log('🚀 Starting Cloudflare Tunnel for JeevanSeva...');

const cloudflared = spawn('cloudflared', ['tunnel', '--url', 'http://127.0.0.1:5000']);

cloudflared.stderr.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match) {
    console.log('\n============================================================');
    console.log('🎉 YOUR WEBSITE IS LIVE ON CLOUDFLARE:');
    console.log('👉', match[0]);
    console.log('============================================================\n');
  }
});

cloudflared.on('close', () => {
  console.log('Tunnel closed.');
});
