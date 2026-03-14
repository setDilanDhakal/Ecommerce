import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

function BackgroundSlider({ images, interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval]);
  return (
    <div className="absolute inset-0">
      <div className="w-full h-full">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === current ? "opacity-100 scale-105 motion-safe:animate-[slow-zoom_18s_ease-in-out_infinite]" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  const bgImages = [
    "https://images.unsplash.com/photo-1522402364115-7861689d1728?q=80&w=1247&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1645996831587-a9d4a73586f9?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1671552488575-3bceee973d7b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1691622500807-6d9eeb9ea06a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return(
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-black lg:bg-transparent overflow-hidden">
      <div className="hidden lg:block bg-[#f5f3e6] relative h-screen">
        <BackgroundSlider images={bgImages} interval={4500} />
      </div>
      <div className="bg-black text-white flex items-center justify-center p-8 lg:border-l lg:border-white/10 h-screen">
        <div className="w-full max-w-sm animate-[fade-up_600ms_ease-out]">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xl italic font-bold text-neon tracking-wide">NOMAD.</span>
            <Link to="/" className="rounded-lg bg-white/10 text-white px-3 py-1.5 border border-white/20 hover:bg-white/15">
              Home
            </Link>
          </div>
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="text-sm text-white/60 mt-1">Enter your credentials to access your account.</p>


          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 bg-black/80 border border-white/15">
                <Mail className="w-4 h-4 text-white/70" />
                <input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-0" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-white/70 hover:text-white">Forgot password?</a>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 bg-black/80 border border-white/15">
                <Lock className="w-4 h-4 text-white/70" />
                <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-transparent text-white placeholder:text-white/50 outline-none border-0" />
              </div>
            </div>
            {error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white text-black py-2.5 font-medium shadow-md transition-colors hover:bg-neon hover:text-black disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <p className="text-xs text-white/60 text-center mt-6">
            Don't have an account? <Link to="/register" className="font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Login



