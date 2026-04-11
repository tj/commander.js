#!/usr/bin/env node

// This example demonstrates proper error handling in async action handlers.
// It shows how to handle errors gracefully without crashing the CLI.

const { Command } = require('../');
const program = new Command();

// Simulate an async operation that might fail
async function fetchData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id || id === 'error') {
        reject(new Error(`Failed to fetch data for ID: ${id}`));
      } else {
        resolve({ id, name: `Item ${id}`, timestamp: new Date().toISOString() });
      }
    }, 100);
  });
}

program
  .name('async-error-demo')
  .description('Demonstrates async error handling patterns in Commander.js')
  .version('1.0.0');

program
  .command('fetch <id>')
  .description('Fetch data by ID (use "error" to simulate failure)')
  .option('-r, --retry <count>', 'number of retries on failure', '0')
  .action(async (id, options) => {
    const maxRetries = parseInt(options.retry, 10);
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}/${maxRetries}...`);
        }
        
        const data = await fetchData(id);
        console.log('Success:', data);
        return; // Success - exit the action
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // All retries exhausted or no retries configured
    console.error('Error:', lastError.message);
    
    // Exit with non-zero code for CI/automation compatibility
    process.exit(1);
  });

program
  .command('batch <ids...>')
  .description('Fetch multiple items (continues on partial failure)')
  .option('--fail-fast', 'stop on first error instead of continuing')
  .action(async (ids, options) => {
    const results = [];
    const errors = [];

    for (const id of ids) {
      try {
        const data = await fetchData(id);
        results.push({ id, status: 'success', data });
        console.log(`✓ ${id}`);
      } catch (error) {
        errors.push({ id, error: error.message });
        console.error(`✗ ${id}: ${error.message}`);
        
        if (options.failFast) {
          console.error('\nFailed fast due to --fail-fast flag');
          process.exit(1);
        }
      }
    }

    // Summary
    console.log('\n--- Summary ---');
    console.log(`Successful: ${results.length}`);
    console.log(`Failed: ${errors.length}`);

    if (errors.length > 0) {
      process.exit(1);
    }
  });

// IMPORTANT: Use parseAsync() instead of parse() when you have async actions
// parseAsync() properly handles rejected promises from async action handlers
program.parseAsync(process.argv).catch((error) => {
  // This catches any uncaught errors from parseAsync itself
  console.error('Unexpected error:', error.message);
  process.exit(1);
});

// Try the following:
//    node async-error-handling.js fetch 123
//    node async-error-handling.js fetch error
//    node async-error-handling.js fetch error --retry 3
//    node async-error-handling.js batch 1 2 3
//    node async-error-handling.js batch 1 error 3
//    node async-error-handling.js batch 1 error 3 --fail-fast
