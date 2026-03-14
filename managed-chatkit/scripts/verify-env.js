#!/usr/bin/env node

/**
 * Environment setup verification script
 * Usage: node scripts/verify-env.js
 * 
 * Checks that required environment variables are properly configured
 * for the ChatKit application.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ENV_LOCAL = path.join(ROOT_DIR, '.env.local');
const ENV_EXAMPLE = path.join(ROOT_DIR, '.env.example');

console.log('\n🔍 ChatKit Environment Verification\n');

// Check if .env.local exists
if (!fs.existsSync(ENV_LOCAL)) {
  console.error('❌ Missing .env.local file');
  console.log('\nTo fix, run:');
  console.log(`  cp ${path.relative(process.cwd(), ENV_EXAMPLE)} ${path.relative(process.cwd(), ENV_LOCAL)}`);
  console.log('Then edit .env.local with your credentials.\n');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(ENV_LOCAL, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimLine = line.trim();
  if (trimLine && !trimLine.startsWith('#')) {
    const [key, value] = trimLine.split('=').map(s => s.trim());
    if (key) {
      envVars[key] = value || '';
    }
  }
});

let hasErrors = false;

// Check OPENAI_API_KEY
const apiKey = envVars.OPENAI_API_KEY;
if (!apiKey) {
  console.error('❌ OPENAI_API_KEY is not set in .env.local');
  hasErrors = true;
} else if (!apiKey.startsWith('sk-')) {
  console.error(`❌ OPENAI_API_KEY has invalid format. Expected to start with 'sk-', got '${apiKey.substring(0, 10)}...'`);
  hasErrors = true;
} else if (apiKey.includes('replace') || apiKey === 'sk-proj-...') {
  console.error('❌ OPENAI_API_KEY contains placeholder text');
  hasErrors = true;
} else {
  console.log(`✓ OPENAI_API_KEY is set (${apiKey.substring(0, 20)}...)`);
}

// Check VITE_CHATKIT_WORKFLOW_ID
const workflowId = envVars.VITE_CHATKIT_WORKFLOW_ID;
if (!workflowId) {
  console.error('❌ VITE_CHATKIT_WORKFLOW_ID is not set in .env.local');
  hasErrors = true;
} else if (!workflowId.startsWith('wf_')) {
  console.error(`❌ VITE_CHATKIT_WORKFLOW_ID has invalid format. Expected to start with 'wf_', got '${workflowId.substring(0, 10)}...'`);
  hasErrors = true;
} else if (workflowId.includes('replace') || workflowId === 'wf_...') {
  console.error('❌ VITE_CHATKIT_WORKFLOW_ID contains placeholder text');
  hasErrors = true;
} else {
  console.log(`✓ VITE_CHATKIT_WORKFLOW_ID is set (${workflowId.substring(0, 30)}...)`);
}

// Check optional variables
const optionalVars = [
  'CHATKIT_API_BASE',
  'VITE_CHATKIT_API_BASE',
  'VITE_API_URL',
  'ENVIRONMENT',
  'NODE_ENV'
];

const setOptional = optionalVars.filter(v => envVars[v]);
if (setOptional.length > 0) {
  console.log(`\n✓ Optional variables set: ${setOptional.join(', ')}`);
}

// Summary
console.log();
if (hasErrors) {
  console.error('⚠️  Configuration incomplete. Please fix the errors above.\n');
  console.log('For setup instructions, see: SETUP.md\n');
  process.exit(1);
} else {
  console.log('✅ Environment configuration looks good!\n');
  console.log('Next step: npm run dev\n');
  process.exit(0);
}
