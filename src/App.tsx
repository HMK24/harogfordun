import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar/Navbar'
import HeroSection from './components/HeroSection/HeroSection'
import ServicesSection from './components/ServicesSection/ServicesSection'

const HowWeWorkSection = lazy(() => import('./components/HowWeWorkSection/HowWeWorkSection'))
const GallerySection = lazy(() => import('./components/GallerySection/GallerySection'))
const AboutSection = lazy(() => import('./components/AboutSection/AboutSection'))
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection/TestimonialsSection'))
const Footer = lazy(() => import('./components/Footer/Footer'))

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <Suspense fallback={null}>
          <HowWeWorkSection />
          <GallerySection />
          <AboutSection />
          <TestimonialsSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default App
