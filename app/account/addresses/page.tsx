"use client";

import React, { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShippingAddress } from "@/types";
import { toast } from "sonner";

export default function AccountAddressesPage() {
  const { user, addAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.houseFlat || !form.street || !form.city || !form.pincode) {
      toast.error("Please fill in required address fields");
      return;
    }

    addAddress(form);
    toast.success("Saved new shipping address to your profile!");
    setIsModalOpen(false);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      houseFlat: "",
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      isDefault: false,
    });
  };

  const addresses = user?.savedAddresses || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold-500">
            Address Book
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mt-0.5">
            Saved Destinations
          </h2>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl bg-card border transition-all flex flex-col justify-between ${
                addr.isDefault
                  ? "border-gold-500 shadow-sm ring-1 ring-gold-500/30"
                  : "border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {addr.fullName}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-600 dark:text-gold-400">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  {addr.houseFlat}, {addr.street}<br />
                  {addr.area}, {addr.city}, {addr.state} - {addr.pincode}<br />
                  {addr.phone && `Phone: ${addr.phone}`}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                {!addr.isDefault ? (
                  <button
                    onClick={() => {
                      setDefaultAddress(idx);
                      toast.success("Set as default delivery address");
                    }}
                    className="text-gold-500 font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Default Shipping
                  </span>
                )}

                <button
                  onClick={() => {
                    deleteAddress(idx);
                    toast.info("Deleted address");
                  }}
                  className="text-zinc-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500">
          No addresses saved yet. Click &quot;Add New Address&quot; above.
        </div>
      )}

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Add Shipping Address
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <Input
                label="Recipient Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Contact Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
                <Input
                  label="6-Digit PIN Code"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Flat / House / Suite"
                value={form.houseFlat}
                onChange={(e) => setForm({ ...form, houseFlat: e.target.value })}
                required
              />

              <Input
                label="Street / Road"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Area / Locality"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  required
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1">
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
