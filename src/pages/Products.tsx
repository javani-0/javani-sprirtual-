import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useContactInfo } from "@/hooks/useContactInfo";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SectionLabel from "@/components/SectionLabel";
import GoldOutlineButton from "@/components/GoldOutlineButton";
import SEO from "@/components/SEO";
import { MessageCircle, ShoppingBag, X, Minus, Plus } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroDancer1 from "@/assets/hero-dancer-1.jpg";
import heroTemple from "@/assets/hero-temple.jpg";
import carnaticMusic from "@/assets/carnatic-music.jpg";

type ProductCategory = "all" | "costumes" | "instruments" | "books" | "accessories";

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
  { label: "All", value: "all" }, { label: "Costumes", value: "costumes" },
  { label: "Instruments", value: "instruments" }, { label: "Books & Notation", value: "books" },
  { label: "Practice Accessories", value: "accessories" },
];

const categoryBadgeColors: Record<string, string> = {
  costumes: "bg-primary text-primary-foreground",
  instruments: "bg-gold text-gold-foreground",
  books: "bg-charcoal text-charcoal-foreground",
  accessories: "bg-primary-light text-primary-foreground",
};

const SkeletonCard = () => (
  <div className="bg-card shadow-card rounded-lg overflow-hidden">
    <div className="aspect-[4/3] skeleton-shimmer" />
    <div className="p-5 sm:p-6 space-y-3">
      <div className="h-5 w-3/4 skeleton-shimmer rounded" />
      <div className="h-4 w-full skeleton-shimmer rounded" />
      <div className="h-6 w-24 skeleton-shimmer rounded" />
      <div className="h-10 w-full skeleton-shimmer rounded" />
    </div>
  </div>
);

const ProductDetailModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const { whatsappNumber } = useContactInfo();
  const [qty, setQty] = useState(1);

  const whatsappMsg = encodeURIComponent(
    `Hi, I'd like to order from *Javni Spiritual Arts*:\n\n` +
    `*${product.name}*\n` +
    `Category: ${product.categoryLabel}\n` +
    `Price: ${product.price}\n` +
    `Quantity: ${qty}\n\n` +
    `${product.description}\n\n` +
    (product.image ? `Image: ${product.image}` : "")
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-card rounded-xl shadow-hero max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-charcoal/70 text-white hover:bg-charcoal transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium rounded-full ${categoryBadgeColors[product.category] || "bg-muted text-muted-foreground"}`}>{product.categoryLabel}</span>
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">{product.name}</h2>
          <p className="font-display font-bold text-2xl sm:text-3xl text-primary">{product.price}</p>
          <p className="font-body font-light text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-foreground font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-md">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-l-md">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-body font-semibold text-foreground text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-r-md">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-sm bg-[#25D366] text-white font-body font-semibold text-sm sm:text-base hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-5 h-5" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProductCard = ({ product, delay = 0, onViewDetails }: { product: Product; delay?: number; onViewDetails: (p: Product) => void }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty, setQty] = useState(1);
  const { whatsappNumber } = useContactInfo();
  const whatsappMsg = encodeURIComponent(
    `Hi, I'd like to order from *Javni Spiritual Arts*:\n\n*${product.name}* (${product.categoryLabel})\nPrice: ${product.price}\nQuantity: ${qty}\n\n${product.image ? `Image: ${product.image}` : ""}`
  );
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`${isVisible ? "animate-fade-up" : "opacity-0"}`} style={{ animationDelay: isVisible ? `${delay}s` : undefined }}>
      <div className="bg-card shadow-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-hero group flex flex-col h-full">
        <div className="aspect-[4/3] relative overflow-hidden">
          {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
          <img src={product.image} alt={product.name} loading="lazy" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? "opacity-100" : "opacity-0"}`} />
          <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium rounded-full ${categoryBadgeColors[product.category] || "bg-muted text-muted-foreground"}`}>{product.categoryLabel}</span>
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-[1.1rem] sm:text-[1.2rem] text-foreground mb-2">{product.name}</h3>
          <p className="font-body font-light text-[0.8rem] sm:text-[0.875rem] text-muted-foreground mb-4 leading-relaxed flex-1">{product.description}</p>
          <p className="font-display font-bold text-[1.2rem] sm:text-[1.4rem] text-primary mb-3">{product.price}</p>
          <div className="flex items-center gap-2 mb-4">
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
          <div className="flex gap-2 sm:gap-3">
            <GoldOutlineButton className="text-[0.75rem] sm:text-[0.8rem] px-3 sm:px-4 py-2 flex-1" onClick={() => onViewDetails(product)}>View Details</GoldOutlineButton>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-sm bg-[#25D366] text-white font-body font-medium text-[0.75rem] sm:text-[0.8rem] hover:bg-[#128C7E] transition-colors flex-1 text-center">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [activeFilter, setActiveFilter] = useState<ProductCategory>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { whatsappNumber } = useContactInfo();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      if (!snap.empty) {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      }
      setLoading(false);
    }, (err) => { console.error("Error fetching products:", err); setLoading(false); });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter), [activeFilter, products]);

  return (
    <>
      <SEO
        title="Products & Materials | Costumes, Instruments | Javni Spiritual Arts"
        description="Shop authentic costumes, instruments, books, and practice accessories curated by Javni Spiritual Arts faculty."
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

        <div className="sticky top-[80px] z-[500] bg-card shadow-sm py-3 sm:py-4">
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
                {/* Loading - show nothing to avoid confusion */}
              </div>
            ) : filtered.length === 0 ? (
              <p className="font-display text-xl text-muted-foreground text-center py-12">No products available in this category.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} onViewDetails={setSelectedProduct} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
};

export default Products;
