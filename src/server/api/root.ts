/**
 * Primary tRPC Router
 * 
 * This file now imports from the centralized router registry.
 * To add new routers, update router.registry.ts instead.
 */
export { appRouter, type AppRouter } from "./router.registry";
