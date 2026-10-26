import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingBag, Heart, UserRound, Menu, X, Plus, Minus, ArrowUpRight,
  SlidersHorizontal, PackageCheck, Truck, ShieldCheck, ChevronRight, Trash2,
  LayoutDashboard, Package, ClipboardList, LogOut, CheckCircle2, Eye, EyeOff
} from "lucide-react";
import "./styles.css";

const starterProducts = [
  { id: 1, name: "Everyday Oversized Tee", category: "T-Shirts", price: 799, oldPrice: 999, color: "Cloud White", sizes: ["XS","S","M","L","XL"], stock: 18, tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", description: "A relaxed everyday tee made for easy layering and all-day comfort." },
  { id: 2, name: "Relaxed Fit Shirt", category: "Shirts", price: 1299, oldPrice: 1599, color: "Stone", sizes: ["S","M","L","XL"], stock: 12, tag: "NEW", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85", description: "A clean, versatile shirt with a relaxed silhouette and timeless feel." },
  { id: 3, name: "Utility Cargo Pants", category: "Bottoms", price: 1699, oldPrice: 1999, color: "Olive", sizes: ["S","M","L","XL"], stock: 9, tag: "TRENDING", image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=900&q=85", description: "Functional details and an easy fit make these cargos a daily essential." },
  { id: 4, name: "Classic Denim Jacket", category: "Outerwear", price: 2499, oldPrice: null, color: "Indigo", sizes: ["S","M","L","XL"], stock: 7, tag: "", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=85", description: "A wardrobe staple with a classic denim look that gets better with wear." },
  { id: 5, name: "Essential Sweatshirt", category: "Sweatshirts", price: 1499, oldPrice: 1799, color: "Heather Grey", sizes: ["XS","S","M","L","XL"], stock: 15, tag: "", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85", description: "Soft, comfortable, and easy to style for cooler days." },
  { id: 6, name: "Everyday Straight Jeans", category: "Bottoms", price: 1899, oldPrice: null, color: "Blue", sizes: ["28","30","32","34","36"], stock: 11, tag: "JUST IN", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85", description: "Straight-leg denim designed to work with almost everything." },
  { id: 7, name: "Minimal Polo Tee", category: "T-Shirts", price: 999, oldPrice: null, color: "Black", sizes: ["S","M","L","XL"], stock: 20, tag: "", image: "https://images.unsplash.com/photo-1625910513413-5fc4f6f3c7c2?auto=format&fit=crop&w=900&q=85", description: "A smarter everyday polo with a minimal finish." },
  { id: 8, name: "Lightweight Overshirt", category: "Shirts", price: 1799, oldPrice: 2099, color: "Sand", sizes: ["S","M","L","XL"], stock: 6, tag: "", image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85", description: "A lightweight layer for changing seasons and effortless outfits." }
];

const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function App() {
  const [products, setProducts] = useState(starterProducts);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState("shop");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [drawer, setDrawer] = useState("");
  const [toast, setToast] = useState("");
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orders, setOrders] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "T-Shirts", price: "", stock: "10", image: "", description: "" });
  const [checkout, setCheckout] = useState({ name: "", phone: "", email: "", address: "", city: "", pincode: "", fulfillment: "Shop pickup", payment: "Cash on delivery" });

  const categories = ["All", "T-Shirts", "Shirts", "Bottoms", "Outerwear", "Sweatshirts"];
  const visibleProducts = useMemo(() => {
    let list = products.filter(p => (category === "All" || p.category === category) && (p.name + p.category + p.color).toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") list.sort((a,b) => a.price-b.price);
    if (sort === "high") list.sort((a,b) => b.price-a.price);
    if (sort === "new") list.sort((a,b) => b.id-a.id);
    return list;
  }, [products, category, search, sort]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2400); };
  const openProduct = (p) => { setSelected(p); setSize(p.sizes[0]); setQty(1); setDrawer("product"); };
  const addToCart = (p, chosenSize = p.sizes[0], amount = 1) => {
    setCart(old => {
      const key = `${p.id}-${chosenSize}`;
      const found = old.find(i => i.key === key);
      return found ? old.map(i => i.key === key ? { ...i, qty: Math.min(i.qty + amount, p.stock) } : i) : [...old, { key, id: p.id, name: p.name, price: p.price, image: p.image, size: chosenSize, qty: Math.min(amount, p.stock) }];
    });
    setDrawer("cart");
    notify("Added to your bag");
  };
  const updateQty = (key, delta) => setCart(old => old.map(i => i.key === key ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const toggleWish = (id) => setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const submitOrder = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    const order = { id: "YK" + Date.now().toString().slice(-7), items: cart, total: subtotal, ...checkout, status: "Order received", date: new Date().toLocaleDateString("en-IN") };
    setOrders(old => [order, ...old]);
    setCart([]);
    setCheckoutDone(true);
    setDrawer("confirmation");
  };
  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) return notify("Enter a product name and price");
    setProducts(old => [{ ...newProduct, id: Date.now(), price: Number(newProduct.price), stock: Number(newProduct.stock || 0), oldPrice: null, color: "YOKO", sizes: ["S","M","L","XL"], tag: "NEW", image: newProduct.image || starterProducts[0].image }, ...old]);
    setNewProduct({ name: "", category: "T-Shirts", price: "", stock: "10", image: "", description: "" });
    notify("Demo product added");
  };
  const adminSignIn = (e) => {
    e.preventDefault();
    // Frontend demo only. Replace with Supabase Auth and owner-role checks before production.
    if (adminEmail.trim() && adminPassword.length >= 4) {
      setAdminMode(true); setAdminLogin(false); setPage("admin"); notify("Demo admin mode opened");
    } else notify("Enter an email and a password of at least 4 characters");
  };

  return <div className="app">
    <div className="announcement">NEW SEASON, NEW YOU — FREE SHOP PICKUP ON EVERY ORDER</div>
    <header className="header">
      <button className="icon-btn mobile-menu" onClick={() => setDrawer("menu")} aria-label="Open menu"><Menu /></button>
      <button className="wordmark" onClick={() => { setPage("shop"); setCategory("All"); }}>YOKO<span>®</span></button>
      <nav className="desktop-nav">
        <button onClick={() => {setPage("shop"); setCategory("All");}}>Shop all</button>
        <button onClick={() => {setPage("shop"); setCategory("T-Shirts");}}>T-shirts</button>
        <button onClick={() => {setPage("shop"); setCategory("Shirts");}}>Shirts</button>
        <button onClick={() => {setPage("shop"); setCategory("Bottoms");}}>Bottoms</button>
        <button onClick={() => setPage("story")}>Our story</button>
      </nav>
      <div className="header-actions">
        <button className="icon-btn search-action" onClick={() => document.getElementById("shop-search")?.focus()} aria-label="Search"><Search /></button>
        <button className="icon-btn" onClick={() => setDrawer("account")} aria-label="Account"><UserRound /></button>
        <button className="icon-btn bag-action" onClick={() => setDrawer("cart")} aria-label="Shopping bag"><ShoppingBag /><span>{cartCount}</span></button>
      </div>
    </header>

    {page === "admin" ? <main className="admin-page">
      <div className="admin-top"><div><p className="eyebrow">YOKO / PRIVATE AREA</p><h1>Store dashboard</h1><p className="muted">Demo admin view — connect secure authentication before publishing.</p></div><button className="outline-btn" onClick={() => {setAdminMode(false); setPage("shop");}}> <LogOut size={16}/> Exit dashboard</button></div>
      <div className="stats-grid"><div className="stat"><span>Products</span><strong>{products.length}</strong></div><div className="stat"><span>Items in cart (all sessions)</span><strong>{cartCount}</strong></div><div className="stat"><span>Demo orders</span><strong>{orders.length}</strong></div><div className="stat"><span>Wishlist items</span><strong>{wishlist.length}</strong></div></div>
      <div className="admin-grid">
        <section className="panel"><h2><Plus size={18}/> Add a product</h2><form onSubmit={addProduct} className="admin-form">
          <label>Product name<input value={newProduct.name} onChange={e=>setNewProduct({...newProduct,name:e.target.value})} placeholder="e.g. YOKO Graphic Tee" required /></label>
          <div className="form-row"><label>Category<select value={newProduct.category} onChange={e=>setNewProduct({...newProduct,category:e.target.value})}>{categories.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></label><label>Price (₹)<input type="number" min="1" value={newProduct.price} onChange={e=>setNewProduct({...newProduct,price:e.target.value})} required /></label></div>
          <div className="form-row"><label>Stock<input type="number" min="0" value={newProduct.stock} onChange={e=>setNewProduct({...newProduct,stock:e.target.value})}/></label><label>Image URL<input value={newProduct.image} onChange={e=>setNewProduct({...newProduct,image:e.target.value})} placeholder="https://..." /></label></div>
          <label>Description<textarea value={newProduct.description} onChange={e=>setNewProduct({...newProduct,description:e.target.value})} placeholder="Describe the product"/></label>
          <button className="dark-btn" type="submit">Add product</button>
        </form></section>
        <section className="panel"><h2><Package size={18}/> Inventory</h2><div className="inventory">{products.map(p=><div className="inventory-row" key={p.id}><img src={p.image} alt=""/><div className="inventory-name"><strong>{p.name}</strong><span>{p.category} · {money(p.price)}</span></div><label className="stock-edit">Stock<input type="number" min="0" value={p.stock} onChange={e=>setProducts(old=>old.map(x=>x.id===p.id?{...x,stock:Number(e.target.value)}:x))}/></label><button className="small-icon danger" onClick={()=>setProducts(old=>old.filter(x=>x.id!==p.id))} aria-label="Delete product"><Trash2 size={16}/></button></div>)}</div></section>
      </div>
      <section className="panel order-panel"><h2><ClipboardList size={18}/> Recent orders</h2>{orders.length ? orders.map(o=><div className="order-row" key={o.id}><strong>{o.id}</strong><span>{o.name}</span><span>{o.fulfillment}</span><strong>{money(o.total)}</strong><span className="status">{o.status}</span></div>) : <p className="empty-note">No demo orders yet. Customer orders will appear here during this session.</p>}</section>
    </main> : page === "story" ? <main className="story-page"><p className="eyebrow">THE YOKO POINT OF VIEW</p><h1>Less noise.<br/><em>More you.</em></h1><p>YOKO is a clothing label built around easy essentials, considered details, and pieces you’ll reach for again and again.</p><button className="dark-btn" onClick={()=>setPage("shop")}>Explore the collection <ArrowUpRight size={16}/></button><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85" alt="YOKO clothing editorial"/></main> : <>
      <section className="hero">
        <img className="hero-image" src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=2000&q=90" alt="Minimal clothing collection"/>
        <div className="hero-shade"></div><div className="hero-copy"><p className="eyebrow light">YOKO / NEW COLLECTION</p><h1>Wear your<br/><em>own way.</em></h1><p>Everyday pieces. Better fits. Your kind of style.</p><button className="light-btn" onClick={()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>Shop the collection <ArrowUpRight size={17}/></button></div>
        <div className="hero-side-note">MADE FOR YOUR EVERYDAY <span>—</span> 01 / 26</div>
      </section>
      <section className="value-strip"><div><PackageCheck/><span>Thoughtful essentials</span></div><div><Truck/><span>Shop pickup available</span></div><div><ShieldCheck/><span>Secure checkout coming soon</span></div></section>
      <main id="shop" className="shop-section">
        <div className="section-heading"><div><p className="eyebrow">THE CURRENT ROTATION</p><h2>Good things, <em>on repeat.</em></h2></div><p className="section-desc">Easy-to-wear staples for wherever the day takes you.</p></div>
        <div className="shop-tools"><div className="category-tabs">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="tool-right"><label className="search-box"><Search size={16}/><input id="shop-search" placeholder="Search styles" value={search} onChange={e=>setSearch(e.target.value)}/>{search && <button onClick={()=>setSearch("")} aria-label="Clear search"><X size={14}/></button>}</label><label className="sort-box"><SlidersHorizontal size={15}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
        <div className="product-grid">{visibleProducts.map((p,i)=><article className="product-card" key={p.id}><div className="product-image-wrap" onClick={()=>openProduct(p)} role="button" tabIndex="0" onKeyDown={e=>e.key==="Enter"&&openProduct(p)}><img src={p.image} alt={p.name} loading="lazy"/>{p.tag && <span className="product-tag">{p.tag}</span>}<button className={`wish-btn ${wishlist.includes(p.id)?"wished":""}`} onClick={e=>{e.stopPropagation();toggleWish(p.id);}} aria-label="Toggle wishlist"><Heart size={17} fill={wishlist.includes(p.id)?"currentColor":"none"}/></button><button className="quick-add" onClick={e=>{e.stopPropagation();openProduct(p);}}>Quick add <Plus size={15}/></button></div><button className="product-info" onClick={()=>openProduct(p)}><span className="product-name">{p.name}</span><span className="product-price">{money(p.price)} {p.oldPrice && <del>{money(p.oldPrice)}</del>}</span><span className="product-color"><i></i>{p.color}</span></button></article>)}</div>
        {!visibleProducts.length && <div className="no-results">No styles found. Try another search or category.</div>}
        <div className="center-action"><button className="outline-btn" onClick={()=>{setCategory("All");setSearch("");}}>View all styles <ArrowUpRight size={16}/></button></div>
      </main>
      <section className="editorial"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Street style fashion"/></div><div className="editorial-copy"><p className="eyebrow">STYLE WITHOUT THE RULES</p><h2>Your day.<br/><em>Your uniform.</em></h2><p>Build a wardrobe that feels like you. Start with the essentials and make them your own.</p><button className="dark-btn" onClick={()=>{setPage("shop");setCategory("All");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});}}>Find your fit <ArrowUpRight size={16}/></button></div></section>
      </>}
    <footer className="footer"><div className="footer-main"><div><button className="wordmark footer-logo" onClick={()=>setPage("shop")}>YOKO<span>®</span></button><p>Everyday clothing for your own kind of style.</p></div><div><strong>Explore</strong><button onClick={()=>{setPage("shop");setCategory("All");}}>Shop all</button><button onClick={()=>setPage("story")}>Our story</button><button onClick={()=>setDrawer("account")}>My account</button></div><div><strong>Need help?</strong><span>Shipping & pickup</span><span>Returns & exchanges</span><a href="mailto:hello@yoko.example">hello@yoko.example</a></div><div className="newsletter"><strong>Get the good stuff.</strong><p>New drops and YOKO updates, occasionally.</p><form onSubmit={e=>{e.preventDefault();notify("Thanks for joining the demo list!");e.currentTarget.reset();}}><input type="email" placeholder="Your email address" required/><button aria-label="Join newsletter"><ArrowUpRight size={18}/></button></form></div></div><div className="footer-bottom"><span>© 2026 YOKO. All rights reserved.</span><span>Made for everyday living.</span><button onClick={()=>setAdminLogin(true)}>Store owner</button></div></footer>

    {drawer && <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&setDrawer("")}><aside className={`drawer ${drawer==="product"?"product-drawer":""} ${drawer==="confirmation"?"confirm-drawer":""}`}><div className="drawer-head"><span>{drawer==="cart"?"YOUR BAG":drawer==="product"?"PRODUCT DETAILS":drawer==="checkout"?"CHECKOUT":drawer==="account"?"YOUR ACCOUNT":drawer==="menu"?"MENU":drawer==="confirmation"?"ORDER CONFIRMED":"YOKO"}</span><button className="icon-btn" onClick={()=>setDrawer("")} aria-label="Close"><X/></button></div>
      {drawer==="menu" && <div className="mobile-links">{["All","T-Shirts","Shirts","Bottoms","Outerwear","Sweatshirts"].map(c=><button key={c} onClick={()=>{setCategory(c);setPage("shop");setDrawer("");}}>{c}<ChevronRight/></button>)}<button onClick={()=>{setPage("story");setDrawer("");}}>Our story <ChevronRight/></button></div>}
      {drawer==="product" && selected && <div className="product-detail"><img className="detail-image" src={selected.image} alt={selected.name}/><div className="detail-content"><p className="eyebrow">{selected.category} / YOKO</p><h2>{selected.name}</h2><div className="detail-price">{money(selected.price)} {selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div><p className="detail-desc">{selected.description}</p><div className="detail-label"><span>Select size</span><span>Size guide</span></div><div className="size-list">{selected.sizes.map(s=><button className={size===s?"chosen":""} key={s} onClick={()=>setSize(s)}>{s}</button>)}</div><div className="detail-quantity"><span>Quantity</span><div><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(Math.min(selected.stock,qty+1))}><Plus size={14}/></button></div><span className="stock-note">{selected.stock>0?`${selected.stock} available`:"Out of stock"}</span></div><button className="dark-btn full-btn" disabled={selected.stock<1} onClick={()=>addToCart(selected,size,qty)}>Add to bag — {money(selected.price*qty)}</button><p className="fine-print">Shop pickup available. Online payments are not active in this demo.</p></div></div>}
      {drawer==="cart" && <div className="cart-content">{!cart.length?<div className="empty-cart"><ShoppingBag size={34}/><h3>Your bag is taking a break.</h3><p>Add a few things you love.</p><button className="dark-btn" onClick={()=>{setDrawer("");setPage("shop");}}>Continue shopping</button></div>:<><div className="cart-items">{cart.map(i=><div className="cart-item" key={i.key}><img src={i.image} alt={i.name}/><div className="cart-item-info"><strong>{i.name}</strong><span>Size: {i.size}</span><strong>{money(i.price)}</strong><div className="quantity-control"><button onClick={()=>updateQty(i.key,-1)}><Minus size={13}/></button><span>{i.qty}</span><button onClick={()=>updateQty(i.key,1)}><Plus size={13}/></button><button className="remove-item" onClick={()=>setCart(old=>old.filter(x=>x.key!==i.key))}><Trash2 size={13}/></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Pickup details and payment choice are selected at checkout.</p><button className="dark-btn full-btn" onClick={()=>setDrawer("checkout")}>Continue to checkout <ArrowUpRight size={16}/></button><button className="text-btn" onClick={()=>{setDrawer("");setPage("shop");}}>Continue shopping</button></div></>}</div>}
      {drawer==="checkout" && <form className="checkout-form" onSubmit={submitOrder}><p className="checkout-note">This creates a demo order in this browser only. No payment will be collected.</p><h3>Contact</h3><label>Full name<input required value={checkout.name} onChange={e=>setCheckout({...checkout,name:e.target.value})} placeholder="Your name"/></label><div className="form-row"><label>Phone<input required type="tel" pattern="[0-9+() -]{8,}" value={checkout.phone} onChange={e=>setCheckout({...checkout,phone:e.target.value})} placeholder="Mobile number"/></label><label>Email<input type="email" value={checkout.email} onChange={e=>setCheckout({...checkout,email:e.target.value})} placeholder="Optional"/></label></div><h3>Fulfilment</h3><div className="choice-list"><label><input type="radio" checked={checkout.fulfillment==="Shop pickup"} onChange={()=>setCheckout({...checkout,fulfillment:"Shop pickup"})}/> Shop pickup</label><label><input type="radio" checked={checkout.fulfillment==="Home delivery"} onChange={()=>setCheckout({...checkout,fulfillment:"Home delivery"})}/> Home delivery</label></div>{checkout.fulfillment==="Home delivery"&&<><label>Delivery address<input required value={checkout.address} onChange={e=>setCheckout({...checkout,address:e.target.value})} placeholder="House, street, area"/></label><div className="form-row"><label>City<input required value={checkout.city} onChange={e=>setCheckout({...checkout,city:e.target.value})}/></label><label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" value={checkout.pincode} onChange={e=>setCheckout({...checkout,pincode:e.target.value})}/></label></div></>}<h3>Payment</h3><div className="choice-list"><label><input type="radio" checked={checkout.payment==="Cash on delivery"} onChange={()=>setCheckout({...checkout,payment:"Cash on delivery"})}/> Cash on delivery</label><label><input type="radio" checked={checkout.payment==="Pay at pickup"} onChange={()=>setCheckout({...checkout,payment:"Pay at pickup"})}/> Pay at shop pickup</label><label className="disabled-choice"><input type="radio" disabled/> Online payment <small>Coming soon</small></label></div><div className="checkout-total"><span>Total</span><strong>{money(subtotal)}</strong></div><button className="dark-btn full-btn" type="submit">Place demo order</button><p className="fine-print">Do not enter sensitive payment information. This is a front-end prototype.</p></form>}
      {drawer==="confirmation" && <div className="confirmation"><CheckCircle2 size={46}/><h2>You're all set.</h2><p>Your demo order was created successfully. No payment was taken.</p><button className="dark-btn full-btn" onClick={()=>{setDrawer("");setCheckoutDone(false);setPage("shop");}}>Back to YOKO</button><button className="text-btn" onClick={()=>{setDrawer("");setPage("admin");}}>View demo order in dashboard</button></div>}
      {drawer==="account" && <div className="account-content"><div className="account-icon"><UserRound/></div><h2>Welcome to YOKO.</h2><p>Sign-in and customer accounts will be connected to secure authentication in the production version.</p><label>Email<input type="email" placeholder="you@example.com"/></label><button className="dark-btn full-btn" onClick={()=>notify("Customer sign-in is not connected yet.")}>Continue with email</button><div className="account-links"><button onClick={()=>{setDrawer("");setAdminLogin(true);}}>Store owner sign-in</button><button onClick={()=>{setDrawer("");notify(wishlist.length?`${wishlist.length} saved styles in your wishlist`:"Your wishlist is empty");}}>Wishlist ({wishlist.length})</button></div></div>}
    </aside></div>}
    {adminLogin && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setAdminLogin(false)}><div className="login-modal"><button className="modal-close icon-btn" onClick={()=>setAdminLogin(false)}><X/></button><p className="eyebrow">YOKO / OWNER ACCESS</p><h2>Store owner sign-in</h2><p className="muted">Prototype only. Any email and password with 4+ characters opens the demo dashboard. This is NOT secure authentication.</p><form onSubmit={adminSignIn}><label>Email<input type="email" required value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="owner@example.com"/></label><label>Password<div className="password-field"><input required minLength={4} type={showPassword?"text":"password"} value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} placeholder="Password"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label><button className="dark-btn full-btn" type="submit">Open demo dashboard</button></form></div></div>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
