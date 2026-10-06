"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ImagePlus, LogOut, PackagePlus, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { collectionList, type Product } from "@/data/storefront";
import { formatMoney } from "@/lib/products";

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  category: string;
  collection: string;
  colors: string;
  sizes: string;
  stock: string;
  sku: string;
  material: string;
  care: string;
  fit: string;
  featured: boolean;
  newArrival: boolean;
  sale: boolean;
  rating: string;
  reviewCount: string;
  tags: string;
};

const emptyDraft: ProductDraft = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "",
  collection: collectionList[0].slug,
  colors: "",
  sizes: "",
  stock: "0",
  sku: "",
  material: "",
  care: "",
  fit: "",
  featured: false,
  newArrival: true,
  sale: false,
  rating: "5",
  reviewCount: "0",
  tags: "",
};

const inputClass = "mt-2 min-h-11 w-full border border-[#080808]/15 bg-white px-3 py-2 text-sm text-[#080808] outline-none transition focus:border-[#080808]";
const labelClass = "block text-[10px] uppercase tracking-[0.2em] text-[#68645e]";

function splitValues(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(emptyDraft);
  const [images, setImages] = useState<File[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/admin/auth", { cache: "no-store" })
      .then(async (response) => (response.ok ? (await response.json()) as { authorized: boolean } : { authorized: false }))
      .then(async (session) => {
        if (cancelled) return;
        setAuthorized(session.authorized);
        setCheckingSession(false);
        if (session.authorized) {
          const response = await fetch("/api/products", { cache: "no-store" });
          if (response.ok && !cancelled) {
            const data = (await response.json()) as { products: Product[] };
            setProducts(data.products);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateDraft = <Key extends keyof ProductDraft>(key: Key, value: ProductDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const resetEditor = () => {
    setEditingProductId(null);
    setDraft(emptyDraft);
    setImages([]);
    setFormKey((current) => current + 1);
    setError("");
    setMessage("");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setDraft({
      name: product.name,
      description: product.description,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice === undefined ? "" : String(product.compareAtPrice),
      category: product.category,
      collection: product.collection,
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      stock: String(product.stock),
      sku: product.sku,
      material: product.material,
      care: product.care,
      fit: product.fit,
      featured: product.featured,
      newArrival: product.newArrival,
      sale: product.sale,
      rating: String(product.rating),
      reviewCount: String(product.reviewCount),
      tags: product.tags.join(", "),
    });
    setImages([]);
    setError("");
    setMessage("");
    setFormKey((current) => current + 1);
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Product could not be deleted.");

      setProducts((current) => current.filter((item) => item.id !== product.id));
      if (editingProductId === product.id) resetEditor();
      setMessage(`${product.name} was deleted from the catalog.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be deleted.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { authorized?: boolean; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Could not sign in.");
      setAuthorized(true);
      setPassword("");
      const catalogResponse = await fetch("/api/products", { cache: "no-store" });
      if (catalogResponse.ok) {
        const data = (await catalogResponse.json()) as { products: Product[] };
        setProducts(data.products);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthorized(false);
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const payload = {
      ...draft,
      price: Number(draft.price),
      compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : undefined,
      colors: splitValues(draft.colors),
      sizes: splitValues(draft.sizes),
      stock: Number(draft.stock),
      rating: Number(draft.rating),
      reviewCount: Number(draft.reviewCount),
      tags: splitValues(draft.tags),
    };
    if (editingProductId) Object.assign(payload, { id: editingProductId });
    const formData = new FormData();
    formData.append("product", JSON.stringify(payload));
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch("/api/admin/products", { method: editingProductId ? "PATCH" : "POST", body: formData });
      const result = (await response.json()) as { product?: Product; error?: string };
      if (!response.ok || !result.product) throw new Error(result.error ?? "Product could not be saved.");

      const savedProduct = result.product;
      if (editingProductId) {
        setProducts((current) => current.map((product) => product.id === savedProduct.id ? savedProduct : product));
      } else {
        setProducts((current) => [...current, savedProduct]);
      }
      setEditingProductId(null);
      setDraft(emptyDraft);
      setImages([]);
      setFormKey((current) => current + 1);
      setMessage(editingProductId ? `${savedProduct.name} was updated.` : `${savedProduct.name} is now in ${savedProduct.collection.replaceAll("-", " ")}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Product could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  if (checkingSession) {
    return <main className="grid min-h-[70vh] place-items-center bg-[#f4f2ed] text-sm text-[#68645e]">Checking admin session...</main>;
  }

  if (!authorized) {
    return (
      <main className="min-h-[calc(100vh-2rem)] bg-[#f4f2ed] px-4 py-10 text-[#080808] sm:px-8 sm:py-16">
        <div className="mx-auto grid min-h-[min(42rem,calc(100vh-8rem))] max-w-5xl border border-[#080808]/15 bg-white md:grid-cols-[1fr_0.9fr]">
          <section className="flex flex-col justify-between bg-[#171714] p-7 text-[#f4f2ed] sm:p-10">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#d2cec4]">Tees Affairs / Commerce</div>
            <div className="py-12 md:py-0">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b5b0a5]">Admin access</p>
              <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">PRODUCT<br />STUDIO</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-[#d2cec4]">Manage product stories, collection placement, and the live catalog.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#b5b0a5]"><ShieldCheck size={14} /> Restricted workspace</div>
          </section>

          <section className="flex items-center p-6 sm:p-10">
            <form onSubmit={handleLogin} className="w-full max-w-sm">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#77736d]">Sign in</p>
              <h2 className="mt-3 font-display text-4xl">Welcome back.</h2>
              <label className={`${labelClass} mt-8`} htmlFor="admin-username">Username</label>
              <input id="admin-username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className={inputClass} />
              <label className={`${labelClass} mt-5`} htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
              {error ? <p role="alert" className="mt-4 text-sm text-[#9b352c]">{error}</p> : null}
              <button type="submit" disabled={busy} className="mt-7 flex min-h-12 w-full items-center justify-between bg-[#080808] px-4 text-[10px] uppercase tracking-[0.24em] text-[#f4f2ed] transition hover:bg-[#343430] disabled:opacity-60">
                {busy ? "Signing in..." : "Enter dashboard"}
                <ArrowUpRight size={16} />
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ed] px-4 py-6 text-[#080808] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#080808]/15 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#77736d]">Tees Affairs / Admin</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Product studio</h1>
          </div>
          <button type="button" onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 border border-[#080808]/20 px-3 text-[10px] uppercase tracking-[0.18em] transition hover:bg-[#080808] hover:text-[#f4f2ed]"><LogOut size={14} /> Sign out</button>
        </header>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="border border-[#080808]/10 bg-white p-4"><p className="text-[9px] uppercase tracking-[0.22em] text-[#77736d]">Catalog products</p><p className="mt-2 font-display text-3xl">{products.length}</p></div>
          <div className="border border-[#080808]/10 bg-white p-4"><p className="text-[9px] uppercase tracking-[0.22em] text-[#77736d]">Collections</p><p className="mt-2 font-display text-3xl">{collectionList.length}</p></div>
          <div className="flex items-center gap-3 border border-[#080808]/10 bg-white p-4"><span className="grid h-10 w-10 place-items-center bg-[#e8e5dc]"><Check size={17} /></span><div><p className="text-[9px] uppercase tracking-[0.22em] text-[#77736d]">Session</p><p className="mt-1 text-sm">Secure and active</p></div></div>
        </div>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.8fr)]">
          <section className="border border-[#080808]/10 bg-white">
            <div className="flex items-center gap-3 border-b border-[#080808]/10 px-5 py-4 sm:px-7"><span className="grid h-9 w-9 place-items-center bg-[#171714] text-white"><PackagePlus size={17} /></span><div><p className="text-[9px] uppercase tracking-[0.24em] text-[#77736d]">Catalog entry</p><h2 className="mt-1 font-display text-2xl">{editingProductId ? "Edit product" : "Add a product"}</h2></div></div>
            <form id="product-editor" key={formKey} onSubmit={handleSaveProduct} className="space-y-7 p-5 sm:p-7">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#68645e]">Product identity</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={`${labelClass} sm:col-span-2`}>Product name<input required maxLength={120} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} className={inputClass} placeholder="TEES AFFAIRS STRUCTURE TEE" /></label>
                  <label className={labelClass}>Category<input required value={draft.category} onChange={(event) => updateDraft("category", event.target.value)} className={inputClass} placeholder="T-Shirts" /></label>
                  <label className={labelClass}>Collection<select value={draft.collection} onChange={(event) => updateDraft("collection", event.target.value)} className={inputClass}>{collectionList.map((collection) => <option key={collection.slug} value={collection.slug}>{collection.title}</option>)}</select></label>
                  <label className={`${labelClass} sm:col-span-2`}>Description<textarea required minLength={10} maxLength={2000} rows={3} value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} className={`${inputClass} resize-y`} placeholder="Describe the piece, its construction, and how it wears." /></label>
                </div>
              </section>

              <section className="border-t border-[#080808]/10 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#68645e]">Pricing and inventory</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className={labelClass}>Price<input required type="number" min="0.01" step="0.01" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} className={inputClass} placeholder="65" /></label>
                  <label className={labelClass}>Compare at<input type="number" min="0.01" step="0.01" value={draft.compareAtPrice} onChange={(event) => updateDraft("compareAtPrice", event.target.value)} className={inputClass} placeholder="85" /></label>
                  <label className={labelClass}>Stock<input required type="number" min="0" step="1" value={draft.stock} onChange={(event) => updateDraft("stock", event.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>SKU<input value={draft.sku} onChange={(event) => updateDraft("sku", event.target.value)} className={inputClass} placeholder="Auto-generated" /></label>
                </div>
              </section>

              <section className="border-t border-[#080808]/10 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#68645e]">Variants and images</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Colors <span className="normal-case tracking-normal text-[#888]">comma-separated</span><input required value={draft.colors} onChange={(event) => updateDraft("colors", event.target.value)} className={inputClass} placeholder="Black, Stone, Sand" /></label>
                  <label className={labelClass}>Sizes <span className="normal-case tracking-normal text-[#888]">comma-separated</span><input required value={draft.sizes} onChange={(event) => updateDraft("sizes", event.target.value)} className={inputClass} placeholder="XS, S, M, L, XL" /></label>
                  <div className="sm:col-span-2">
                    <label className="block cursor-pointer border border-dashed border-[#080808]/25 bg-[#faf9f6] p-5 transition hover:border-[#080808]">
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(event) => { const selected = Array.from(event.currentTarget.files ?? []); setImages(selected.slice(0, 5)); setError(selected.length > 5 ? "Choose no more than five images." : ""); }} />
                      <span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-white"><ImagePlus size={18} /></span><span><span className="block text-[10px] uppercase tracking-[0.18em]">{editingProductId ? "Replace product images" : "Upload product images"}</span><span className="mt-1 block text-xs text-[#77736d]">{editingProductId ? "Leave empty to keep the current images." : "JPEG, PNG, WebP or AVIF."} Up to 5 images, 5 MB each.</span></span></span>
                    </label>
                    {editingProductId ? <div className="mt-3 flex flex-wrap gap-2">{products.find((product) => product.id === editingProductId)?.images.map((image) => <img key={image} src={image} alt="Current product" className="h-20 w-16 border border-[#080808]/10 object-cover" />)}</div> : null}
                    {images.length ? <ul className="mt-3 grid gap-2 text-xs text-[#5f5f5f] sm:grid-cols-2">{images.map((image) => <li key={`${image.name}-${image.lastModified}`} className="truncate border border-[#080808]/10 bg-white px-3 py-2">{image.name}</li>)}</ul> : null}
                  </div>
                </div>
              </section>

              <section className="border-t border-[#080808]/10 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#68645e]">Construction and care</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Material<input required value={draft.material} onChange={(event) => updateDraft("material", event.target.value)} className={inputClass} placeholder="100% cotton heavyweight jersey" /></label>
                  <label className={labelClass}>Fit<input required value={draft.fit} onChange={(event) => updateDraft("fit", event.target.value)} className={inputClass} placeholder="Regular fit with a structured shoulder" /></label>
                  <label className={`${labelClass} sm:col-span-2`}>Care instructions<textarea required rows={2} value={draft.care} onChange={(event) => updateDraft("care", event.target.value)} className={`${inputClass} resize-y`} placeholder="Machine wash cold. Hang dry." /></label>
                  <label className={`${labelClass} sm:col-span-2`}>Tags <span className="normal-case tracking-normal text-[#888]">comma-separated</span><input value={draft.tags} onChange={(event) => updateDraft("tags", event.target.value)} className={inputClass} placeholder="boxy, streetwear, premium" /></label>
                </div>
              </section>

              <section className="border-t border-[#080808]/10 pt-6">
                <h3 className="text-[10px] uppercase tracking-[0.24em] text-[#68645e]">Merchandising</h3>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {([["featured", "Featured"], ["newArrival", "New arrival"], ["sale", "On sale"]] as const).map(([key, label]) => <label key={key} className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={draft[key]} onChange={(event) => updateDraft(key, event.target.checked)} className="h-4 w-4 accent-[#080808]" />{label}</label>)}
                </div>
                <div className="mt-4 grid max-w-sm gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Rating<input type="number" min="0" max="5" step="0.1" value={draft.rating} onChange={(event) => updateDraft("rating", event.target.value)} className={inputClass} /></label>
                  <label className={labelClass}>Reviews<input type="number" min="0" step="1" value={draft.reviewCount} onChange={(event) => updateDraft("reviewCount", event.target.value)} className={inputClass} /></label>
                </div>
              </section>

              {error ? <p role="alert" className="border border-[#9b352c]/20 bg-[#fff8f6] px-3 py-2 text-sm text-[#9b352c]">{error}</p> : null}
              {message ? <p role="status" className="border border-[#52644c]/20 bg-[#f4f7f1] px-3 py-2 text-sm text-[#43533d]">{message}</p> : null}
              <div className="flex flex-col gap-3 border-t border-[#080808]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#77736d]">{editingProductId ? "The existing product ID and URL slug stay unchanged." : "The product ID and URL slug are generated when published."}</p>
                <div className="flex gap-2">
                  {editingProductId ? <button type="button" onClick={resetEditor} className="min-h-12 border border-[#080808]/20 px-4 text-[10px] uppercase tracking-[0.18em] transition hover:border-[#080808]">Cancel</button> : null}
                  <button type="submit" disabled={busy || (!editingProductId && images.length === 0)} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#080808] px-5 text-[10px] uppercase tracking-[0.22em] text-[#f4f2ed] transition hover:bg-[#343430] disabled:cursor-not-allowed disabled:opacity-50"><PackagePlus size={15} />{busy ? "Saving..." : editingProductId ? "Save changes" : "Publish product"}</button>
                </div>
              </div>
            </form>
          </section>

          <aside className="border border-[#080808]/10 bg-white">
            <div className="border-b border-[#080808]/10 px-5 py-4"><p className="text-[9px] uppercase tracking-[0.24em] text-[#77736d]">Live catalog</p><h2 className="mt-1 font-display text-2xl">Recently added</h2></div>
            <div className="divide-y divide-[#080808]/10">
              {products.slice(-6).reverse().map((product) => <article key={product.id} className="flex items-start justify-between gap-3 px-5 py-4"><div className="min-w-0">
                <p className="truncate text-xs font-medium">{product.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#77736d]">{product.collection.replaceAll("-", " ")}</p>
                <div className="mt-2 flex flex-col items-start gap-x-3 gap-y-1">
                    <Link href={`/products/${product.slug}`} 
                target="_blank" className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.14em] underline underline-offset-4">View product 
                <ArrowUpRight size={11} />
                </Link>
             <div className="flex items-center gap-2    ">
                   <button type="button" 
                onClick={() => handleEditProduct(product)} 
                aria-label={`Edit ${product.name}`}
                 className="inline-flex min-h-8 items-center gap-1 text-[4px] 
                uppercase tracking-[0.14em] text-[#4e4a44] transition 
                hover:text-[#080808]"><Pencil size={12} /> <p className="text-[9px] font-bold">Edit product</p></button>
                <button type="button" 
                onClick={() => void handleDeleteProduct(product)} aria-label={`Delete ${product.name}`} title="Delete product" disabled={busy} 
                className="inline-flex h-8 w-8 items-center justify-center border border-[#9b352c]/20 text-[#9b352c] transition hover:bg-[#9b352c] hover:text-white disabled:opacity-50">
                    <Trash2 size={14} />
                    </button>
             </div>
                    </div>
                    </div>
                    <span className="shrink-0 text-xs">{formatMoney(product.price)}</span></article>)}
            </div>
            <div className="border-t border-[#080808]/10 px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-[#77736d]">Changes are available across the storefront.</div>
          </aside>
        </div>
      </div>
    </main>
  );
}
