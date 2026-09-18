import React from 'react';

import { MapPin, Phone, MessageSquare, Shield, AlertTriangle } from 'lucide-react';

export const LiveTrackingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4">
          Home &gt; Transport &gt; <span className="text-gray-800 font-medium">Live Tracking</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tracking Floating Sidebar Info */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Live Ride Tracking</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">SUV</span>
            </div>

            {/* Driver Specs */}
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Driver" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-sm text-gray-800">Chinedu Okafor</h4>
                <p className="text-xs text-gray-400">Toyota Corolla • ABC 123 XY</p>
              </div>
            </div>

            {/* Trip Timeline */}
            <div className="space-y-4 border-l-2 border-emerald-500 pl-4 ml-2 my-4 relative">
              <div>
                <span className="text-[10px] text-gray-400 block">From</span>
                <p className="text-xs font-bold text-gray-800">Umuahia, Abia State</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">To</span>
                <p className="text-xs font-bold text-gray-800">Aba, Abia State</p>
              </div>
            </div>

            {/* Fare Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl text-center">
              <div><p className="text-[10px] text-gray-400">Distance</p><p className="text-xs font-bold">18km</p></div>
              <div><p className="text-[10px] text-gray-400">Time</p><p className="text-xs font-bold">45 mins</p></div>
              <div><p className="text-[10px] text-gray-400">Fare</p><p className="text-xs font-bold text-emerald-700">₦2,500</p></div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1 border border-gray-300 py-2 rounded-lg text-xs font-bold hover:bg-gray-50"><Phone className="w-3.5 h-3.5" /> Call Driver</button>
              <button className="flex items-center justify-center gap-1 border border-gray-300 py-2 rounded-lg text-xs font-bold hover:bg-gray-50"><MessageSquare className="w-3.5 h-3.5" /> Message</button>
            </div>
            <button className="w-full text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-lg text-xs font-bold">Cancel Ride</button>
          </div>

          {/* Interactive Map View */}
          <div className="lg:col-span-8 bg-emerald-50/30 rounded-2xl border border-gray-200 h-[500px] relative overflow-hidden flex items-center justify-center">
            {/* Map Canvas Mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <div className="relative text-center">
              <MapPin className="w-12 h-12 text-emerald-700 animate-bounce mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full shadow border">Vehicle Location Live Stream</p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};