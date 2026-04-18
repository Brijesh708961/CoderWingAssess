function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-media">
        {product.discount && <span className="discount-badge">-{product.discount}%</span>}
        <button className="wishlist-button" type="button" aria-label={`Add ${product.name} to wishlist`}>
          Heart
        </button>
        <img src={product.image} alt={product.name} />
      </div>

      <button className="add-cart-button" type="button" onClick={() => onAddToCart(product)}>
        Add To Cart
      </button>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p>
          <span className="sale-price">${product.price}</span>
          {product.oldPrice && <span className="old-price">${product.oldPrice}</span>}
        </p>
        <div className="rating" aria-label={`${product.rating} stars from ${product.reviews} reviews`}>
          <span>Star Star Star Star Star</span>
          <strong>({product.reviews})</strong>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
