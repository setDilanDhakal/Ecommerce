import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, toAbsoluteUrl } from "../lib/api.js";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs${num.toFixed(2)}` : "Rs0.00";
}

function Card() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rootRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/products/active");
        if (cancelled) return;
        setProducts(response?.data?.data || []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [products]);

  return (
    <div ref={rootRef} className="mx-auto max-w-screen-xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-white">Latest Collection</h1>
      <p className="mt-1 text-sm text-white/60">
        Discover our latest collection of trendy and stylish jackets.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
            Loading products...
          </div>
        ) : error ? (
          <div className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-10 text-center text-sm text-red-200">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
            No products found
          </div>
        ) : (
          products.slice(0, 5).map((product) => (
            <Link
              key={product._id}
              to={`/product/detail/${product._id}`}
              className="group reveal w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl"
            >
              <div className="relative h-44 w-full">
                <img
                  src={product.image ? toAbsoluteUrl(product.image) : "/vite.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Active
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>{formatMoney(product.price)}</span>
                      {product.season ? (
                        <>
                          <span>•</span>
                          <span className="truncate">{product.season}</span>
                        </>
                      ) : null}
                    </div>
                    <h3 className="mt-1 truncate text-lg font-semibold">{product.name}</h3>
                  </div>
                  <div className="shrink-0 text-xs font-semibold text-neon">View</div>
                </div>

                <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                  <p className="text-sm text-white/70 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[product.genderType, product.season].filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                      >
                        {String(tag).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Add to Cart
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Card;
