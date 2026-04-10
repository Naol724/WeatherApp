// Build script for Vercel deployment
// This creates load-env.js from environment variable

const fs = require('fs');

console.log('Building for deployment...');
console.log('Available environment variables:', Object.keys(process.env));

// Check if API key is available
const apiKey = process.env.OPENWEATHER_API_KEY;

console.log('API Key found:', apiKey ? 'YES' : 'NO');
console.log('API Key length:', apiKey ? apiKey.length : 0);

if (!apiKey) {
  console.error('ERROR: OPENWEATHER_API_KEY environment variable not found!');
  console.error('Please set this environment variable in your Vercel project settings.');
  console.error('Available env vars starting with OPEN:', Object.keys(process.env).filter(k => k.startsWith('OPEN')));
  process.exit(1);
}

// Create load-env.js with the API key from environment variable
const loadEnvContent = `// Auto-generated during deployment
window.OPENWEATHER_API_KEY = "${apiKey}";
`;

fs.writeFileSync('load-env.js', loadEnvContent);

console.log('Build complete! load-env.js created.');
console.log('File contents:', fs.readFileSync('load-env.js', 'utf8'));
