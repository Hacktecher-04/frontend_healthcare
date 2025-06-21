'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Token() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    console.log(params)
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      try {
        const decodedUser = decodeURIComponent(user);
        localStorage.setItem('user', decodedUser);

        const userObj = JSON.parse(decodedUser);
        router.replace(`/dashboard/${userObj.role}`);
      } catch (err) {
        console.error('User parse error:', err);
        router.replace('/');
      }
    } else {
      router.replace('/');
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
