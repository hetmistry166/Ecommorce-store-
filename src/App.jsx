import { useEffect, useMemo, useState } from "react";
import {
  Search, ShoppingBag, Menu, X, Star, ArrowUpRight,
  Minus, Plus, Trash2, Heart, SlidersHorizontal,
  Truck, ShieldCheck, RotateCcw
} from "lucide-react";
import "./App.css";

const API = "https://dummyjson.com";

function money(value) {
  const approximateINR = value * 86;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(approximateINR);
}


export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Fetch products and categories from DummyJSON
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          fetch(`${API}/products?limit=100`),
          fetch(`${API}/products/categories`)
        ]);

        if (!productResponse.ok || !categoryResponse.ok) {
          throw new Error("Unable to load products.");
        }

        const productData = await productResponse.json();
        const categoryData = await categoryResponse.json();

        setProducts(productData.products);
        setCategories(categoryData);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, search, sort]);

  // Cart calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Add product to cart
  function addToCart(product) {
    setCart((previousCart) => {
      const existing = previousCart.find((item) => item.id === product.id);

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  }

  // Change cart quantity
  function changeQuantity(id, amount) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove item from cart
  function removeFromCart(id) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  }

  // Favorite products
  function toggleFavorite(id) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  return (
    <div className="store">

      {/* Announcement */}
      <div className="announcement">
        ✦ Complimentary shipping on orders above ₹2,999
      </div>

      {/* Navbar */}
      <header className="navbar">
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>

        <a href="#" className="brand">
          <span className="brand-symbol">✦</span>
          <span className="brand-name">
            PARTH MISTRY
            <small>THE MODERN COLLECTION</small>
          </span>
        </a>

        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
          <a href="#collection" onClick={() => setMobileMenu(false)}>Collection</a>
          <a href="#about" onClick={() => setMobileMenu(false)}>About</a>
        </nav>

        <div className="nav-actions">
          <button className="search-toggle" onClick={() =>
            document.getElementById("searchInput")?.focus()
          }>
            <Search />
          </button>

          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <ShoppingBag />
            <span>Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">CURATED FOR EVERYDAY LIVING</p>
          <h1>Find your<br />own <em>expression.</em></h1>
          <p className="hero-description">
            Discover pieces that make everyday moments feel extraordinary.
            Thoughtfully curated, beautifully designed.
          </p>

          <a href="#collection" className="hero-button">
            Explore collection <ArrowUpRight size={18} />
          </a>

          <div className="hero-note">
            <span>01 — 100+</span>
            <span>Curated products</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/hero-illustration.svg"
            alt="Fashion collection"
          />
          <div className="image-caption">
            <span>THE NEW SEASON</span>
            <span>01 / 04</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div><Truck /><span>Complimentary shipping</span></div>
        <div><ShieldCheck /><span>Secure shopping</span></div>
        <div><RotateCcw /><span>Easy returns</span></div>
      </section>

      {/* Product collection */}
      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR SELECTION</p>
            <h2>Curated <em>collection.</em></h2>
          </div>
          <p className="collection-subtitle">
            Good things, chosen with intention.
          </p>
        </div>

        {/* Search and filters */}
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              id="searchInput"
              type="text"
              placeholder="Search products or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-select">
            <SlidersHorizontal size={17} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="categories">
          <button
            className={category === "all" ? "active" : ""}
            onClick={() => setCategory("all")}
          >
            All products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={category === cat.slug ? "active" : ""}
              onClick={() => setCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="product-info-line">
          <span>{filteredProducts.length} products</span>
          <span>Showing our collection</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Curating your collection...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}

        {/* Product cards */}
        {!loading && !error && (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div
                  className="product-image"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                  />

                  <span className="product-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    className={`favorite ${
                      favorites.includes(product.id) ? "liked" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    aria-label="Add to favorites"
                  >
                    <Heart size={18} fill={
                      favorites.includes(product.id) ? "currentColor" : "none"
                    } />
                  </button>

                  <button
                    className="quick-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    + Add to bag
                  </button>
                </div>

                <div
                  className="product-details"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-title-row">
                    <h3>{product.title}</h3>
                    <span className="rating">
                      <Star size={13} fill="currentColor" />
                      {product.rating}
                    </span>
                  </div>

                  <p className="product-category">{product.category}</p>
                  <div className="price-row">
                    <span>{money(product.price)}</span>
                    <span className="discount">
                      {product.discountPercentage.toFixed(0)}% OFF
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="empty">
            <Search size={35} />
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
            <button onClick={() => {
              setSearch("");
              setCategory("all");
            }}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* About section */}
      <section className="about" id="about">
        <span className="about-symbol">✦</span>
        <p className="eyebrow">A LITTLE ABOUT US</p>
        <h2>Less, but <em>better.</em></h2>
        <p>
          Parth Mistry is a thoughtfully curated destination for everyday
          essentials and unique finds. We believe great design, quality,
          and simplicity belong together.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#" className="brand footer-brand">
          <span className="brand-symbol">✦</span>
          <span className="brand-name">
            PARTH MISTRY
            <small>THE MODERN COLLECTION</small>
          </span>
        </a>
        <p>Curated with intention. © {new Date().getFullYear()}</p>
      </footer>

      {/* Product details modal */}
      {selectedProduct && (
        <div className="overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setSelectedProduct(null)}
            >
              <X />
            </button>

            <div className="modal-image">
              <img src={selectedProduct.images?.[0] || selectedProduct.thumbnail}
                alt={selectedProduct.title} />
            </div>

            <div className="modal-content">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2>{selectedProduct.title}</h2>
              <div className="modal-rating">
                <Star fill="currentColor" size={15} />
                {selectedProduct.rating} · {selectedProduct.brand || "Selected item"}
              </div>
              <h3 className="modal-price">{money(selectedProduct.price)}</h3>
              <p className="modal-description">{selectedProduct.description}</p>
              <p className="stock">
                {selectedProduct.stock > 0
                  ? `${selectedProduct.stock} items available`
                  : "Out of stock"}
              </p>
              <button
                className="primary-button"
                disabled={selectedProduct.stock <= 0}
                onClick={() => addToCart(selectedProduct)}
              >
                Add to bag <ShoppingBag size={18} />
              </button>
              <div className="modal-perks">
                <p><Truck size={16} /> Free shipping on eligible orders</p>
                <p><RotateCcw size={16} /> Easy returns</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your bag <span>({cartCount})</span></h2>
              <button onClick={() => setCartOpen(false)}><X /></button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={40} />
                <h3>Your bag is empty</h3>
                <p>Find something you love.</p>
                <button className="primary-button" onClick={() => setCartOpen(false)}>
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="cart-item-info">
                        <h3>{item.title}</h3>
                        <p>{money(item.price)}</p>

                        <div className="quantity">
                          <button onClick={() => changeQuantity(item.id, -1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="subtotal">
                    <span>Subtotal</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                  <p>Shipping and taxes calculated at checkout.</p>
                  <button
                    className="primary-button"
                    onClick={() => alert("Demo checkout — no real payment is processed.")}
                  >
                    Checkout <ArrowUpRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}