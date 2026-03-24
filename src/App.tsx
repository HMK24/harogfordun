import Navbar from './components/Navbar/Navbar'
import HeroSection from './components/HeroSection/HeroSection'
import ServicesSection from './components/ServicesSection/ServicesSection'
import HowWeWorkSection from './components/HowWeWorkSection/HowWeWorkSection'
import GallerySection from './components/GallerySection/GallerySection'
import AboutSection from './components/AboutSection/AboutSection'
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowWeWorkSection />
        <GallerySection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}

export default App
