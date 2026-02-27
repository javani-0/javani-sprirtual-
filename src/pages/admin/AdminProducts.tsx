import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";
import { Plus, Pencil, Trash2, X, LayoutGrid, List, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  description: string;
  price: string;
  image: string;
  stockStatus: string;
  whatsappEnquiry: boolean;
}

const categoryLabelMap: Record<string, string> = {
  clothing: "Clothing",
  "thermic-toys": "Thermic Toys",
  aaharya: "Aaharya Collections",
  accessories: "Practice Accessories",
  "books-stationaries": "Books & Stationaries",
  "sattvic-refreshments": "Sattvic Refreshments"
};

const emptyForm = { name: "", category: "clothing", categoryLabel: "Clothing", description: "", price: "", image: "", stockStatus: "available", whatsappEnquiry: true };

const stockColors: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  "out-of-stock": "bg-destructive/10 text-destructive",
  "coming-soon": "bg-yellow-100 text-yellow-700",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
    });
    return unsub;
  }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowModal(true); };
  const openEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, categoryLabel: p.categoryLabel, description: p.description, price: p.price, image: p.image ?? "", stockStatus: p.stockStatus, whatsappEnquiry: p.whatsappEnquiry });
    setEditing(p.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and price required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        await updateDoc(doc(db, "products", editing), { ...form });
        toast({ title: "Product updated" });
      } else {
        await addDoc(collection(db, "products"), { ...form });
        toast({ title: "Product added" });
      }
      closeModal();
    } catch (err) {
      console.error("Error saving product:", err);
      toast({ title: "Error saving product", description: "Check console for details.", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "products", deleteTarget));
      toast({ title: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Failed to delete product", description: "Please check permissions and try again", variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[1.3rem] text-foreground">All Products ({products.length})</h3>
        <div className="flex items-center gap-3">
          <div className="flex border border-border rounded-md overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("table")} className={`p-2.5 ${viewMode === "table" ? "bg-gold text-gold-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}><List className="w-4 h-4" /></button>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-primary text-primary-foreground font-body text-[0.85rem] font-medium hover:brightness-110">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-card shadow-card rounded-lg overflow-hidden hover:shadow-hero transition-shadow">
              {p.image && (
                <div className="aspect-[3/2] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-body text-[0.75rem] text-muted-foreground">{p.categoryLabel}</span>
                  <span className={`px-2 py-1 rounded-full font-body text-[0.7rem] ${stockColors[p.stockStatus] || stockColors.available}`}>{p.stockStatus}</span>
                </div>
                <h4 className="font-display font-semibold text-[1.05rem] text-foreground mb-1">{p.name}</h4>
                <p className="font-body text-[0.8rem] text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                <p className="font-display font-bold text-[1.1rem] text-primary mb-3">{p.price}</p>
                <div className="flex items-center justify-end gap-1 pt-3 border-t border-border/50">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-gold"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card shadow-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50">
                  {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 font-body font-medium text-[0.75rem] text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-3 font-body text-[0.875rem] text-foreground font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-body text-[0.8rem] text-muted-foreground">{p.categoryLabel}</td>
                    <td className="px-4 py-3 font-display font-bold text-[1rem] text-primary">{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full font-body text-[0.75rem] ${stockColors[p.stockStatus] || stockColors.available}`}>{p.stockStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-gold"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-card rounded-xl shadow-hero w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-[1.3rem]">{editing ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border font-body text-[0.875rem] outline-none focus:border-gold" />
              </div>
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, categoryLabel: categoryLabelMap[e.target.value] || e.target.value })} className="w-full px-3 py-2 rounded-md border border-border font-body text-[0.875rem] outline-none">
                  <option value="clothing">Clothing</option>
                  <option value="thermic-toys">Thermic Toys</option>
                  <option value="aaharya">Aaharya Collections</option>
                  <option value="accessories">Practice Accessories</option>
                  <option value="books-stationaries">Books & Stationaries</option>
                  <option value="sattvic-refreshments">Sattvic Refreshments</option>
                </select>
              </div>
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border border-border font-body text-[0.875rem] outline-none focus:border-gold" />
              </div>
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Price *</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border font-body text-[0.875rem] outline-none focus:border-gold" placeholder="₹1,000" />
              </div>
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Product Image</label>
                {form.image && <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-md mb-2" />}
                <div className="flex gap-2">
                  <button type="button" onClick={() => imageRef.current?.click()} disabled={imageUploading} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border font-body text-[0.85rem] hover:bg-muted disabled:opacity-50">
                    <Upload className="w-4 h-4" /> {imageUploading ? "Uploading..." : "Upload Image"}
                  </button>
                  <input ref={imageRef} type="file" accept="image/*" hidden onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(true);
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
                    try {
                      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      if (!data.secure_url) throw new Error("No URL returned");
                      setForm((prev) => ({ ...prev, image: data.secure_url }));
                    } catch {
                      toast({ title: "Image upload failed", description: "Check Cloudinary preset settings.", variant: "destructive" });
                    }
                    setImageUploading(false);
                    if (imageRef.current) imageRef.current.value = "";
                  }} />
                </div>
              </div>
              <div>
                <label className="font-body text-[0.85rem] text-muted-foreground block mb-1">Stock Status</label>
                <select value={form.stockStatus} onChange={(e) => setForm({ ...form, stockStatus: e.target.value })} className="w-full px-3 py-2 rounded-md border border-border font-body text-[0.875rem] outline-none">
                  <option value="available">Available</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>
              <button onClick={handleSave} className="w-full px-4 py-2.5 rounded-md bg-gradient-primary text-primary-foreground font-body text-[0.9rem] font-medium hover:brightness-110">
                {editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
