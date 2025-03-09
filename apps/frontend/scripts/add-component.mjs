#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get the component name from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Please provide a component name');
  process.exit(1);
}

const componentName = args[0];

try {
  // Temporarily rename .npmrc to disable it
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const backupPath = path.join(process.cwd(), '.npmrc.bak');
  
  if (fs.existsSync(npmrcPath)) {
    fs.renameSync(npmrcPath, backupPath);
  }

  console.log(`Installing ${componentName} component...`);
  
  // Run the shadcn command without the ignore-scripts restriction
  execSync(`bunx --bun shadcn@latest add ${componentName}`, { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      // Setting an environment variable to skip MSW postinstall
      SKIP_POSTINSTALL: 'true'
    }
  });

  console.log(`\n✅ Successfully installed ${componentName} component!`);
} catch (error) {
  console.error(`\n❌ Failed to install ${componentName} component:`);
  console.error(error.message);
} finally {
  // Restore the .npmrc file
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const backupPath = path.join(process.cwd(), '.npmrc.bak');
  
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, npmrcPath);
  }
} 