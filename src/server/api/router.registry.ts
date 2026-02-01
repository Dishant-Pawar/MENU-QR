/**
 * Centralized tRPC Router Registry
 * 
 * This module provides a centralized way to register and manage all tRPC routers.
 * Makes it easy to add, remove, or modify routers in one place.
 */

import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { menusRouter } from "./routers/menus";
import { languagesRouter } from "./routers/languages";
import { paymentsRouter } from "./routers/payments";
import { userRouter } from "./routers/user";

/**
 * Router registry for easy management
 */
export const ROUTER_REGISTRY = {
  menus: menusRouter,
  auth: authRouter,
  languages: languagesRouter,
  payments: paymentsRouter,
  user: userRouter,
} as const;

/**
 * Router metadata for documentation
 */
export const ROUTER_METADATA = {
  menus: {
    name: 'Menus Router',
    description: 'Handles menu CRUD operations, categories, and dishes',
    critical: true,
  },
  auth: {
    name: 'Auth Router',
    description: 'Handles user authentication and authorization',
    critical: true,
  },
  languages: {
    name: 'Languages Router',
    description: 'Manages language settings and translations',
    critical: false,
  },
  payments: {
    name: 'Payments Router',
    description: 'Handles payment processing and subscriptions',
    critical: true,
  },
  user: {
    name: 'User Router',
    description: 'Handles user account management and deletion',
    critical: true,
  },
} as const;

/**
 * Primary router for the server
 * All routers are registered here from the ROUTER_REGISTRY
 */
export const appRouter = createTRPCRouter(ROUTER_REGISTRY);

/**
 * Export type definition of API
 */
export type AppRouter = typeof appRouter;

/**
 * Get list of all registered router names
 */
export const getRegisteredRouters = (): string[] => {
  return Object.keys(ROUTER_REGISTRY);
};

/**
 * Check if a router is registered
 */
export const isRouterRegistered = (routerName: string): boolean => {
  return routerName in ROUTER_REGISTRY;
};

/**
 * Get critical routers that should always be available
 */
export const getCriticalRouters = (): string[] => {
  return Object.entries(ROUTER_METADATA)
    .filter(([_, meta]) => meta.critical)
    .map(([name]) => name);
};
