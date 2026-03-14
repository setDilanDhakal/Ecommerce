import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import UserNav from "../components/UserNav";
import { api, toAbsoluteUrl } from "../lib/api.js";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs${num.toFixed(2)}` : "Rs0.00";
}

function ProductCard({ product }) {
  const tags = [product.genderType, product.season].filter(Boolean);

  return (
    <Link
      to="/product/detail"
      className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl"
    >
      <div className="relative h-44 w-full">
        <img
          src={toAbsoluteUrl(product.image)}
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
              <span>•</span>
              <span className="truncate">{product.season}</span>
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
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
              >
                {String(tag).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/products/active");
        if (!cancelled) setProducts(response?.data?.data || []);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || "Failed to load products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [products, query]);

  return (
    <>
      <UserNav />

      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="mt-1 text-sm text-white/60">
                Browse active products from the latest collection.
              </p>
            </div>

            <div className="w-full md:w-96">
              <label className="text-xs font-semibold text-white/60">Search</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-10 flex items-center justify-center gap-2 text-white/70">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading products...
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
                  No products found
                </div>
              ) : (
                filtered.map((p) => <ProductCard key={p._id} product={p} />)
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Product;


