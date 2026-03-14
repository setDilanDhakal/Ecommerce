import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserNav from "../components/UserNav.jsx";
import {
  Camera,
  Info,
  Loader2,
  Send,
  ShoppingCart,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { api, toAbsoluteUrl } from "../lib/api.js";
import { useAuth } from "../context/useAuth.js";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-white/30"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-white/60">
        {Number(rating || 0).toFixed(1)}
      </span>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setError("Product not found");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/products/${id}`);
        if (cancelled) return;
        setProduct(response?.data?.data || null);
        setCurrentImageIndex(0);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product?.image) return [];
    return [toAbsoluteUrl(product.image)];
  }, [product?.image]);

  const tags = useMemo(() => {
    if (!product) return [];
    return [
      product.genderType ? { label: product.genderType, icon: Users } : null,
      product.season ? { label: product.season, icon: Tag } : null,
      { label: product.isActive ? "Active" : "Inactive", icon: Info },
    ].filter(Boolean);
  }, [product]);

  const breadcrumbs = useMemo(
    () => [
      { label: "Market", href: "/" },
      { label: "Clothing", href: "/product" },
      { label: product?.name || "Product", href: `/product/detail/${id || ""}` },
    ],
    [id, product?.name]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <UserNav />
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading product...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <UserNav />
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
            <div className="mt-4">
              <Link to="/product" className="text-sm font-medium text-white hover:underline">
                Back to products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <UserNav />
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-8">
          <nav className="mb-4 flex items-center text-sm text-white/60">
            {breadcrumbs.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <Link to={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-white/30">/</span>
                )}
              </div>
            ))}
          </nav>

          <main className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <img
                  src={images[currentImageIndex] || "/vite.svg"}
                  alt={`${product.name} ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        currentImageIndex === index
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {product.name}
              </h1>
              <div className="mt-2">
                <span className="text-4xl font-bold">Rs{Number(product.price || 0)}</span>
              </div>

              {actionSuccess ? (
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {actionSuccess}
                </div>
              ) : null}

              {actionError ? (
                <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {actionError}
                </div>
              ) : null}

              <div className="my-6 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={adding || Boolean(user?.isAdmin)}
                  onClick={async () => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    if (user?.isAdmin) {
                      setActionError("Admins cannot use cart");
                      setActionSuccess("");
                      return;
                    }
                    setActionError("");
                    setActionSuccess("");
                    setAdding(true);
                    try {
                      await api.post("/carts/items", { productId: product._id, quantity: 1 });
                      setActionSuccess("Added to cart");
                    } catch (err) {
                      setActionError(
                        err?.response?.data?.message ||
                          err?.message ||
                          "Failed to add to cart"
                      );
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-black hover:brightness-95 transition-colors disabled:opacity-60"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {user?.isAdmin ? "Admins can't add to cart" : adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      <Icon className="h-4 w-4" />
                      {String(item.label).toUpperCase()}
                    </span>
                  );
                })}
              </div>

              <p className="leading-relaxed text-white/70">{product.description}</p>


            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
