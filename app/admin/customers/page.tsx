"use client";

import React, { useState } from "react";
import { Users, Search, Mail, Phone, MapPin, Award } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

const demoCustomers = [
  {
    id: "c-01",
    name: "Siddharth Verma",
    email: "siddharth.v@example.com",
    phone: "+91 9876543210",
    city: "Gurugram, HR",
    totalOrders: 3,
    totalSpent: 28497,
    joinDate: "Jan 15, 2024",
    tier: "VIP Platinum",
  },
  {
    id: "c-02",
    name: "Ananya Singhania",
    email: "ananya.singhania@example.com",
    phone: "+91 9811223344",
    city: "Mumbai, MH",
    totalOrders: 4,
    totalSpent: 42996,
    joinDate: "Feb 02, 2024",
    tier: "VIP Black",
  },
  {
    id: "c-03",
    name: "Kabir Oberoi",
    email: "kabir.oberoi@example.com",
    phone: "+91 9988776655",
    city: "Bengaluru, KA",
    totalOrders: 2,
    totalSpent: 23998,
    joinDate: "Feb 20, 2024",
    tier: "VIP Platinum",
  },
  {
    id: "c-04",
    name: "Devika Sen",
    email: "devika.sen@example.com",
    phone: "+91 9123456780",
    city: "Kolkata, WB",
    totalOrders: 1,
    totalSpent: 5999,
    joinDate: "Mar 08, 2024",
    tier: "Member",
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = demoCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Clientele Relationship
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Registered Patrons ({demoCustomers.length})
          </h1>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name or city..."
            className="w-full h-10 pl-9 pr-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="p-4">Patron</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Value</th>
                <th className="p-4">Membership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4">
                    <strong className="text-white block text-sm">{c.name}</strong>
                    <span className="text-[10px] text-zinc-500">Joined {c.joinDate}</span>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Mail className="h-3 w-3 text-gold-400" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Phone className="h-3 w-3 text-zinc-500" />
                      <span>{c.phone}</span>
                    </div>
                  </td>

                  <td className="p-4 text-zinc-300 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold-500" />
                    <span>{c.city}</span>
                  </td>

                  <td className="p-4 font-semibold text-white">
                    {c.totalOrders} Orders
                  </td>

                  <td className="p-4 font-bold text-gold-400 text-sm">
                    {formatPrice(c.totalSpent)}
                  </td>

                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
                      {c.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
