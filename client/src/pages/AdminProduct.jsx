import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Box,
  ClipboardList,
  Edit3,
  Loader2,
  PlusCircle,
  Power,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { api, toAbsoluteUrl } from "../lib/api.js";
import { useAuth } from "../context/useAuth.js";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs${num.toFixed(2)}` : "Rs0.00";
}

function AdminProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("All Products");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderUsersById, setOrderUsersById] = useState({});
  const [orderProductsById, setOrderProductsById] = useState({});
  const [userSearch, setUserSearch] = useState("");
  const [newProductPreviewUrl, setNewProductPreviewUrl] = useState("");
  const [editPreviewUrl, setEditPreviewUrl] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    genderType: "male",
    season: "summer",
    isActive: true,
    imageFile: null,
  });

  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    genderType: "",
    season: "",
    isActive: true,
    imageFile: null,
  });

  useEffect(() => {
    if (!newProduct.imageFile) {
      setNewProductPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(newProduct.imageFile);
    setNewProductPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newProduct.imageFile]);

  useEffect(() => {
    if (!editForm.imageFile) {
      setEditPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(editForm.imageFile);
    setEditPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [editForm.imageFile]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.isAdmin) {
      navigate("/");
    }
  }, [navigate, user]);

  const pages = useMemo(
    () => [
      { key: "Add Product", icon: PlusCircle },
      { key: "All Products", icon: Box },
      { key: "Users", icon: Users },
      { key: "Orders", icon: ClipboardList },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      const haystack = [name, u.email, u.mobileNo, u._id]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return haystack.includes(q);
    });
  }, [userSearch, users]);

  const fetchProducts = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/products");
      setProducts(response?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const orderUsersByIdRef = useRef({});
  const orderProductsByIdRef = useRef({});

  useEffect(() => {
    orderUsersByIdRef.current = orderUsersById;
  }, [orderUsersById]);

  useEffect(() => {
    orderProductsByIdRef.current = orderProductsById;
  }, [orderProductsById]);

  const fetchOrders = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/orders");
      const nextOrders = response?.data?.data || [];
      setOrders(nextOrders);

      const userIds = Array.from(
        new Set(nextOrders.map((o) => String(o?.userId || "")).filter(Boolean))
      );
      const productIds = Array.from(
        new Set(
          nextOrders
            .flatMap((o) => (Array.isArray(o?.productsOrdered) ? o.productsOrdered : []))
            .map((it) => String(it?.productId || ""))
            .filter(Boolean)
        )
      );

      const missingUsers = userIds.filter((id) => !orderUsersByIdRef.current[id]);
      if (missingUsers.length > 0) {
        const fetched = await Promise.all(
          missingUsers.map((id) =>
            api
              .get(`/users/${id}`)
              .then((r) => r?.data?.data || null)
              .catch(() => null)
          )
        );
        const mapped = fetched
          .filter(Boolean)
          .reduce((acc, u) => {
            acc[String(u._id)] = u;
            return acc;
          }, {});
        setOrderUsersById((prev) => ({ ...prev, ...mapped }));
      }

      const missingProducts = productIds.filter((id) => !orderProductsByIdRef.current[id]);
      if (missingProducts.length > 0) {
        const fetched = await Promise.all(
          missingProducts.map((id) =>
            api
              .get(`/products/${id}`)
              .then((r) => r?.data?.data || null)
              .catch(() => null)
          )
        );
        const mapped = fetched
          .filter(Boolean)
          .reduce((acc, p) => {
            acc[String(p._id)] = p;
            return acc;
          }, {});
        setOrderProductsById((prev) => ({ ...prev, ...mapped }));
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) return;
    if (activePage === "All Products") fetchProducts();
    if (activePage === "Users") fetchUsers();
    if (activePage === "Orders") fetchOrders();
  }, [activePage, fetchOrders, fetchProducts, fetchUsers, user?.isAdmin]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!newProduct.name.trim() || !newProduct.description.trim() || !newProduct.price) {
      setError("Please fill all required fields");
      return;
    }
    if (!newProduct.imageFile) {
      setError("Product image is required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", String(newProduct.price));
      formData.append("genderType", newProduct.genderType);
      formData.append("season", newProduct.season);
      formData.append("isActive", String(newProduct.isActive));
      formData.append("image", newProduct.imageFile);

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewProduct({
        name: "",
        description: "",
        price: "",
        genderType: "male",
        season: "summer",
        isActive: true,
        imageFile: null,
      });
      setNewProductPreviewUrl("");
      setSuccess("Product created successfully");
      setActivePage("All Products");
      await fetchProducts();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setEditPreviewUrl("");
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      genderType: product.genderType || "male",
      season: product.season || "summer",
      isActive: product.isActive ?? true,
      imageFile: null,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct?._id) return;
    setSuccess("");
    setError("");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", String(editForm.price));
      formData.append("genderType", editForm.genderType);
      formData.append("season", editForm.season);
      formData.append("isActive", String(editForm.isActive));
      if (editForm.imageFile) formData.append("image", editForm.imageFile);

      const response = await api.put(`/products/${editProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = response?.data?.data;
      setProducts((prev) =>
        prev.map((p) => (p._id === updated?._id ? updated : p))
      );
      setSuccess("Product updated successfully");
      setEditProduct(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProductStatus = async (productId) => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const response = await api.patch(`/products/${productId}/status`);
      const updated = response?.data?.data;
      setProducts((prev) =>
        prev.map((p) => (p._id === updated?._id ? updated : p))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setSuccess("Product deleted");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      const updated = response?.data?.data;
      setOrders((prev) =>
        prev.map((o) => (o._id === updated?._id ? updated : o))
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const currentId = user?._id || user?.id;
    if (String(userId) === String(currentId)) {
      setSuccess("");
      setError("You can't delete your own account");
      return;
    }
    const ok = window.confirm("Delete this user?");
    if (!ok) return;
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setSuccess("User deleted");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
      <Navigation />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-neon/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex w-full max-w-screen-2xl flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
          <aside className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl md:w-72 md:self-stretch">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wide">Admin</span>
                <span className="text-xs text-white/60">NOMAD Dashboard</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                <BadgeCheck className="h-4 w-4 text-neon" />
                <span className="text-xs font-semibold">ADMIN</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <img
                  src={user.image ? toAbsoluteUrl(user.image) : "/vite.svg"}
                  alt="profile"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {user.firstName || user.email}
                  </span>
                  <span className="text-xs text-white/60">{user.email}</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {pages.map((p) => {
                  const Icon = p.icon;
                  const active = p.key === activePage;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => {
                        setSuccess("");
                        setError("");
                        setActivePage(p.key);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-white/80" />
                      <span className="text-sm font-semibold tracking-wide">
                        {p.key.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{activePage}</h1>
              <p className="text-sm text-white/60">
                {activePage === "Add Product"
                  ? "Create new products for the store."
                  : activePage === "All Products"
                    ? "Manage products, status, updates and deletions."
                    : activePage === "Users"
                      ? "View all users and their details."
                      : "View and update customer orders."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="inline-flex items-center gap-2 text-sm text-white/70">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading
                </div>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <div className="mt-6">
            {activePage === "Add Product" ? (
              <form
                onSubmit={handleCreateProduct}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                  <label className="text-sm font-semibold text-white/80">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct((p) => ({
                        ...p,
                        imageFile: e.target.files?.[0] || null,
                      }))
                    }
                    className="mt-2 w-full text-xs text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                  />
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    {newProductPreviewUrl ? (
                      <img
                        src={newProductPreviewUrl}
                        alt="preview"
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center text-sm text-white/50">
                        No image selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="text-sm font-semibold text-white/80">Name</label>
                  <input
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                    placeholder="Product name"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="text-sm font-semibold text-white/80">Price</label>
                  <input
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, price: e.target.value }))
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                    placeholder="0.00"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                  <label className="text-sm font-semibold text-white/80">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, description: e.target.value }))
                    }
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                    placeholder="Product description"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="text-sm font-semibold text-white/80">
                    Gender Type
                  </label>
                  <select
                    value={newProduct.genderType}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, genderType: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                  >
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="text-sm font-semibold text-white/80">Season</label>
                  <select
                    value={newProduct.season}
                    onChange={(e) =>
                      setNewProduct((p) => ({ ...p, season: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/20"
                  >
                    <option value="summer">summer</option>
                    <option value="winter">winter</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                    <input
                      type="checkbox"
                      checked={Boolean(newProduct.isActive)}
                      onChange={(e) =>
                        setNewProduct((p) => ({ ...p, isActive: e.target.checked }))
                      }
                      className="h-4 w-4"
                    />
                    Active
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-neon px-4 py-3 text-sm font-bold text-black hover:brightness-95 disabled:opacity-60"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            ) : null}

            {activePage === "All Products" ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.6fr_1fr] gap-3 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold text-white/70">
                  <div>PRODUCT</div>
                  <div>TYPE</div>
                  <div>SEASON</div>
                  <div>STATUS</div>
                  <div className="text-right">ACTIONS</div>
                </div>
                <div className="divide-y divide-white/10 bg-black/20">
                  {products.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-white/60">
                      No products found
                    </div>
                  ) : (
                    products.map((p) => (
                      <div
                        key={p._id}
                        className="grid grid-cols-[1.6fr_0.8fr_0.7fr_0.6fr_1fr] gap-3 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={toAbsoluteUrl(p.image)}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{p.name}</span>
                            <span className="text-xs text-white/60">
                              {formatMoney(p.price)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-white/80">
                          {p.genderType}
                        </div>
                        <div className="flex items-center text-sm text-white/80">
                          {p.season}
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                              p.isActive
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.isActive ? "bg-emerald-300" : "bg-yellow-300"
                              }`}
                            />
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(p)}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(p._id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
                          >
                            <Power className="h-4 w-4" />
                            Toggle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/15"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}

            {activePage === "Orders" ? (
              <div className="grid grid-cols-1 gap-4">
                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-white/60">
                    No orders found
                  </div>
                ) : (
                  orders.map((o) => (
                    <div
                      key={o._id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      {(() => {
                        const u = orderUsersById[String(o.userId)];
                        const name = `${u?.firstName || ""} ${u?.lastName || ""}`.trim();
                        const userLabel = name || u?.email || String(o.userId || "").slice(-8);
                        return (
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            Order #{String(o._id).slice(-8)}
                          </span>
                          <span className="text-xs text-white/60">
                            User: {userLabel} • Items: {o.productsOrdered?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">
                            {formatMoney(o.totalPrice)}
                          </span>
                          <select
                            value={o.status || "Pending"}
                            onChange={(e) =>
                              setOrders((prev) =>
                                prev.map((x) =>
                                  x._id === o._id ? { ...x, status: e.target.value } : x
                                )
                              )
                            }
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                          >
                            {orderStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(o._id, o.status || "Pending")}
                            className="inline-flex items-center gap-2 rounded-xl bg-neon px-3 py-2 text-sm font-bold text-black hover:brightness-95"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                        </div>
                      </div>
                        );
                      })()}

                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead className="text-xs text-white/60">
                            <tr>
                              <th className="py-2 pr-3 font-semibold">Product</th>
                              <th className="py-2 pr-3 font-semibold">Qty</th>
                              <th className="py-2 pr-3 font-semibold">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/80">
                            {(o.productsOrdered || []).map((it, idx) => (
                              <tr key={`${o._id}-${idx}`} className="border-t border-white/10">
                                <td className="py-2 pr-3">
                                  {orderProductsById[String(it.productId)]?.name ||
                                    String(it.productId || "").slice(-8)}
                                </td>
                                <td className="py-2 pr-3">{it.quantity}</td>
                                <td className="py-2 pr-3">{formatMoney(it.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}

            {activePage === "Users" ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-semibold text-white/70">TOTAL USERS</div>
                    <div className="text-sm font-bold text-white">{users.length}</div>
                    {userSearch ? (
                      <div className="text-xs text-white/60">
                        Showing {filteredUsers.length}
                      </div>
                    ) : null}
                  </div>
                  <input
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-56 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20"
                  />
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-white/60">
                    {users.length === 0 ? "No users found" : "No matching users"}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-xs text-white/60">
                        <tr className="border-b border-white/10">
                          <th className="py-3 pl-4 pr-3 font-semibold">User</th>
                          <th className="py-3 pr-3 font-semibold">Email</th>
                          <th className="py-3 pr-3 font-semibold">Mobile</th>
                          <th className="py-3 pr-3 font-semibold">Role</th>
                          <th className="py-3 pr-4 font-semibold">Joined</th>
                          <th className="py-3 pr-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        {filteredUsers.map((u) => {
                          const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
                          const joined = u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-";
                          const disableDelete =
                            String(u._id) === String(user?._id || user?.id);
                          return (
                            <tr key={u._id} className="border-t border-white/10">
                              <td className="py-3 pl-4 pr-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={u.image ? toAbsoluteUrl(u.image) : "/vite.svg"}
                                    alt={name || u.email}
                                    className="h-10 w-10 rounded-xl object-cover"
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-white">
                                      {name || u.email}
                                    </span>
                                    <span className="text-xs text-white/60">
                                      {String(u._id).slice(-8)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-3">{u.email}</td>
                              <td className="py-3 pr-3">{u.mobileNo || "-"}</td>
                              <td className="py-3 pr-3">
                                <span
                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                    u.isAdmin
                                      ? "border-neon/40 bg-neon/10 text-neon"
                                      : "border-white/15 bg-white/5 text-white/80"
                                  }`}
                                >
                                  {u.isAdmin ? "Admin" : "User"}
                                </span>
                              </td>
                              <td className="py-3 pr-4">{joined}</td>
                              <td className="py-3 pr-4 text-right">
                                <button
                                  type="button"
                                  disabled={loading || disableDelete}
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                                  title={disableDelete ? "Can't delete yourself" : "Delete user"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          </main>
        </div>

      {editProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setEditProduct(null)}
          />
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-neutral-950 p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold">Edit Product</span>
                <span className="text-xs text-white/60">{editProduct.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateProduct}
              className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <label className="text-sm font-semibold text-white/80">
                  Replace Image (optional)
                </label>
                <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <img
                    src={
                      editPreviewUrl
                        ? editPreviewUrl
                        : editProduct?.image
                          ? toAbsoluteUrl(editProduct.image)
                          : "/vite.svg"
                    }
                    alt="preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      imageFile: e.target.files?.[0] || null,
                    }))
                  }
                  className="mt-2 w-full text-xs text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-sm font-semibold text-white/80">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-sm font-semibold text-white/80">Price</label>
                <input
                  value={editForm.price}
                  onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <label className="text-sm font-semibold text-white/80">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-sm font-semibold text-white/80">Gender</label>
                <select
                  value={editForm.genderType}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, genderType: e.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-sm font-semibold text-white/80">Season</label>
                <select
                  value={editForm.season}
                  onChange={(e) => setEditForm((p) => ({ ...p, season: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none"
                >
                  <option value="summer">summer</option>
                  <option value="winter">winter</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.isActive)}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, isActive: e.target.checked }))
                    }
                    className="h-4 w-4"
                  />
                  Active
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-neon px-4 py-3 text-sm font-bold text-black hover:brightness-95 disabled:opacity-60"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      </div>

      <Footer />
    </div>
  );
}

export default AdminProduct;

