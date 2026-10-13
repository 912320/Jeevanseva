const { spawn } = require('child_process');

console.log('🚀 Starting JeevanSeva Public Internet Link...');

const ssh = spawn('ssh', [
  '-o', 'StrictHostKeyChecking=no',
  '-R', '80:127.0.0.1:5000',
  'nokey@localhost.run'
]);

ssh.stdout.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-zA-Z0-9]+\.lhr\.life/);
  if (match) {
    console.log('\n============================================================');
    console.log('🎉 YOUR WEBSITE IS LIVE ON THE INTERNET:');
    console.log('👉', match[0]);
    console.log('============================================================\n');
  }
});

ssh.stderr.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-zA-Z0-9]+\.lhr\.life/);
  if (match) {
    console.log('\n============================================================');
    console.log('🎉 YOUR WEBSITE IS LIVE ON THE INTERNET:');
    console.log('👉', match[0]);
    console.log('============================================================\n');
  }
});

ssh.on('close', () => {
  console.log('Tunnel closed.');
});
