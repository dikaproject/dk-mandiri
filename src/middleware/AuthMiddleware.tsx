'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = ['/login', '/register'];

export default function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login');
      } else if (user && publicPaths.includes(pathname)) {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}