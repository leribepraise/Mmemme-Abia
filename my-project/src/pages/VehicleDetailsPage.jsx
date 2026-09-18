import React from 'react';

import { Star, Users, Gauge, Fuel, Wind, DoorClosed, Check, Calendar } from 'lucide-react';

export const VehicleDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
   
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4">
          Home &gt; Transport &gt; Car Rentals &gt; <span className="text-gray-800 font-medium">Vehicle Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gallery & Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="h-64 rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80" alt="Toyota RAV4" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&auto=format&fit=crop&q=80" alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Specifications</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-t pt-3">
                <div className="flex justify-between py-1 text-gray-500"><span>Brand</span> <span className="font-semibold text-gray-800">Toyota</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Seating Capacity</span> <span className="font-semibold text-gray-800">5</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Model</span> <span className="font-semibold text-gray-800">RAV4</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Luggage Capacity</span> <span className="font-semibold text-gray-800">2 Large</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Year</span> <span className="font-semibold text-gray-800">2023</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Fuel Economy</span> <span className="font-semibold text-gray-800">12km/Ltr</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Transmission</span> <span className="font-semibold text-gray-800">Automatic</span></div>
                <div className="flex justify-between py-1 text-gray-500"><span>Color</span> <span className="font-semibold text-gray-800">White</span></div>
              </div>
            </div>
          </div>

          {/* Right Column: Info, Features & Booking */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-gray-900">Toyota RAV4</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold">SUV</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-amber-400">★★★★★</div>
                <span className="font-bold text-gray-800">4.8</span>
                <span className="text-gray-400">(245 reviews)</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-emerald-800">₦45,000</span>
                <span className="text-gray-500 text-xs"> / day</span>
              </div>
            </div>

            {/* Quick Spec Badges */}
            <div className="grid grid-cols-5 gap-3 bg-emerald-50/40 p-4 rounded-xl text-center">
              {[
                { icon: Users, label: '5 Seats' },
                { icon: Gauge, label: 'Automatic' },
                { icon: Fuel, label: 'Petrol' },
                { icon: Wind, label: 'Air Condition' },
                { icon: DoorClosed, label: '4 Doors' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 text-xs text-gray-600">
                  <item.icon className="w-5 h-5 text-emerald-700" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* About Vehicle */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm">About Vehicle</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The Toyota RAV4 is a perfect SUV for both city drives and off-road adventures. Spacious, comfortable and fuel-efficient.
              </p>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Features</h3>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                {['Air Conditioning', 'Bluetooth', 'Service Warranty', 'USB Port', 'Cruise Control', 'Power Steering', 'Power Windows', 'Audio System'].map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Select Date</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-3 text-xs bg-gray-50">
                  <span className="text-gray-400 block mb-1">Pick-up</span>
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" /> May 24, 2025 • 10:00AM
                  </div>
                </div>
                <div className="border rounded-lg p-3 text-xs bg-gray-50">
                  <span className="text-gray-400 block mb-1">Return</span>
                  <div className="flex items-center gap-2 font-semibold text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" /> May 26, 2025 • 10:00AM
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Total Price</p>
                  <p className="text-[10px] text-gray-400">(2 days)</p>
                </div>
                <span className="text-2xl font-black text-gray-900">₦90,000</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs transition">Book Now</button>
                <button className="border border-gray-300 text-gray-700 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition">Save for Later</button>
              </div>
            </div>
          </div>
        </div>
      </main>
     
    </div>
  );
};