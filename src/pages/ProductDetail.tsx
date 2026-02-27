import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useContactInfo } from "@/hooks/useContactInfo";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ShareButton from "@/components/ShareButton";
import { MessageCircle, ArrowLeft, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: string;
}

const categoryBadgeColors: Record<string, string> = {
  clothing: "bg-primary text-primary-foreground",
  "thermic-toys": "bg-gold text-gold-foreground",
  aaharya: "bg-charcoal text-charcoal-foreground",
  accessories: "bg-primary-light text-primary-foreground",
  "books-stationaries": "bg-muted text-foreground",
  "sattvic-refreshments": "bg-green-100 text-green-700",
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { whatsappNumber } = useContactInfo();

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
    document.body.classList.add("hide-nav-mobile");
    return () => document.body.classList.remove("hide-nav-mobile");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <h1 className="font-display text-2xl text-foreground">Product not found</h1>
        <Link to="/products" className="text-gold hover:underline font-body text-sm">← Back to Products</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I'd like to order from *Javani Spiritual Hub*:\n\n` +
    `*${product.name}*\n` +
    `Category: ${product.categoryLabel}\n` +
    `Price: ${product.price}\n` +
    `Quantity: ${qty}\n\n` +
    `${product.description}\n\n` +
    `Product link: ${window.location.href}`
  );

  return (
    <>
      <SEO
        title={`${product.name} | Javani Spiritual Hub`}
        description={product.description}
      />
      <main className="min-h-screen bg-background pt-0 sm:pt-[80px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Back */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold font-body text-[0.85rem] mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
              {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
              <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium rounded-full ${categoryBadgeColors[product.category] || "bg-muted text-muted-foreground"}`}>
                {product.categoryLabel}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">

              {/* Title + Share */}
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-display font-semibold text-2xl sm:text-3xl text-foreground leading-tight">
                  {product.name}
                </h1>
                <ShareButton
                  title={product.name}
                  text={`Check out *${product.name}* on Javani Spiritual Hub — ${product.price}`}
                  url={`/products/${product.id}`}
                  imageUrl={product.image}
                />
              </div>

              {/* Price */}
              <p className="font-display font-bold text-3xl sm:text-4xl text-primary">
                {product.price}
              </p>

              {/* Description */}
              <p className="font-body font-light text-[0.95rem] sm:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="border-t border-border/50 pt-5 flex flex-col gap-4">
                {/* Qty */}
                <div className="flex items-center gap-3">
                  <span className="font-body text-sm text-foreground font-medium">Quantity:</span>
                  <div className="flex items-center border border-border rounded-md overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-body font-semibold text-foreground text-sm border-x border-border py-2">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Order CTA */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-sm bg-[#25D366] text-white font-body font-semibold text-base hover:bg-[#128C7E] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                </a>

                {/* Enquire */}
                <Link
                  to="/contact"
                  className="flex items-center justify-center w-full py-3 rounded-sm border border-primary text-primary font-body font-medium text-sm hover:bg-primary/5 transition-colors"
                >
                  Enquire About This Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="hidden sm:block"><Footer /></div>
    </>
  );
};

export default ProductDetail;
