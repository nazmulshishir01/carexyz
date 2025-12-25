import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Services from '@/components/home/Services';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}
