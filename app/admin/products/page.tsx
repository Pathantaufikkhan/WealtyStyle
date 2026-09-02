"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
} from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product, CategorySlug } from "@/types";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStoreData();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    brand: "GLAMSTEP Haute Eyewear",
    category: "sunglasses" as CategorySlug,
    price: 4999,
    originalPrice: 7999,
    stockCount: 20,
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
    description: "",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    const discountPercentage = Math.round(
      ((formData.originalPrice - formData.price) / formData.originalPrice) * 100
    );

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: formData.name,
      tagline: formData.tagline || "Handcrafted Luxury",
      brand: formData.brand,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discountPercentage: Math.max(0, discountPercentage),
      rating: 5.0,
      reviewsCount: 1,
      images: [formData.imageUrl],
      description: formData.description,
      shortDescription: formData.description.substring(0, 100),
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      inStock: formData.stockCount > 0,
      stockCount: Number(formData.stockCount),
      tags: [formData.category, "Luxury", "Handcrafted"],
      variants: [
        {
          id: `v-${Date.now()}`,
          name: "Standard Edition",
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          price: Number(formData.price),
          stock: Number(formData.stockCount),
        },
      ],
      specifications: [
        { label: "Origin", value: "Artisanal Atelier" },
        { label: "Warranty", value: "2-Year Guarantee" },
      ],
      materials: ["Premium Alloy", "Italian Craft"],
      careInstructions: ["Keep in protective hardshell case."],
      warranty: "2-Year International Warranty",
      createdAt: new Date().toISOString(),
      attributes: {},
    };

    addProduct(newProd);
    toast.success(`Published new creation "${newProd.name}" to catalog!`);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      tagline: "",
      brand: "GLAMSTEP Haute Eyewear",
      category: "sunglasses",
      price: 4999,
      originalPrice: 7999,
      stockCount: 20,
      imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
      description: "",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Catalog Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Products Directory ({products.length})
          </h1>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or brand..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-400 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white font-medium focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Categories</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="shoes">Footwear</option>
            <option value="watches">Watches</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-zinc-950 border border-zinc-800 flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{product.name}</h4>
                        <span className="text-[10px] text-zinc-400">{product.brand}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 uppercase font-bold text-[10px] text-gold-400">
                    {product.category}
                  </td>

                  <td className="p-4">
                    <strong className="text-white block">{formatPrice(product.price)}</strong>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-zinc-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => {
                        updateProduct(product.id, { inStock: !product.inStock });
                        toast.success(`Updated stock status for ${product.name}`);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        product.inStock
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {product.inStock ? `In Stock (${product.stockCount})` : "Out of Stock"}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isFeatured && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-gold-400 border border-zinc-700">
                          Featured
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold-500 text-zinc-950 font-bold">
                          Bestseller
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 rounded bg-zinc-800 hover:bg-gold-500 hover:text-zinc-950 text-zinc-300 transition-colors"
                        title="Preview on Storefront"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            deleteProduct(product.id);
                            toast.info(`Deleted ${product.name}`);
                          }
                        }}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                Add New Luxury Product
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Monaco Tourbillon Gold"
                required
              />

              <Input
                label="Tagline / Short Hook"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Crafted with 24k gold electroplate"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as CategorySlug,
                      })
                    }
                    className="w-full h-11 px-3 rounded-sm border border-zinc-800 bg-zinc-950 text-white text-xs"
                  >
                    <option value="sunglasses">Sunglasses</option>
                    <option value="shoes">Shoes</option>
                    <option value="watches">Watches</option>
                  </select>
                </div>

                <Input
                  label="Brand Name"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Selling Price (₹)"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  label="Original MRP (₹)"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPrice: Number(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  label="Stock Units"
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockCount: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <Input
                label="Product Image URL (High-Res)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                required
              />

              <Textarea
                label="Full Editorial Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Detailed craft description, materials, and origin..."
                required
              />

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1">
                  Publish to Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
