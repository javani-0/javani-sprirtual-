import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";
import { Upload, Trash2, Image as ImageIcon, AlertTriangle, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface GalleryItem {
  id: string;
  url: string;
  publicId: string;
  category: string;
  timestamp: any;
}

const categories = ["Performances", "Workshops", "Certifications", "Behind the Scenes", "Recitals"];

// Real, persistent image URLs for initial seeding
const seedGalleryImages = [
  { url: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80", category: "Performances" },
  { url: "https://images.unsplash.com/photo-1617691786979-3ec0d8716aab?w=800&q=80", category: "Performances" },
  { url: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8?w=800&q=80", category: "Performances" },
  { url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80", category: "Workshops" },
  { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", category: "Workshops" },
  { url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80", category: "Behind the Scenes" },
  { url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80", category: "Recitals" },
  { url: "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&q=80", category: "Recitals" },
  { url: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&q=80", category: "Certifications" },
];

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Performances");
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [seeding, setSeeding] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlCategory, setUrlCategory] = useState("Performances");
  const [addingUrl, setAddingUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if gallery needs seeding
    const checkAndSeed = async () => {
      const snap = await getDocs(collection(db, "gallery"));
      if (snap.empty) {
        setSeeding(true);
        for (const img of seedGalleryImages) {
          await addDoc(collection(db, "gallery"), {
            url: img.url,
            publicId: "",
            category: img.category,
            timestamp: serverTimestamp(),
          });
        }
        setSeeding(false);
      }
    };
    checkAndSeed();

    const unsub = onSnapshot(collection(db, "gallery"), (snap) => {
      setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem)));
    });
    return unsub;
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPreviewFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const uploadAll = async () => {
    if (previewFiles.length === 0) return;
    setUploading(true);
    setProgress(0);

    for (let i = 0; i < previewFiles.length; i++) {
      const formData = new FormData();
      formData.append("file", previewFiles[i]);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        await addDoc(collection(db, "gallery"), {
          url: data.secure_url,
          publicId: data.public_id,
          category: selectedCategory,
          timestamp: serverTimestamp(),
        });
      } catch {
        toast({ title: `Failed to upload ${previewFiles[i].name}`, variant: "destructive" });
      }
      setProgress(((i + 1) / previewFiles.length) * 100);
    }

    setPreviewFiles([]);
    setPreviews([]);
    setUploading(false);
    toast({ title: "Upload complete!" });
  };

  const deleteImage = async (item: GalleryItem) => {
    if (!confirm("Remove this image from gallery?")) return;
    await deleteDoc(doc(db, "gallery", item.id));
    toast({ title: "Image removed from gallery" });
  };

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => new Set(prev).add(id));
  };

  const addByUrl = async () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast({ title: "Please enter a valid URL", variant: "destructive" });
      return;
    }
    setAddingUrl(true);
    try {
      await addDoc(collection(db, "gallery"), {
        url: trimmed,
        publicId: "",
        category: urlCategory,
        timestamp: serverTimestamp(),
      });
      setImageUrl("");
      toast({ title: "Image added from URL!" });
    } catch {
      toast({ title: "Failed to add image", variant: "destructive" });
    }
    setAddingUrl(false);
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-card shadow-card rounded-lg p-4 sm:p-6">
        <h3 className="font-display font-semibold text-[1.3rem] text-foreground mb-4">Upload Images</h3>
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end mb-4">
          <div
            className="border-2 border-dashed border-gold/30 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-gold/60 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
          >
            <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="font-body text-[0.9rem] text-muted-foreground">Drag & drop images or click to browse</p>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          </div>
          <div className="space-y-3">
            <div>
              <label className="font-body text-[0.8rem] text-muted-foreground block mb-1">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-card font-body text-[0.85rem] outline-none w-full">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={uploadAll} disabled={uploading || previewFiles.length === 0} className="w-full px-4 py-2.5 rounded-md bg-gradient-primary text-primary-foreground font-body text-[0.85rem] font-medium disabled:opacity-50 hover:brightness-110 transition-all">
              {uploading ? "Uploading..." : `Upload ${previewFiles.length} Image${previewFiles.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {uploading && <Progress value={progress} className="h-2" />}

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {previews.map((p, i) => (
              <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-md border border-border" />
            ))}
          </div>
        )}
      </div>

      {/* Add by URL Section */}
      <div className="bg-card shadow-card rounded-lg p-4 sm:p-6">
        <h3 className="font-display font-semibold text-[1.3rem] text-foreground mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-gold" /> Add Image by URL
        </h3>
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div>
            <label className="font-body text-[0.8rem] text-muted-foreground block mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-md border border-border bg-card font-body text-[0.85rem] outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="font-body text-[0.8rem] text-muted-foreground block mb-1">Category</label>
            <select value={urlCategory} onChange={(e) => setUrlCategory(e.target.value)} className="px-3 py-2 rounded-md border border-border bg-card font-body text-[0.85rem] outline-none w-full">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={addByUrl} disabled={addingUrl || !imageUrl.trim()} className="px-4 py-2.5 rounded-md bg-gradient-primary text-primary-foreground font-body text-[0.85rem] font-medium disabled:opacity-50 hover:brightness-110 transition-all whitespace-nowrap">
            {addingUrl ? "Adding..." : "Add Image"}
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        <h3 className="font-display font-semibold text-[1.3rem] text-foreground mb-4">
          Gallery ({images.length} images)
          {seeding && <span className="ml-2 font-body text-[0.8rem] text-muted-foreground">Setting up...</span>}
        </h3>
        {images.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg shadow-card">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-body text-muted-foreground">No gallery images yet. Upload some above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden bg-muted aspect-[4/3]">
                {brokenImages.has(item.id) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <p className="font-body text-[0.75rem]">Image unavailable</p>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(item.id)}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-gold/80 text-white text-[0.7rem] font-body">{item.category}</span>
                  <button onClick={() => deleteImage(item)} className="p-2 rounded-full bg-destructive text-white hover:bg-destructive/80">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
