import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { addCartItem } from '../utils/cart'
import './Home.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const categories = [
  "Woman's Fashion",
  "Men's Fashion",
  'Electronics',
  'Home & Lifestyle',
  'Medicine',
  'Sports & Outdoor',
  "Baby's & Toys",
  'Groceries & Pets',
  'Health & Beauty',
]

const featuredCategories = [
  'Phones',
  'Computers',
  'SmartWatch',
  'Camera',
  'HeadPhones',
  'Gaming',
]

const fallbackProducts = [
  {
    id: 1,
    name: 'HAVIT HV-G92 Gamepad',
    description: 'Responsive game controller for console and PC play.',
    price: 120,
    oldPrice: 160,
    discount: 40,
    rating: 5,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 2,
    name: 'AK-900 Wired Keyboard',
    description: 'Full-size wired keyboard for fast everyday typing.',
    price: 960,
    oldPrice: 1160,
    discount: 35,
    rating: 4,
    reviews: 75,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 3,
    name: 'IPS LCD Gaming Monitor',
    description: 'Sharp display with smooth motion for gaming setups.',
    price: 370,
    oldPrice: 400,
    discount: 30,
    rating: 5,
    reviews: 99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 4,
    name: 'S-Series Comfort Chair',
    description: 'Comfortable chair for work, gaming, and study rooms.',
    price: 375,
    oldPrice: 400,
    discount: 25,
    rating: 4,
    reviews: 99,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 5,
    name: 'The North Coat',
    description: 'Warm everyday coat with a clean city-ready profile.',
    price: 260,
    oldPrice: 360,
    rating: 5,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 6,
    name: 'Gucci Duffle Bag',
    description: 'Spacious travel bag for weekend plans and daily carry.',
    price: 960,
    oldPrice: 1160,
    rating: 4,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 7,
    name: 'RGB Liquid CPU Cooler',
    description: 'Compact cooling unit with bright RGB lighting.',
    price: 160,
    oldPrice: 170,
    rating: 4,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 8,
    name: 'Small BookShelf',
    description: 'Minimal shelf for books, decor, and small essentials.',
    price: 360,
    rating: 5,
    reviews: 65,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=700&q=80',
  },
]

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action && <a className="section-action" href="#products">{action}</a>}
    </div>
  )
}

function Home() {
  const [products, setProducts] = useState(fallbackProducts)
  const [productStatus, setProductStatus] = useState('loading')
  const [authPopup, setAuthPopup] = useState(() => {
    const authStatus = new URLSearchParams(window.location.search).get('auth')

    if (authStatus === 'login') {
      return 'Successfully logged in.'
    }

    if (authStatus === 'signup') {
      return 'Signup successful. Welcome to Exclusive.'
    }

    return ''
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get('auth')

    if (authStatus) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch products')
        }

        const formattedProducts = data.map((product, index) => ({
          ...product,
          image: product.imageUrl,
          oldPrice: product.oldPrice || Math.round(product.price * 1.25),
          discount: product.discount || (index < 4 ? 25 + index * 5 : undefined),
          rating: product.rating || 5,
          reviews: product.reviews || 65 + index * 5,
        }))

        setProducts(formattedProducts)
        setProductStatus('success')
      } catch (error) {
        console.error(error)
        setProductStatus('error')
      }
    }

    fetchProducts()
  }, [])

  const flashProducts = products.slice(0, 4)
  const bestSellers = products.slice(4, 8)

  const handleAddToCart = async (product) => {
    const user = localStorage.getItem('user')

    if (!user) {
      window.location.href = '/login'
      return
    }

    try {
      await addCartItem(product.id)
      window.location.href = '/cart'
    } catch (error) {
      console.error(error)

      if (error.message.includes('log in')) {
        window.location.href = '/login'
      }
    }
  }

  return (
    <div className="shop-page">
      <Header />
      {authPopup && (
        <div className="auth-popup" role="status">
          <span>{authPopup}</span>
          <button type="button" onClick={() => setAuthPopup('')} aria-label="Close message">
            Close
          </button>
        </div>
      )}

      <main>
        <section className="hero-layout">
          <aside className="category-menu" aria-label="Product categories">
            {categories.map((category) => (
              <a href="#products" key={category}>
                {category}
              </a>
            ))}
          </aside>

          <div className="hero-panel">
            <div className="hero-copy">
              <p className="hero-kicker">iPhone 15 Series</p>
              <h1>Up to 10% off Voucher</h1>
              <a href="#products">Shop Now</a>
            </div>
            <img
              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80"
              alt="Latest smartphone"
            />
          </div>
        </section>

        <section className="content-section" id="products">
          <SectionTitle eyebrow="Today's" title="Flash Sales" action="View All Products" />
          {productStatus === 'loading' && <p className="product-status">Loading products...</p>}
          {productStatus === 'error' && (
            <p className="product-status">
              Showing sample products because the product API is unavailable.
            </p>
          )}
          <div className="product-grid">
            {flashProducts.map((product) => (
              <ProductCard product={product} key={product.id} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionTitle eyebrow="Categories" title="Browse By Category" />
          <div className="category-grid">
            {featuredCategories.map((category) => (
              <a className="category-tile" href="#products" key={category}>
                <span>{category}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionTitle eyebrow="This Month" title="Best Selling Products" action="View All" />
          <div className="product-grid">
            {bestSellers.map((product) => (
              <ProductCard product={product} key={product.id} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>

        <section className="music-promo">
          <div>
            <p className="promo-kicker">Categories</p>
            <h2>Enhance Your Music Experience</h2>
            <div className="timer-row" aria-label="Offer countdown">
              <span><strong>23</strong>Hours</span>
              <span><strong>05</strong>Days</span>
              <span><strong>59</strong>Minutes</span>
              <span><strong>35</strong>Seconds</span>
            </div>
            <a href="#products">Buy Now</a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
            alt="Wireless speaker and headphones"
          />
        </section>

        <section className="service-strip" id="contact">
          <div>
            <strong>Free And Fast Delivery</strong>
            <span>Free delivery for all orders over $140</span>
          </div>
          <div>
            <strong>24/7 Customer Service</strong>
            <span>Friendly support whenever you need it</span>
          </div>
          <div>
            <strong>Money Back Guarantee</strong>
            <span>Return money within 30 days</span>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
