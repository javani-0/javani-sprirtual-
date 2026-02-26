import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Eye, EyeOff } from "lucide-react";
import GoldDivider from "@/components/GoldDivider";
import PrimaryButton from "@/components/PrimaryButton";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Set display name
      await updateProfile(cred.user, { displayName: username.trim() });

      // 3. Store user data in Firestore "users" collection with unique UID
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        username: username.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      // 4. Redirect to home page
      navigate("/", { replace: true });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1A0A0A 0%, #2C1810 50%, #1A0A0A 100%)",
      }}
    >
      {/* Mandala pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        viewBox="0 0 400 400"
        fill="hsl(var(--primary))"
      >
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <path
          d="M200 20 L200 380 M20 200 L380 200 M60 60 L340 340 M340 60 L60 340"
          stroke="currentColor"
          strokeWidth="0.3"
        />
      </svg>

      <div
        className="relative z-10 w-full max-w-[420px] mx-4 rounded-xl p-10 md:p-12"
        style={{
          background: "rgba(250,243,224,0.05)",
          border: "1px solid rgba(201,168,76,0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-center mb-6">
          <h1 className="font-accent text-[1.8rem] text-gold">Javani</h1>
          <p className="font-display text-[0.75rem] tracking-[0.25em] text-white/50 uppercase">
            Spiritual Arts
          </p>
        </div>

        <GoldDivider />

        <h2 className="font-display font-semibold text-[2rem] text-white text-center mt-4 mb-1">
          Create Account
        </h2>
        <p className="font-body font-light text-[0.9rem] text-white/60 text-center mb-8">
          Join Javani Spiritual Arts community.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive font-body text-[0.85rem] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[0.85rem] text-white/70 mb-1.5 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md font-body text-white bg-white/[0.08] border border-white/10 outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] placeholder:text-white/30"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="font-body text-[0.85rem] text-white/70 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md font-body text-white bg-white/[0.08] border border-white/10 outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] placeholder:text-white/30"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="font-body text-[0.85rem] text-white/70 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-md font-body text-white bg-white/[0.08] border border-white/10 outline-none transition-all focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] placeholder:text-white/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <PrimaryButton type="submit" disabled={loading} className="w-full text-center justify-center">
            {loading ? "Creating Account..." : "Sign Up"}
          </PrimaryButton>
        </form>

        <p className="font-body text-[0.85rem] text-white/50 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
