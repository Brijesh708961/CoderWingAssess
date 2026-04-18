function Header() {
  const user = localStorage.getItem('user')

  const handleCartClick = (event) => {
    if (!user) {
      event.preventDefault()
      window.location.href = '/login'
    }
  }

  const handleAuthClick = (event) => {
    if (!user) {
      return
    }

    event.preventDefault()
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <>
      <div className="top-strip">
        <p>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</p>
        <a href="#products">ShopNow</a>
      </div>

      <header className="site-header">
        <a className="brand" href="/">
          Exclusive
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
          <a href="/register">Sign Up</a>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span>Search</span>
            <input type="search" placeholder="What are you looking for?" />
          </label>
          <a
            className={`icon-link auth-link ${user ? 'logout-link' : 'login-link'}`}
            href={user ? '/login' : '/login'}
            onClick={handleAuthClick}
            aria-label={user ? 'Logout' : 'Login'}
          >
            {user ? 'Logout' : 'Login'}
          </a>
          <a className="icon-link" href="/cart" aria-label="Cart" onClick={handleCartClick}>
            Cart
          </a>
        </div>
      </header>
    </>
  )
}

export default Header
