import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useContactInfo } from "@/hooks/useContactInfo";
import { Link } from "react-router-dom";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import GoldOutlineButton from "@/components/GoldOutlineButton";
import SEO from "@/components/SEO";
import ShareButton from "@/components/ShareButton";
import { MessageCircle, ShoppingBag, Minus, Plus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroDancer1 from "@/assets/hero-dancer-1.jpg";
import heroTemple from "@/assets/hero-temple.jpg";
import carnaticMusic from "@/assets/carnatic-music.jpg";

type ProductCategory = "all" | "clothing" | "thermic-toys" | "aaharya" | "accessories" | "books-stationaries" | "sattvic-refreshments";

interface Product {
  id: string;
  image: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  price: string;
}

const filters: { label: string; value: ProductCategory }[] = [
  { label: "All", value: "all" },
  { label: "Clothing", value: "clothing" },
  { label: "Thermic Toys", value: "thermic-toys" },
  { label: "Aaharya Collections", value: "aaharya" },
  { label: "Practice Accessories", value: "accessories" },
  { label: "Books & Stationaries", value: "books-stationaries" },
  { label: "Sattvic Refreshments", value: "sattvic-refreshments" },
];

const categoryBadgeColors: Record<string, string> = {
  clothing: "bg-primary text-primary-foreground",
  "thermic-toys": "bg-gold text-gold-foreground",
  aaharya: "bg-charcoal text-charcoal-foreground",
  accessories: "bg-primary-light text-primary-foreground",
  "books-stationaries": "bg-muted text-foreground",
  "sattvic-refreshments": "bg-green-100 text-green-700",
};

const SkeletonCard = () => (
  <div className="bg-card shadow-card rounded-lg overflow-hidden">
    <div className="aspect-square sm:aspect-[4/3] skeleton-shimmer" />
    <div className="p-3 sm:p-5 space-y-2">
      <div className="h-4 w-3/4 skeleton-shimmer rounded" />
      <div className="h-4 w-1/2 skeleton-shimmer rounded" />
      <div className="h-8 w-full skeleton-shimmer rounded" />
    </div>
  </div>
);


const ProductCard = ({ product, delay = 0 }: { product: Product; delay?: number }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  const { whatsappNumber } = useContactInfo();
  const whatsappMsg = encodeURIComponent(
    `Hi, I'd like to order from *Javani Spiritual Hub*:\n\n*${product.name}* (${product.categoryLabel})\nPrice: *${product.price}/-*\nQuantity: ${qty}${product.image ? `\n\nProduct Image: ${product.image}` : ""}`
  );
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`${isVisible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: isVisible ? `${delay}s` : undefined }}>
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-card shadow-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hero group flex flex-col h-full">

        {/* Image */}
        <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img src={product.image} alt={product.name} loading="lazy" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? "opacity-100" : "opacity-0"}`} />
          <span className={`absolute top-2 left-2 px-2 py-0.5 text-[0.65rem] sm:text-xs font-body font-medium rounded-full ${categoryBadgeColors[product.category] || "bg-muted text-muted-foreground"}`}>{product.categoryLabel}</span>
          <div className="absolute top-1.5 right-1.5">
            <ShareButton
              title={product.name}
              text={`Check out *${product.name}* on Javani Spiritual Hub — *${product.price}/-*${product.image ? `\n\nImage: ${product.image}` : ""}`}
              url={`/products/${product.id}`}
              className="bg-black/40 hover:bg-black/60 text-white hover:text-white rounded-full w-7 h-7 sm:w-auto sm:h-auto"
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-2.5 sm:p-5 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-[0.8rem] sm:text-[1.1rem] text-foreground mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>

          {/* Description — hidden on mobile */}
          <p className="hidden sm:block font-body font-light text-[0.875rem] text-muted-foreground mb-4 leading-relaxed flex-1">{product.description}</p>

          <p className="font-body font-semibold text-base sm:text-[1.4rem] text-primary mb-2 sm:mb-3">{product.price}/-</p>

          {/* Qty — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 mb-4">
            <span className="font-body text-[0.8rem] text-muted-foreground">Qty:</span>
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-md">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-body font-semibold text-foreground text-[0.8rem]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-md">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile: just WhatsApp button */}
          <div className="flex sm:hidden gap-1.5">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center px-2.5 py-1.5 rounded bg-[#25D366] text-white font-body font-medium text-[0.7rem] hover:bg-[#128C7E] transition-colors w-full"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1" /> Order Now
            </a>
          </div>

          {/* Desktop: full buttons */}
          <div className="hidden sm:flex gap-3">
            <GoldOutlineButton className="text-[0.8rem] px-4 py-2 w-full flex-1">View Details</GoldOutlineButton>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-[#25D366] text-white font-body font-medium text-[0.8rem] hover:bg-[#128C7E] transition-colors flex-1 text-center"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
};

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<ProductCategory>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { whatsappNumber } = useContactInfo();

  useEffect(() => {
    document.body.classList.add("hide-nav-mobile");
    return () => document.body.classList.remove("hide-nav-mobile");
  }, []);

  useEffect(() => {
    console.log("[Products] Starting Firestore listener on 'products' collection...");
    const unsub = onSnapshot(
      collection(db, "products"),
      (snap) => {
        console.log("[Products] Snapshot received:", snap.size, "documents");
        const data = snap.docs.map((d) => {
          const doc = { id: d.id, ...d.data() } as Product;
          console.log("[Products] Doc:", d.id, "category:", doc.category, "name:", doc.name);
          return doc;
        });
        setProducts(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("[Products] Firestore error:", err.code, err.message);
        setError(`Failed to load products: ${err.message}`);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter), [activeFilter, products]);

  return (
    <>
      <SEO
        title="Products & Materials | Costumes, Instruments | Javani Spiritual Hub"
        description="Shop authentic costumes, instruments, books, and practice accessories curated by Javani Spiritual Hub faculty."
      />
      <main>
        <PageHero backgroundImages={[heroDancer1, heroTemple, carnaticMusic]} label="OUR PRODUCTS" heading="Artistry Begins With the Right Tools" subtext="Authentic costumes, instruments, and learning materials — curated by our faculty." />

        <div className="bg-gold py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="font-body font-medium text-[0.8rem] sm:text-[0.9rem] text-white text-center sm:text-left">
              <ShoppingBag className="w-4 h-4 inline mr-2" />Product section is currently being curated. Want to enquire about a specific item? Reach us directly on WhatsApp.
            </p>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-sm bg-charcoal text-white font-body font-medium text-[0.8rem] sm:text-[0.85rem] hover:bg-charcoal/80 transition-colors whitespace-nowrap">
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="sticky top-0 sm:top-[80px] z-[500] bg-card shadow-sm py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`px-4 sm:px-5 py-2 rounded-full font-body font-medium text-[0.8rem] sm:text-[0.875rem] transition-all duration-300 ${activeFilter === f.value ? "bg-gradient-primary text-primary-foreground" : "border border-ivory-dark text-muted-foreground hover:bg-ivory-dark"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <section className="py-12 sm:py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div ref={headerRef} className={`${headerVisible ? "animate-fade-up" : "opacity-0"}`}>
              <SectionLabel text="CURATED FOR ARTISTS" className="mb-6" />
              <h2 className="font-display font-semibold text-[1.8rem] sm:text-[2rem] md:text-[3rem] text-foreground text-center mb-10 sm:mb-12">Our Collection</h2>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-body text-sm text-muted-foreground">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="font-display text-xl text-destructive mb-2">Unable to load products</p>
                <p className="font-body text-sm text-muted-foreground">{error}</p>
                <p className="font-body text-xs text-muted-foreground/60 mt-2">Check Firestore rules — "products" collection needs <code>allow read: if true</code></p>
              </div>
            ) : filtered.length === 0 ? (
              <p className="font-display text-xl text-muted-foreground text-center py-12">No products available in this category.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <div className="hidden sm:block"><Footer /></div>
    </>
  );
};

export default Products;
