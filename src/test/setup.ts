/**
 * Vitest Test Setup
 * 
 * Global setup and configuration for all test files
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables (using Object.defineProperty to avoid read-only errors)
if (typeof process !== 'undefined' && process.env) {
  Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true });
  Object.defineProperty(process.env, 'NEXT_PUBLIC_SUPABASE_URL', { value: 'https://test.supabase.co', writable: true });
  Object.defineProperty(process.env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', { value: 'test-key', writable: true });
  Object.defineProperty(process.env, 'DATABASE_URL', { value: 'postgresql://test:test@localhost:5432/test', writable: true });
}

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: vi.fn(),
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};
