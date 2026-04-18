const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const getLoggedInUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const getAuthHeaders = () => {
  const user = getLoggedInUser()

  if (!user?.token) {
    throw new Error('Please log in to continue')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.token}`,
  }
}

const formatCartItems = (items) =>
  items.map((item) => ({
    id: item.product.id,
    cartItemId: item.id,
    name: item.product.name,
    description: item.product.description,
    price: item.product.price,
    image: item.product.imageUrl,
    quantity: item.quantity,
  }))

export const fetchCartItems = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: getAuthHeaders(),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch cart')
  }

  return formatCartItems(data)
}

export const addCartItem = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity: 1 }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Could not add product to cart')
  }

  return data
}

export const updateCartItemQuantity = async (productId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Could not update cart')
  }

  return data
}

export const removeCartItem = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Could not remove product from cart')
  }

  return data
}
