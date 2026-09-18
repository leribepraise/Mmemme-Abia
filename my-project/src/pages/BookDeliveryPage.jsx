import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Truck, 
  MapPin, 
  UploadCloud, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Wine, 
  Flame, 
  Gem,
  Headphones,
  ThumbsUp,
  Clock4
} from 'lucide-react';

export const BookDeliveryPage = () => {
  const [selectedHandling, setSelectedHandling] = useState(['Fragile']);
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const toggleHandling = (tag) => {
    setSelectedHandling(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center space-x-1.5">
          <span>Home</span>
          <span>&gt;</span>
          <span>Transport</span>
          <span>&gt;</span>
          <span>Courier & Logistics</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-medium">Book Delivery</span>
        </nav>

        {/* Header & Stepper Grid */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book a Delivery</h1>
            <p className="text-xs text-gray-500 mt-1">Fill in the details below and we'll handle the rest.</p>
          </div>

          {/* Connected Wizard Stepper */}
          <div className="flex items-center space-x-2">
            {[
              { step: 1, label: 'Details', active: true },
              { step: 2, label: 'Package', active: false },
              { step: 3, label: 'Review & Pay', active: false },
              { step: 4, label: 'Confirmed', active: false },
            ].map((s, idx, arr) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    s.active ? 'bg-[#f25c05] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.step}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 ${
                    s.active ? 'text-[#f25c05]' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div className="w-8 md:w-12 h-[1px] bg-gray-200 -mt-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main 3-Column Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Sender Details */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs">Sender Details</h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue="Chinedu Okafor" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-orange-500" 
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number</label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="px-2.5 py-2 bg-gray-50 border-r border-gray-200 flex items-center space-x-1">
                  <span className="text-xs">🇳🇬</span>
                </div>
                <input 
                  type="text" 
                  defaultValue="+234 812 345 6789" 
                  className="w-full px-3 py-2 text-xs focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="chineduokafor@gmail.com" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-orange-500" 
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Pickup Address</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  defaultValue="Umuahia, Abia State, Nigeria" 
                  className="w-full text-xs text-gray-800 focus:outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Additional Instructions <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input 
                type="text" 
                defaultValue="Please handle with care." 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-orange-500" 
              />
            </div>
          </div>

          {/* Card 2: Package Details */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs">Package Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Package Type</label>
                <div className="relative">
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white appearance-none focus:outline-none pr-6">
                    <option>Document</option>
                    <option>Parcel</option>
                  </select>
                  <FileText className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Package Weight</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
                  <option>2.5 kg</option>
                  <option>5.0 kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Package Description</label>
              <div className="relative">
                <textarea 
                  rows={2}
                  defaultValue="Important business documents"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:border-orange-500 resize-none"
                />
                <span className="text-[9px] text-gray-400 absolute bottom-1.5 right-2">29/200</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Special Handling <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'Fragile', icon: Wine },
                  { id: 'Perishable', icon: Flame },
                  { id: 'High Value', icon: Gem },
                ].map(({ id, icon: Icon }) => {
                  const active = selectedHandling.includes(id);
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => toggleHandling(id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-[11px] transition ${
                        active 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-medium' 
                          : 'border-gray-200 text-gray-600 bg-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Upload <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer">
                <UploadCloud className="w-6 h-6 text-emerald-700 mb-1" />
                <p className="text-[11px] text-gray-600 font-medium">Drag & drop file here or click to upload</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Max size: 5MB (PDF, JPG, PNG)</p>
              </div>
            </div>
          </div>

          {/* Card 3: Delivery Options */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-2">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-900 text-xs">Delivery Options</h3>
            </div>

            {/* Radio Selectors */}
            <div className="space-y-2">
              {[
                { id: 'standard', title: 'Standard Delivery', price: '₦5,000', desc: 'Delivery in 1-2 days' },
                { id: 'express', title: 'Express Delivery', price: '₦10,000', desc: 'Same-day delivery' },
                { id: 'nextday', title: 'Next Day Delivery', price: '₦7,500', desc: 'Delivery by next day' },
              ].map((opt) => {
                const active = deliveryOption === opt.id;
                return (
                  <div 
                    key={opt.id}
                    onClick={() => setDeliveryOption(opt.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      active ? 'border-orange-500 bg-white' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        active ? 'border-orange-500' : 'border-gray-300'
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{opt.title}</p>
                        <p className="text-[10px] text-gray-400">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">{opt.price}</span>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Preferred Date</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-700 cursor-pointer">
                <Calendar className="w-3.5 h-3.5 text-gray-400 mr-2" />
                <span>May 24, 2025</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">Preferred Time</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white text-xs text-gray-700 cursor-pointer">
                <Clock className="w-3.5 h-3.5 text-gray-400 mr-2" />
                <span>10:00 AM - 12:00 PM</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Your delivery is 100% safe and secure.</span>
            </div>
          </div>
        </div>

        {/* Order Summary Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="bg-[#eaf4f0] px-6 py-3 border-b border-gray-100 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-800" />
            <h3 className="font-bold text-gray-900 text-xs ">Order Summary</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pb-6 border-b border-gray-100">
              
              {/* Route */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">From</span>
                    <span className="text-xs font-bold text-gray-800">Umuahia, Abia State</span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">To</span>
                    <span className="text-xs font-bold text-gray-800">Aba, Abia State</span>
                  </div>
                </div>
              </div>

              {/* Package Meta Specs */}
              <div className="border-y md:border-y-0 md:border-x border-gray-100 py-3 md:py-0 md:px-6 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Package Type</span>
                  <span className="font-medium text-gray-800">Document</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Weight</span>
                  <span className="font-medium text-gray-800">2.5 kg</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="text-gray-400">Delivery Option</span>
                  <span className="font-medium text-gray-800">Standard (1-2 days)</span>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold text-gray-800">₦5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="font-bold text-gray-800">₦1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Insurance (Optional)</span>
                  <span className="font-bold text-gray-800">₦500</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 items-baseline">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="text-lg font-black text-emerald-800">₦6,500</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button className="bg-[#f25c05] hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs transition shadow-sm">
                Book Now
              </button>
              <button className="border border-gray-300 text-gray-700 font-bold py-3 rounded-xl text-xs hover:bg-gray-50 transition">
                Save for Later
              </button>
            </div>
          </div>
        </div>

        {/* Value Proposition Outer Box */}
        <div className="border border-gray-200 rounded-xl p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Secure Delivery</p>
              <p className="text-[10px] text-gray-400">We ensure safe delivery of your items.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Clock4 className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Real-time Tracking</p>
              <p className="text-[10px] text-gray-400">Track your package in real-time.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Affordable Rates</p>
              <p className="text-[10px] text-gray-400">Best prices with no hidden charges.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">24/7 Support</p>
              <p className="text-[10px] text-gray-400">We're here to help you anytime.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};