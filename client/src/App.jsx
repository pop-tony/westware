// src/App.jsx
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import ProductGrid from './components/ProductGrid'
import LookbookCarousel from './components/LookbookCarousel'
import Services from './components/Services'
import BookingForm from './components/BookingForm'
import NewsletterSignup from './components/NewsletterSignup'
import Footer from './components/Footer'
import Cart from './components/Cart'
import ConsultationCard from './components/ConsultationCard'

function AppContent() {
  return (
    <div className="bg-white dark:bg-black">
      <NavBar />
      <Cart />
      <main>
        <HeroSection />
        <ProductGrid />
        <LookbookCarousel />
        <Services />
        <ConsultationCard />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  )
}

export default App