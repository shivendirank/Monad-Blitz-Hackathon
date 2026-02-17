'use client';

import { useRouter } from 'next/navigation';
import { HorizonHeroSection } from '@/components/ui/horizon-hero-section';

export default function LandingPage() {
  const router = useRouter();

  const handleScrollEnd = () => {
    router.push('/arena');
  };

  return <HorizonHeroSection onScrollEnd={handleScrollEnd} />;
}
