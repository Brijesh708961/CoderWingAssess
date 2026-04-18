import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from '../utils/cart'
import './Cart.css'

function Cart() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      window.location.href = '/login'
      return
    }

    const loadCart = async () => {
      try {
        const cartItems = await fetchCartItems()
        setItems(cartItems)
        setStatus('success')
      } catch (error) {
        console.error(error)
        setMessage(error.message || 'Could not load cart')
        setStatus('error')
      }
    }

    loadCart()
  }, [])

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  )

  const handleQuantityChange = async (productId, quantity) => {
    const nextQuantity = Math.max(1, quantity)
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      ),
    )

    try {
      await updateCartItemQuantity(productId, nextQuantity)
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Could not update cart')
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId)
      setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
    } catch (error) {
      console.error(error)
      setMessage(error.message || 'Could not remove product')
    }
  }

  return (
    <div className="cart-page-shell">
      <Header />

      <main className="cart-page">
        <div className="cart-title-row">
          <div>
            <p className="cart-breadcrumb">Home / Cart</p>
            <h1>Shopping Cart</h1>
          </div>
          <a href="/">Return To Shop</a>
        </div>

        {status === 'loading' ? (
          <section className="empty-cart">
            <h2>Loading your cart...</h2>
            <p>Please wait while we fetch your saved products.</p>
          </section>
        ) : status === 'error' ? (
          <section className="empty-cart">
            <h2>Could not load cart</h2>
            <p>{message}</p>
            <a href="/">Return To Shop</a>
          </section>
        ) : items.length === 0 ? (
          <section className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add products from the home page and they will appear here.</p>
            <a href="/">Browse Products</a>
          </section>
        ) : (
          <section className="cart-layout">
            <div className="cart-table">
              <div className="cart-row cart-head">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {items.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div className="cart-product">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <button type="button" onClick={() => handleRemove(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span>${item.price}</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item.id, Number(event.target.value))}
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <strong>${item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Cart Total</h2>
              <div>
                <span>Subtotal:</span>
                <strong>${subtotal}</strong>
              </div>
              <div>
                <span>Shipping:</span>
                <strong>Free</strong>
              </div>
              <div>
                <span>Total:</span>
                <strong>${subtotal}</strong>
              </div>
              <button type="button">Process to checkout</button>
            </aside>
          </section>
        )}
      </main>
    </div>
  )
}

export default Cart
