import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Calendar, 
  ChevronDown, 
  Headphones, 
  ShieldCheck, 
  CalendarDays 
} from 'lucide-react';

export const CarRentalsPage = () => {
  const [sameAsPickup, setSameAsPickup] = useState(false);

  const cars = [
    { name: 'Toyota Corolla', type: 'Economy', rating: 4.7, reviews: 158, price: '₦18,000', img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop&q=80' },
    { name: 'Hyundai Elantra', type: 'Economy', rating: 4.4, reviews: 112, price: '₦20,000', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&auto=format&fit=crop&q=80' },
    { name: 'Toyota RAV4', type: 'SUV', rating: 4.8, reviews: 245, price: '₦45,000', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80' },
    { name: 'Lexus RX 350', type: 'Luxury', rating: 4.9, reviews: 90, price: '₦80,000', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80' },
    { name: 'KIA Carnival', type: 'Van (7 Seater)', rating: 4.5, reviews: 76, price: '₦35,000', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80' },
    { name: 'Toyota Hiace', type: 'Bus (15 Seater)', rating: 4.4, reviews: 89, price: '₦30,000', img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80' },
    { name: 'Mercedes C300', type: 'Luxury', rating: 5.0, reviews: 52, price: '₦105,000', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&auto=format&fit=crop&q=80' },
    { name: 'Ford T6.4', type: 'SUVy', rating: 4.8, reviews: 34, price: '₦70,000', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80' },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : i < rating
            ? 'fill-amber-200 text-amber-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-400 mb-3 flex items-center space-x-2">
          <span>Home</span>
          <span>&gt;</span>
          <span>Transport</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-medium">Car Rentals</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">Car Rental</h1>
        <p className="text-xs text-gray-500 mb-6 mt-1">
          Choose from a wide range of quality cars for any occassion.
        </p>

        {/* Search Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-8 p-6">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-right opacity-90 pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/95 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Pickup Location */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Pickup Location</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-800 shadow-sm cursor-pointer">
                <span>Umuahia, Abia State</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            {/* Return Location */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700">Return Location</label>
                <label className="flex items-center text-[10px] text-gray-400 cursor-pointer space-x-1">
                  <input 
                    type="checkbox" 
                    checked={sameAsPickup} 
                    onChange={(e) => setSameAsPickup(e.target.checked)} 
                    className="rounded border-gray-300 text-orange-500 focus:ring-0 w-3 h-3" 
                  />
                  <span>Same as pickup</span>
                </label>
              </div>
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-400 shadow-sm cursor-pointer">
                <span>Select return location</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            {/* Pickup Date */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Pickup Date</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-700 shadow-sm cursor-pointer">
                <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <span>May 24, 2025 • 10:00AM</span>
              </div>
            </div>

            {/* Return Date & Search Button */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Return Date</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-700 shadow-sm cursor-pointer mb-3">
                <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                <span>May 26, 2025 • 10:00AM</span>
              </div>
              <button className="w-full bg-[#f25c05] hover:bg-orange-600 text-white font-medium text-xs py-2.5 rounded-lg transition-colors shadow-sm">
                Search Cars
              </button>
            </div>
          </div>
        </div>

        {/* Main Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Sidebar Filters - Extrudes downward using h-full */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-800">Filter By</h3>
                <button className="text-[11px] text-emerald-700 font-semibold hover:underline">Clear all</button>
              </div>

              {/* Vehicle Type */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-800 mb-2">Vehicle Type</h4>
                {['All Types', 'Economy', 'SUV', 'Luxury', 'Van/Bus'].map((type, idx) => (
                  <label key={type} className="flex items-center text-xs text-gray-500 py-1 cursor-pointer">
                    <input type="checkbox" defaultChecked={idx === 0} className="rounded border-gray-300 text-orange-500 focus:ring-0 mr-2 w-3.5 h-3.5" />
                    <span>{type}</span>
                  </label>
                ))}
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-800 mb-2">Price Range (per day)</h4>
                <div className="relative flex items-center my-2">
                  <input type="range" min="10000" max="250000" defaultValue="10000" className="w-full h-1 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-[#f25c05]" />
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-gray-800">
                  <span>₦10,000</span>
                  <span>₦250,000+</span>
                </div>
              </div>

              {/* Transmission */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-800 mb-2">Transmission</h4>
                {['All', 'Automatic', 'Manual'].map((item) => (
                  <label key={item} className="flex items-center text-xs text-gray-500 py-1 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-0 mr-2 w-3.5 h-3.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Fuel Type */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-800 mb-2">Fuel Type</h4>
                {['All', 'Petrol', 'Diesel'].map((item) => (
                  <label key={item} className="flex items-center text-xs text-gray-500 py-1 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-0 mr-2 w-3.5 h-3.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Cars Content & Feature Cards (Spans 3 Columns) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
            
            {/* Featured Vehicles Grid */}
            <div>
              <h2 className="text-xs font-bold text-gray-800 mb-4">Featured Vehicles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cars.map((car, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 relative flex flex-col justify-between hover:shadow-md transition">
                    <button className="absolute top-4 right-4 p-1 rounded-full bg-white/80 backdrop-blur hover:bg-white text-gray-400 hover:text-red-500 z-10 border border-gray-100">
                      <Heart className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="h-28 rounded-lg overflow-hidden mb-3 bg-gray-50 flex items-center justify-center">
                        <img src={car.img} alt={car.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-xs">{car.name}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{car.type}</p>

                      <div className="flex items-center space-x-1 mt-2">
                        <div className="flex items-center space-x-0.5">{renderStars(car.rating)}</div>
                        <span className="text-[10px] text-gray-500 ml-1 font-medium">{car.rating} ({car.reviews})</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-50 flex items-baseline">
                      <span className="text-xs font-bold text-gray-900">{car.price}</span>
                      <span className="text-[10px] text-gray-400 ml-1">/ day</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Value Cards - Strictly Aligned with Cars Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#f0f9f6] border border-emerald-100 rounded-xl p-3.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">No Hidden Charges</p>
                  <p className="text-[10px] text-gray-500">Transparent pricing always</p>
                </div>
              </div>

              <div className="bg-[#f0f9f6] border border-emerald-100 rounded-xl p-3.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-4 h-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">24/7 Support</p>
                  <p className="text-[10px] text-gray-500">We are here to help you</p>
                </div>
              </div>

              <div className="bg-[#f0f9f6] border border-emerald-100 rounded-xl p-3.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Well Maintained Cars</p>
                  <p className="text-[10px] text-gray-500">Safe and comfortable rides</p>
                </div>
              </div>

              <div className="bg-[#f0f9f6] border border-emerald-100 rounded-xl p-3.5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-4 h-4 text-emerald-800" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Easy Booking</p>
                  <p className="text-[10px] text-gray-500">Book in minutes</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};