import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import Rooms from '@/components/sections/Rooms';
import Facilities from '@/components/sections/Facilities';
import Gallery from '@/components/sections/Gallery';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Noise Texture Overlay */}
      <div className="noise" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Rooms />
        <Facilities />
        <Gallery />
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
