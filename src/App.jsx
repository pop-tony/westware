// src/App.jsx
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import ProductGrid from './components/ProductGrid'
import LookbookCarousel from './components/LookbookCarousel'
import BookingForm from './components/BookingForm'
import NewsletterSignup from './components/NewsletterSignup'
import Footer from './components/Footer'
import Services from './components/Services'

function AppContent() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const categories = ['All', 'Dresses', 'Sets', 'Beauty', 'Hair']

  const [selectedService, setSelectedService] = useState('')
  const [cartItems, setCartItems] = useState([])

  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item])
    // You can add a toast notification here
  }

  const handleBookService = (serviceName) => {
    setSelectedService(serviceName)
  }

  return (
    <div className="bg-white dark:bg-black">
      <NavBar />
      <main>
        <HeroSection />

        <section className="bg-white px-4 pt-20 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    activeCategory === cat
                   ? 'bg-rose-500 text-white'
                      : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
        <ProductGrid category={activeCategory} onAddToCart={handleAddToCart} />

        <LookbookCarousel />
        <Services onBookService={handleBookService} />
        <BookingForm selectedItem={selectedProduct} preselectedService={selectedService} />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App