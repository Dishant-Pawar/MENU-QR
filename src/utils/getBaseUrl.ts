export const getBaseUrl = () => {
  // For production deployment on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // For server-side rendering on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // For local development
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
