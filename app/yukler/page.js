"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Truck, MapPin, Calendar, Weight, User, Phone, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// 1. Create a separate component for the list logic
function YukListesi() {
  const searchParams = useSearchParams();
  const nereden = searchParams.get('nereden');
  const nereye = searchParams.get('nereye');

  const sahteYukler = [
    { 
      id: 1, 
      baslik: "Paletli Gıda Ürünü", 
      nereden: "Ankara", 
      nereye: "İstanbul", 
      agirlik: "20 Ton", 
      arac: "Tır", 
      tarih: "20/03/2026",
      mesafe: "450 km",
      sahibi: "Nami Sona",
      konum: "Ostim, Ankara",
      puan: 4
    },
    { 
      id: 2, 
      baslik: "İnşaat Malzemesi", 
      nereden: "İzmir", 
      nereye: "Bursa", 
      agirlik: "15 Ton", 
      arac: "Kamyon", 
      tarih: "22/03/2026",
      mesafe: "340 km",
      sahibi: "Ahmet Lojistik",
      konum: "Bornova, İzmir",
      puan: 5
    }
  ];

  return (
    <>
      {/* Üst Bilgi Paneli */}
      <div className="bg-[#1e3a5f] text-white pt-10 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-300 mb-6 hover:text-white transition">
            <ArrowLeft size={16}/> Geri Dön
          </Link>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            {nereden && nereye ? `${nereden} → ${nereye} Yükleri` : "Güncel Yük İlanları"}
          </h1>
          <p className="text-orange-400 font-bold mt-2">Toplam {sahteYukler.length} ilan bulundu.</p>
        </div>
      </div>

      {/* İlan Listesi */}
      <div className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="grid gap-6">
          {sahteYukler.map((yuk) => (
            <div key={yuk.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              <div className="p-8 flex-1 border-r border-gray-50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black bg-orange-100 text-[#f58220] px-3 py-1 rounded-full uppercase">Yük Detayları</span>
                    <h3 className="text-xl font-black text-[#1e3a5f] mt-2 uppercase italic">{yuk.baslik}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mesafe</p>
                    <p className="font-black text-[#1e3a5f]">{yuk.mesafe}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a5f]">
                      <Weight size={20}/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Ağırlık</p>
                      <p className="text-sm font-black italic">{yuk.agirlik}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a5f]">
                      <Truck size={20}/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Araç</p>
                      <p className="text-sm font-black italic">{yuk.arac}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1e3a5f]">
                      <Calendar size={20}/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tarih</p>
                      <p className="text-sm font-black italic">{yuk.tarih}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                   <div className="flex-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Güzergah</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-black text-[#1e3a5f]">{yuk.nereden}</span>
                        <div className="h-[2px] flex-1 bg-gray-200 relative mx-2">
                           <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400"></div>
                        </div>
                        <span className="font-black text-[#1e3a5f]">{yuk.nereye}</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-gray-50/50 p-8 md:w-80 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-gray-900">İlan Sahibi</h4>
                  <div className="flex items-center gap-3 mb-4 text-gray-900">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1e3a5f] border-2 border-white">
                      <User size={24}/>
                    </div>
                    <div>
                      <p className="font-black leading-tight">{yuk.sahibi}</p>
                      <div className="flex text-orange-400 gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < yuk.puan ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                       <MapPin size={14}/> {yuk.konum}
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-[#22c55e] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all">
                  <Phone size={18}/> İLAN SAHİBİNİ ARA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// 2. Wrap everything in Suspense in the main export
export default function YuklerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Suspense fallback={<div className="p-20 text-center font-bold text-[#1e3a5f]">Yükler Yükleniyor...</div>}>
        <YukListesi />
      </Suspense>
    </div>
  );
}