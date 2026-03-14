import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import UserNav from "../components/UserNav.jsx";
import { api, toAbsoluteUrl } from "../lib/api.js";
import { useAuth } from "../context/useAuth.js";

function formatMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? `Rs${num.toFixed(2)}` : "Rs0.00";
}

function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    imageFile: null,
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");
  const [productsById, setProductsById] = useState({});

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  useEffect(() => {
    if (!profileForm.imageFile) {
      setImagePreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(profileForm.imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileForm.imageFile]);

  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/users/${user._id}`);
      const data = response?.data?.data;
      if (data) {
        setUser(data);
        setProfileForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          mobileNo: data.mobileNo || "",
          imageFile: null,
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [setUser, user?._id]);

  const fetchOrders = useCallback(async () => {
    if (!user?._id || user.isAdmin) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await api.get("/orders/my");
      const nextOrders = response?.data?.data || [];
      setOrders(nextOrders);

      const ids = Array.from(
        new Set(
          nextOrders
            .flatMap((o) => (Array.isArray(o?.productsOrdered) ? o.productsOrdered : []))
            .map((it) => String(it?.productId || ""))
            .filter(Boolean)
        )
      );

      const missing = ids.filter((id) => !productsById[id]);
      if (missing.length > 0) {
        const fetched = await Promise.all(
          missing.map((id) =>
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
        setProductsById((prev) => ({ ...prev, ...mapped }));
      }
    } catch (err) {
      setOrdersError(err?.response?.data?.message || err?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  }, [productsById, user?._id, user?.isAdmin]);

  useEffect(() => {
    if (!user?._id) return;
    fetchProfile();
    fetchOrders();
  }, [fetchOrders, fetchProfile, user?._id]);

  const profileImageSrc = useMemo(() => {
    if (imagePreviewUrl) return imagePreviewUrl;
    if (user?.image) return toAbsoluteUrl(user.image);
    return "/vite.svg";
  }, [imagePreviewUrl, user?.image]);

  const orderItemsLabel = useCallback(
    (order) => {
      const items = Array.isArray(order?.productsOrdered) ? order.productsOrdered : [];
      if (items.length === 0) return "-";
      const parts = items.slice(0, 2).map((it) => {
        const p = productsById[String(it.productId)];
        const name = p?.name || `#${String(it.productId || "").slice(-6)}`;
        const qty = Number(it.quantity || 0);
        return `${name} x${qty || 1}`;
      });
      const more = items.length - parts.length;
      return more > 0 ? `${parts.join(", ")} +${more} more` : parts.join(", ");
    },
    [productsById]
  );

  const handleDeleteOrder = async (orderId) => {
    const ok = window.confirm("Delete this order?");
    if (!ok) return;
    setDeletingOrderId(orderId);
    setOrdersError("");
    setError("");
    setSuccess("");
    try {
      await api.delete(`/orders/my/${orderId}`);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      setSuccess("Order deleted");
    } catch (err) {
      setOrdersError(
        err?.response?.data?.message || err?.message || "Failed to delete order"
      );
    } finally {
      setDeletingOrderId("");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("firstName", profileForm.firstName);
      formData.append("lastName", profileForm.lastName);
      formData.append("email", profileForm.email);
      formData.append("mobileNo", profileForm.mobileNo);
      if (profileForm.imageFile) formData.append("image", profileForm.imageFile);

      const response = await api.put(`/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = response?.data?.data;
      if (updated) setUser(updated);
      setProfileForm((p) => ({ ...p, imageFile: null }));
      setImagePreviewUrl("");
      setSuccess("Profile updated");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    if (String(newPassword).length < 8) {
      setError("Password must be at least 8 characters");
      setSuccess("");
      return;
    }
    setPasswordSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/users/update/${user._id}`, { password: newPassword });
      setNewPassword("");
      setSuccess("Password updated");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <UserNav />
      <div className="min-h-screen bg-neutral-950 text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="mt-1 text-sm text-white/60">
                Manage your account details and password.
              </p>
            </div>
            {loading ? (
              <div className="inline-flex items-center gap-2 text-sm text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <img
                  src={profileImageSrc}
                  alt="profile"
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">
                    {user.firstName || user.email}
                  </span>
                  <span className="text-sm text-white/60">
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-white/80">First Name</label>
                  <input
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white/80">Last Name</label>
                  <input
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-white/80">Email</label>
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-white/80">Mobile No</label>
                  <input
                    value={profileForm.mobileNo}
                    onChange={(e) => setProfileForm((p) => ({ ...p, mobileNo: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-white/80">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        imageFile: e.target.files?.[0] || null,
                      }))
                    }
                    className="mt-2 w-full text-xs text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 text-sm font-bold text-black hover:brightness-95 disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="text-lg font-semibold">Update Password</h2>
                <form onSubmit={handleUpdatePassword} className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="New password (min 8 chars)"
                    className="w-full flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-white/20"
                  />
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                  >
                    {passwordSaving ? "Updating..." : "Update"}
                  </button>
                </form>
              </div>
            </div>

            {!user.isAdmin ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Order History</h2>
                  {ordersLoading ? (
                    <div className="inline-flex items-center gap-2 text-sm text-white/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading
                    </div>
                  ) : null}
                </div>

                {ordersError ? (
                  <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {ordersError}
                  </div>
                ) : null}

                {!ordersLoading && !ordersError ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                    <div className="grid grid-cols-[0.9fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-3 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold text-white/70">
                      <div>ORDER</div>
                      <div>ITEMS</div>
                      <div>STATUS</div>
                      <div className="text-right">TOTAL</div>
                      <div className="text-right">ACTIONS</div>
                    </div>
                    <div className="divide-y divide-white/10 bg-black/20">
                      {orders.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-white/60">
                          No orders yet
                        </div>
                      ) : (
                        orders.map((o) => (
                          <div
                            key={o._id}
                            className="grid grid-cols-[0.9fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-3 px-4 py-3"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold">
                                #{String(o._id).slice(-8)}
                              </span>
                              <span className="text-xs text-white/60">
                                {o.orderedOn
                                  ? new Date(o.orderedOn).toLocaleDateString()
                                  : o.createdAt
                                    ? new Date(o.createdAt).toLocaleDateString()
                                    : ""}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-white/80">
                              <span className="line-clamp-2">{orderItemsLabel(o)}</span>
                            </div>
                            <div className="flex items-center text-sm text-white/80">
                              {o.status || "Pending"}
                            </div>
                            <div className="flex items-center justify-end text-sm font-semibold">
                              {formatMoney(o.totalPrice)}
                            </div>
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                disabled={
                                  deletingOrderId === o._id ||
                                  String(o.status || "").toLowerCase() === "delivered"
                                }
                                onClick={() => handleDeleteOrder(o._id)}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/15 disabled:opacity-60"
                              >
                                {deletingOrderId === o._id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold">Order History</h2>
                <p className="mt-3 text-sm text-white/60">Admins don’t have order history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
