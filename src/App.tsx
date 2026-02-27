import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import FloatingButtons from "./components/FloatingButtons";
import ScrollProgressBar from "./components/ScrollProgressBar";
import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import PageLoader from "./components/PageLoader";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Courses = lazy(() => import("./pages/Courses"));
const Grading = lazy(() => import("./pages/Grading"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const GuruBandhu = lazy(() => import("./pages/GuruBandhu"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminFaculty = lazy(() => import("./pages/admin/AdminFaculty"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminPlaceholder = lazy(() => import("./pages/admin/AdminPlaceholder"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicFloatingButtons = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <FloatingButtons />;
};

const PublicScrollProgress = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <ScrollProgressBar />;
};

const PublicNavbar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/signup") return null;
  return <Navbar />;
};

const SuspenseLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-body text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Hide loader after it completes (1.3s for progress + 0.2s fade)
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showLoader && <PageLoader />}
          <BrowserRouter>
            <ScrollToTop />
            <PublicNavbar />
            <PublicFloatingButtons />
            <PublicScrollProgress />
            <Suspense fallback={<SuspenseLoader />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/grading" element={<Grading />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/guru-bandhu" element={<GuruBandhu />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="enquiries" element={<AdminEnquiries />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="products" element={<AdminProducts />} />                    <Route path="faculty" element={<AdminFaculty />} />                    <Route path="site-settings" element={<AdminSiteSettings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
