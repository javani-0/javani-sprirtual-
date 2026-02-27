import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useContactInfo } from "@/hooks/useContactInfo";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ImageViewer from "@/components/ImageViewer";
import ShareButton from "@/components/ShareButton";
import { MessageCircle, Minus, Plus, ChevronRight, ArrowLeft } from "lucide-react";
import productDetailBg from "@/assets/product-detail-bg.png";
import productDetailBgMobile from "@/assets/product-detail-bg-mobile.png";

interface Product {
  id: string;
  image: string;
  images?: string[];
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: string;
  features?: string[];
  rating?: number;
  reviewCount?: number;
}

/* ── Mandala SVG Background Decoration ── */
const MandalaSVG = ({ className = "", flip = false }: { className?: string; flip?: boolean }) => (
  <svg
    viewBox="0 0 500 500"
    className={className}
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="mandalaGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c4553a" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#8b1a1a" stopOpacity="0.06" />
      </radialGradient>
    </defs>
    <g fill="none" stroke="url(#mandalaGrad)" strokeWidth="1.2" opacity="0.5">
      {/* Outer rings */}
      <circle cx="250" cy="250" r="240" />
      <circle cx="250" cy="250" r="220" />
      <circle cx="250" cy="250" r="195" />
      <circle cx="250" cy="250" r="170" />
      <circle cx="250" cy="250" r="140" />
      <circle cx="250" cy="250" r="110" />
      <circle cx="250" cy="250" r="80" />
      <circle cx="250" cy="250" r="50" />
      <circle cx="250" cy="250" r="25" />
      {/* Petal layers */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <g key={i} transform={`rotate(${angle} 250 250)`}>
            <ellipse cx="250" cy="100" rx="22" ry="55" />
            <ellipse cx="250" cy="130" rx="14" ry="35" />
          </g>
        );
      })}
      {/* Inner petal ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <g key={`inner-${i}`} transform={`rotate(${angle} 250 250)`}>
            <ellipse cx="250" cy="165" rx="10" ry="28" />
          </g>
        );
      })}
      {/* Spoke lines */}
      {[...Array(24)].map((_, i) => {
        const angle = ((i * 360) / 24) * (Math.PI / 180);
        const x2 = 250 + 240 * Math.cos(angle);
        const y2 = 250 + 240 * Math.sin(angle);
        return <line key={`spoke-${i}`} x1="250" y1="250" x2={x2} y2={y2} strokeWidth="0.5" />;
      })}
      {/* Decorative arcs */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <g key={`arc-${i}`} transform={`rotate(${angle} 250 250)`}>
            <path d="M 230 60 Q 250 20 270 60" />
            <path d="M 220 75 Q 250 30 280 75" />
          </g>
        );
      })}
      {/* Center flower */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <g key={`flower-${i}`} transform={`rotate(${angle} 250 250)`}>
            <ellipse cx="250" cy="230" rx="8" ry="18" />
          </g>
        );
      })}
    </g>
  </svg>
);


const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { whatsappNumber } = useContactInfo();

  const allImages = product?.images || (product?.image ? [product.image] : []);
  const currentImage = allImages[selectedImage] || product?.image || "";

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "products", id))
      .then((snap) => {
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getDocs(collection(db, "products"))
      .then((snap) => {
        const all = snap.docs
          .filter((d) => d.id !== id)
          .map((d) => ({ id: d.id, ...d.data() } as Product));
        // shuffle and take 4
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 4);
        setRelatedProducts(shuffled);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    document.body.classList.add("hide-nav-mobile", "hide-nav-desktop");
    return () => document.body.classList.remove("hide-nav-mobile", "hide-nav-desktop");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5D5BC" }}>
        <div className="w-8 h-8 border-2 border-[#8B1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ background: "#F5D5BC" }}>
        <h1 className="font-display text-2xl text-[#3D1A0E]">Product not found</h1>
        <Link to="/products" className="text-[#8B1A1A] hover:underline font-body text-sm">← Back to Products</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I'd like to order from *Javani Spiritual Hub*:\n\n` +
    `*${product.name}*\n` +
    `Category: ${product.categoryLabel}\n` +
    `Price: ₹${product.price}\n` +
    `Quantity: ${qty}\n\n` +
    `${product.description}\n\n` +
    `Product link: ${window.location.href}`
  );

  const features = product.features && product.features.length > 0 ? product.features : [];

  return (
    <>
      <SEO
        title={`${product.name} | Javani Spiritual Hub`}
        description={product.description}
      />

      <ImageViewer
        images={allImages}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      <main
        className="relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F8DFC8 0%, #F2C9A8 30%, #EDBE9E 60%, #F5D5BC 100%)",
        }}
      >
        {/* Desktop background image — fixed 16:9 ratio, anchored to top */}
        <div className="absolute top-0 left-0 w-full hidden lg:block pointer-events-none z-0" style={{ aspectRatio: "16/9" }}>
          <img
            src={productDetailBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full"
            style={{ objectFit: "fill" }}
          />
          {/* Overlay to keep readability */}
          <div className="absolute inset-0" style={{ background: "rgba(245, 213, 188, 0.50)" }} />
        </div>

        {/* Mobile background image — full cover */}
        <div className="absolute inset-0 lg:hidden pointer-events-none z-0">
          <img
            src={productDetailBgMobile}
            alt=""
            aria-hidden="true"
            className="w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(245, 213, 188, 0.45)" }} />
        </div>
        {/* Mandala Background Decorations */}
        <div className="absolute top-0 left-0 w-[420px] h-[420px] -translate-x-1/4 -translate-y-1/4 pointer-events-none z-0 hidden lg:block">
          <MandalaSVG className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] translate-x-1/4 -translate-y-1/2 pointer-events-none z-0 hidden lg:block">
          <MandalaSVG className="w-full h-full" flip />
        </div>
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] translate-y-1/3 pointer-events-none z-0 hidden lg:block opacity-60">
          <MandalaSVG className="w-full h-full" />
        </div>

        {/* ── Mobile back arrow (no text) ── */}
        <Link
          to="/products"
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ background: "rgba(0,0,0,0.45)" }}
          aria-label="Back to Products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* ── Desktop back arrow ── */}
        <Link
          to="/products"
          className="hidden lg:flex fixed top-5 left-5 z-50 w-10 h-10 rounded-full items-center justify-center text-white transition-colors hover:bg-black/60"
          style={{ background: "rgba(0,0,0,0.40)" }}
          aria-label="Back to Products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* ── Breadcrumb — desktop only ── */}
        <div className="relative z-10 pt-24 sm:pt-28 lg:pt-8 px-4 sm:px-8 max-w-7xl mx-auto hidden lg:block">
          <nav className="flex items-center gap-1.5 font-body text-sm text-[#6B4C3B]">
            <Link to="/" className="hover:text-[#8B1A1A] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A0755A]" />
            <Link to="/products" className="hover:text-[#8B1A1A] transition-colors">{product.categoryLabel}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#A0755A]" />
            <span className="text-[#3D1A0E] font-medium truncate max-w-[200px]">
              {product.category === "clothing" ? "Costumes" : product.categoryLabel}
            </span>
          </nav>
        </div>

        {/* Mobile top spacer */}
        <div className="lg:hidden" style={{ height: "72px" }} />

        {/* ── Product Content ── */}
        <section className="relative z-10 py-8 sm:py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-[380px_1fr] gap-8 lg:gap-14 items-start">

              {/* ── Left Column: Image Gallery ── */}
              <div className="flex flex-col gap-3 lg:max-w-[380px]">
                {/* Main Image */}
                <div
                  className="relative overflow-hidden bg-[#EDD4BE] cursor-pointer group shadow-lg"
                  style={{ borderRadius: "6px", aspectRatio: "1/1" }}
                  onClick={() => setIsViewerOpen(true)}
                >
                  {!imgLoaded && (
                    <div className="absolute inset-0 animate-pulse" style={{ background: "#E8C8AD" }} />
                  )}
                  <img
                    src={currentImage}
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                  {/* View overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-4 py-2 rounded-full font-body text-sm text-[#3D1A0E] font-medium shadow-lg">
                      Click to view
                    </span>
                  </div>
                </div>

                {/* Thumbnail Row */}
                {allImages.length > 1 && (
                  <div className="flex gap-3">
                    {allImages.slice(0, 4).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedImage(idx); setImgLoaded(false); }}
                        className={`relative overflow-hidden flex-1 aspect-square transition-all duration-200 ${
                          selectedImage === idx
                            ? "ring-2 ring-[#8B1A1A] ring-offset-2 ring-offset-[#F5D5BC]"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ borderRadius: "4px" }}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Single thumbnail when only one image */}
                {allImages.length <= 1 && (
                  <div className="flex gap-3">
                    <div
                      className="relative overflow-hidden aspect-square ring-2 ring-[#8B1A1A] ring-offset-2 ring-offset-[#F5D5BC]"
                      style={{ borderRadius: "4px", background: "#E8C8AD", width: "72px" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right Column: Product Info ── */}
              <div
                className="flex flex-col gap-5 lg:gap-5"
                style={{}}
              >
                {/* Mobile: frosted card for readability */}
                <div
                  className="flex flex-col gap-4 lg:contents rounded-2xl p-4 lg:p-0"
                  style={{
                    background: "rgba(255, 245, 235, 0.82)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >

                {/* Product Title + Share */}
                <div className="flex items-start justify-between gap-3">
                  <h1
                    className="font-display font-bold leading-tight"
                    style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#2A0D05" }}
                  >
                    {product.name}
                  </h1>
                  <ShareButton
                    title={product.name}
                    text={`Check out *${product.name}* on Javani Spiritual Hub — *₹${product.price}*`}
                    url={`/products/${product.id}`}
                    imageUrl={product.image}
                    className="flex-shrink-0 mt-1"
                  />
                </div>

                {/* Price */}
                <p
                  className="font-body font-bold"
                  style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#2A0D05", letterSpacing: "-0.01em" }}
                >
                  ₹{product.price.replace(/[₹\/\-]/g, "").trim() || product.price}/-
                </p>

                {/* Description */}
                <p
                  className="font-body text-[0.95rem] leading-relaxed"
                  style={{ color: "#3D1800" }}
                >
                  {product.description}
                </p>

                {/* Feature Bullets */}
                {features.length > 0 && (
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ background: "#3D1A0E" }}
                        />
                        <span className="font-body text-[0.9rem]" style={{ color: "#2A0D05" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Quantity Row */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-body text-sm font-medium" style={{ color: "#2A0D05" }}>
                    Quantity:
                  </span>
                  <div
                    className="flex items-center overflow-hidden"
                    style={{ border: "1.5px solid #C4A882", borderRadius: "6px" }}
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#EDD4BE] transition-colors"
                      style={{ color: "#6B4C3B" }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      className="w-12 text-center font-body font-semibold text-sm py-2"
                      style={{ color: "#3D1A0E", borderLeft: "1.5px solid #C4A882", borderRight: "1.5px solid #C4A882" }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#EDD4BE] transition-colors"
                      style={{ color: "#6B4C3B" }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Buttons Row — side by side, sharp edges */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Order on WhatsApp */}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-3 font-body font-semibold text-base text-white hover:brightness-110 transition-all shadow-md flex-1"
                    style={{ background: "#25D366", borderRadius: "0" }}
                  >
                    <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                  </a>

                  {/* Affiliate / Enquire */}
                  <Link to="/contact" className="flex-1">
                    <button
                      className="w-full px-8 py-3 font-display font-semibold text-base tracking-wide text-white flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #9B2020 0%, #7A1010 100%)",
                        borderRadius: "0",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Affiliate / Enquire Now
                    </button>
                  </Link>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Icons Footer Strip — desktop only */}
        <div className="relative z-10 pb-6 px-4 sm:px-8 max-w-7xl mx-auto hidden lg:block">
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#3D1A0E] hover:text-[#8B1A1A] transition-colors" aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a href="#" className="text-[#3D1A0E] hover:text-[#8B1A1A] transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-[#3D1A0E] hover:text-[#8B1A1A] transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
      </main>

      {/* ── You May Also Like ── */}
      {relatedProducts.length > 0 && (
        <section
          className="py-10 px-4 sm:px-8"
          style={{ background: "linear-gradient(135deg, #F8DFC8 0%, #F2C9A8 50%, #F5D5BC 100%)" }}
        >
          <div className="max-w-7xl mx-auto">
            <h2
              className="font-display font-bold mb-6"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#2A0D05" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.id}`}
                  className="group relative flex flex-col rounded-xl overflow-hidden shadow-md hover:-translate-y-1 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.55)" }}
                >
                  <div className="aspect-square overflow-hidden bg-[#EDD4BE] relative">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Share button overlay */}
                    <div className="absolute top-1.5 right-1.5">
                      <ShareButton
                        title={rp.name}
                        text={`Check out *${rp.name}* on Javani Spiritual Hub — *₹${rp.price}*`}
                        url={`/products/${rp.id}`}
                        imageUrl={rp.image}
                        className="bg-black/40 hover:bg-black/60 text-white hover:text-white rounded-full w-7 h-7"
                      />
                    </div>
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <p
                      className="font-display font-semibold text-sm leading-tight line-clamp-2"
                      style={{ color: "#2A0D05" }}
                    >
                      {rp.name}
                    </p>
                    <p
                      className="font-body font-bold text-sm"
                      style={{ color: "#8B1A1A" }}
                    >
                      ₹{rp.price.replace(/[₹\/\-]/g, "").trim() || rp.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer — hidden on all screens for this page */}
    </>
  );
};

export default ProductDetail;
