#!/usr/bin/env node

/**
 * Migration Helper Script
 * 
 * This script helps identify files that might need updates to use
 * the new centralized route configuration.
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for in files
const HARDCODED_ROUTES = [
  { pattern: /["'`]\/menu\/create["'`]/g, suggestion: 'APP_ROUTES.MENU.CREATE' },
  { pattern: /["'`]\/menu\/\$\{[^}]+\}["'`]/g, suggestion: 'APP_ROUTES.MENU.VIEW(slug)' },
  { pattern: /["'`]\/login["'`]/g, suggestion: 'APP_ROUTES.AUTH.LOGIN' },
  { pattern: /["'`]\/register["'`]/g, suggestion: 'APP_ROUTES.AUTH.REGISTER' },
  { pattern: /["'`]\/privacy-policy["'`]/g, suggestion: 'APP_ROUTES.PRIVACY_POLICY' },
  { pattern: /["'`]\/terms-of-service["'`]/g, suggestion: 'APP_ROUTES.TERMS_OF_SERVICE' },
];

const COLORS = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function findHardcodedRoutes(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!['node_modules', '.next', 'dist', '.git'].includes(file)) {
        findHardcodedRoutes(filePath, fileList);
      }
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const findings = [];

      HARDCODED_ROUTES.forEach(({ pattern, suggestion }) => {
        const matches = content.match(pattern);
        if (matches) {
          findings.push({
            pattern: pattern.toString(),
            suggestion,
            count: matches.length,
          });
        }
      });

      if (findings.length > 0) {
        fileList.push({
          file: filePath,
          findings,
        });
      }
    }
  });

  return fileList;
}

function printReport(results) {
  console.log('\n' + COLORS.cyan + '════════════════════════════════════════════════' + COLORS.reset);
  console.log(COLORS.cyan + '  Route Migration Helper' + COLORS.reset);
  console.log(COLORS.cyan + '════════════════════════════════════════════════' + COLORS.reset + '\n');

  if (results.length === 0) {
    console.log(COLORS.green + '✅ No hardcoded routes found! Great job!' + COLORS.reset + '\n');
    return;
  }

  console.log(COLORS.yellow + `Found ${results.length} file(s) with hardcoded routes:\n` + COLORS.reset);

  results.forEach(({ file, findings }) => {
    console.log(COLORS.cyan + file.replace(process.cwd(), '') + COLORS.reset);
    findings.forEach(({ pattern, suggestion, count }) => {
      console.log(`  ${COLORS.yellow}⚠${COLORS.reset}  Found ${count} occurrence(s)`);
      console.log(`     ${COLORS.green}→${COLORS.reset} Consider using: ${COLORS.green}${suggestion}${COLORS.reset}`);
    });
    console.log('');
  });

  console.log(COLORS.cyan + '────────────────────────────────────────────────' + COLORS.reset);
  console.log('To use centralized routes:');
  console.log('1. Import: ' + COLORS.green + "import { APP_ROUTES } from '~/config/routes.config';" + COLORS.reset);
  console.log('2. Replace hardcoded strings with APP_ROUTES constants');
  console.log('3. Run tests to verify changes');
  console.log(COLORS.cyan + '────────────────────────────────────────────────' + COLORS.reset + '\n');
}

// Run the script
const srcPath = path.join(process.cwd(), 'src');
if (!fs.existsSync(srcPath)) {
  console.error(COLORS.red + 'Error: src directory not found. Run this script from project root.' + COLORS.reset);
  process.exit(1);
}

console.log('Scanning for hardcoded routes...');
const results = findHardcodedRoutes(srcPath);
printReport(results);
