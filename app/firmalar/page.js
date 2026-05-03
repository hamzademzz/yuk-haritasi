"use client";
import React, { useState } from 'react';
import { 
  Building2, MapPin, Star, Phone, Search, 
  Filter, ChevronRight, Truck, HardHat, Award, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// ŞİMDİLİK HARDCODED VERİLER
const SAHTE_FIRMALAR = [
  {
    id: 1,
    isim: "Metropol Vinç Ankara",
    logo: "https://images.unsplash.com/photo-1586864387917-f53947057576?q=80&w=200&h=200&auto=format&fit=crop",
    hizmetler: ["Mobil Vinç", "Sepetli Vinç", "Kule Vinç"],
    kapasite: "5 Adet Araç, 100 Ton Kapasite",
    konum: "Ostim, Ankara",
    puan: 4.8,
    yorumSayisi: 124,
    onayli: true
  },
  {
    id: 2,
    isim: "Akgün Nakliyat & Lojistik",
    logo: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=200&h=200&auto=format&fit=crop",
    hizmetler: ["Evden Eve", "Ofis Taşıma", "Parsiyel"],
    kapasite: "12 Araçlık Filo, Geniş Ağı",
    konum: "Bornova, İzmir",
    puan: 5.0,
    yorumSayisi: 89,
    onayli: true
  },
  {
    id: 3,
    isim: "Doğan Ağır Nakliyat",
    logo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=200&h=200&auto=format&fit=crop",
    hizmetler: ["Lowbed", "Proje Taşımacılığı"],
    kapasite: "Özel Ekipman, 200 Ton Kapasite",
    konum: "Gebze, Kocaeli",
    puan: 4.5,
    yorumSayisi: 56,
    onayli: false
  }
];

export default function FirmalarPage() {
  const [arama, setArama] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ÜST PANEL */}
      <div className="bg-[#1e3a5f] text-white pt-10 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-300 mb-6 hover:text-white transition">
            <ArrowLeft size={14}/> ANA SAYFAYA DÖN
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <Building2 className="text-[#f58220]" /> FİRMA REHBERİ
              </h1>
              <p className="text-gray-300 text-sm mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                🏗️ ANKARA FİRMA REHBERİ - VİNÇ HİZMETLERİ
              </p>
            </div>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Firma Ara..." 
                 className="w-full p-3.5 pl-12 rounded-2xl bg-white text-gray-900 font-bold text-sm outline-none"
                 onChange={(e) => setArama(e.target.value)}
               />
            </div>
          </div>
        </div>
      </div>

      {/* FİLTRE VE LİSTELEME */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="flex items-center justify-between mb-6">
           <button className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-xs font-black text-[#1e3a5f]">
             <Filter size={16} className="text-[#f58220]"/> FİLTRELER
           </button>
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             Sıralama: <span className="text-[#1e3a5f]">ÖNERİLEN</span>
           </div>
        </div>

        <div className="grid gap-4">
          {SAHTE_FIRMALAR.map((firma) => (
            <div key={firma.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition group">
              {/* LOGO */}
              <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                <img src={firma.logo} alt={firma.isim} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>

              {/* DETAY */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-black text-[#1e3a5f] uppercase italic">{firma.isim}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill={i < Math.floor(firma.puan) ? "#f58220" : "none"} className="text-[#f58220]" />
                    ))}
                    <span className="text-[10px] font-bold text-gray-400 ml-1">({firma.yorumSayisi})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {firma.hizmetler.map((h, i) => (
                    <span key={i} className="text-[9px] font-black bg-gray-50 text-gray-500 px-3 py-1 rounded-lg border border-gray-100 flex items-center gap-1 uppercase">
                      {h} <ChevronRight size={8} />
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600 italic">
                    <Truck size={14} className="text-[#f58220]" /> {firma.kapasite}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <MapPin size={14} className="text-red-500" /> {firma.konum}
                  </div>
                </div>
              </div>

              {/* AKSİYON */}
              <div className="md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-6">
                <button className="w-full py-3 bg-[#f58220] text-white rounded-xl font-black text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:brightness-110 active:scale-95 transition uppercase tracking-tighter">
                  <Phone size={14}/> HEMEN ARA
                </button>
                <Link href={`/firmalar/${firma.id}`} className="w-full py-3 bg-gray-50 text-[#1e3a5f] rounded-xl font-black text-[11px] flex items-center justify-center gap-2 hover:bg-gray-100 transition uppercase tracking-tighter">
                  PROFİLİ GÖR
                </Link>
                <p className="text-[9px] text-center text-gray-400 font-bold italic mt-1">Numara Aramadan Sonra Görünür</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}