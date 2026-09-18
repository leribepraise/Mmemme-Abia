import React from 'react';
import { 
  CheckCircle, 
  Star, 
  Car, 
  Clock, 
  CheckSquare, 
  User, 
  Languages, 
  MapPin, 
  Calendar, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  Users, 
  Sliders, 
  Fuel, 
  Wind, 
  DoorClosed 
} from 'lucide-react';

export const DriverDetailsPage = () => {
  const renderStars = (count = 5) => (
    <div className="flex text-amber-400 space-x-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-amber-400" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center space-x-1.5">
          <span>Home</span>
          <span>&gt;</span>
          <span>Transport</span>
          <span>&gt;</span>
          <span>Car Rentals</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-medium">Driver Details</span>
        </nav>

        {/* Main Grid Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Driver Profile Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Profile Avatar */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80" 
                    alt="Chinedu Okafor" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Profile Main Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900">Chinedu Okafor</h1>
                    <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Driver</span>
                    </span>
                  </div>

                  {/* Ratings & Reviews */}
                  <div className="flex items-center space-x-2 text-xs">
                    {renderStars(4)}
                    <span className="font-bold text-gray-800">4.8</span>
                    <span className="text-gray-400">(245 reviews)</span>
                  </div>

                  {/* Stat Counters */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <div className="flex items-center space-x-1 text-gray-800 font-bold">
                        <Car className="w-3.5 h-3.5 text-gray-600" />
                        <span>120</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Completed Trips</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1 text-gray-800 font-bold">
                        <Clock className="w-3.5 h-3.5 text-gray-600" />
                        <span>4+</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Years of Experience</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-1 text-gray-800 font-bold">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>96%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Acceptance Rate</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-gray-800 mb-1">About Me</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Professional and punctual driver with years of experience ensuring safe and comfortable rides.
                    </p>
                  </div>
                </div>
              </div>

              {/* Moved Metadata Div - Edge Aligned horizontally across full container */}
              <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>Male</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Languages className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>English, Igbo</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>Umuahia, Abia State</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>Member since 14 June, 2024</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center space-x-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-2.5 px-3 rounded-xl text-xs font-bold transition">
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span>Call Driver</span>
              </button>
              <button className="flex items-center justify-center space-x-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-2.5 px-3 rounded-xl text-xs font-bold transition">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Message</span>
              </button>
              <button className="flex items-center justify-center space-x-1.5 bg-[#0f431f] hover:bg-emerald-900 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition">
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>Save Later</span>
              </button>
            </div>

            {/* Driver Details Table */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xs font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Driver Details
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Driver ID</span>
                  <span className="font-bold text-gray-800">DRV-24587</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Package Type</span>
                  <span className="font-bold text-gray-800">Standard</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Phone Number</span>
                  <span className="font-bold text-gray-800">+234 812 345 6789</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Service Areas</span>
                  <span className="font-bold text-gray-800">Umuahia, Aba, Isuikwuato</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Email</span>
                  <span className="font-bold text-gray-800">chineduokafor@gmail.com</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Availability</span>
                  <span className="font-bold text-gray-800">Mon - Sun (24/7)</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Vehicle Plate</span>
                  <span className="font-bold text-gray-800">ABC 123 XY</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Cancellation Rate</span>
                  <span className="font-bold text-gray-800">4%</span>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Vehicle Model</span>
                  <span className="font-bold text-gray-800">Toyota Corolla</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-400">Response Rate</span>
                  <span className="font-bold text-gray-800">98%</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Registration Date</span>
                  <span className="font-bold text-gray-800">Jun 15, 2018</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Last Trip</span>
                  <span className="font-bold text-gray-800">May 24, 2025</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Vehicle Information Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
                Vehicle Information
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2 h-32 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&auto=format&fit=crop&q=80" 
                    alt="Toyota Corolla" 
                    className="w-full h-full object-contain" 
                  />
                </div>

                <div className="w-full sm:w-1/2 space-y-2">
                  <h3 className="font-bold text-gray-900 text-sm">Toyota Corolla</h3>
                  <p className="text-xs text-gray-400">Silver</p>
                  <div className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                    <Car className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ABC 123 XY</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-2">
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-800 mb-1" />
                  <span className="text-[10px] text-gray-500">5 Seats</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <Sliders className="w-4 h-4 text-emerald-800 mb-1" />
                  <span className="text-[10px] text-gray-500">Automatic</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <Fuel className="w-4 h-4 text-emerald-800 mb-1" />
                  <span className="text-[10px] text-gray-500">Petrol</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <Wind className="w-4 h-4 text-emerald-800 mb-1" />
                  <span className="text-[10px] text-gray-500">Air Condition</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
                  <DoorClosed className="w-4 h-4 text-emerald-800 mb-1" />
                  <span className="text-[10px] text-gray-500">4 Doors</span>
                </div>
              </div>
            </div>

            {/* Rider Reviews Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
                What Riders Say
              </h2>

              <div className="space-y-4 divide-y divide-gray-50">
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2.5">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Emeka U." className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Emeka U.</h4>
                        {renderStars(5)}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">May 18, 2026</span>
                  </div>
                  <p className="text-[11px] text-gray-500 pl-9">
                    Great driver! Very professional and friendly.
                  </p>
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2.5">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Chioma N." className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Chioma N.</h4>
                        {renderStars(5)}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">May 24, 2026</span>
                  </div>
                  <p className="text-[11px] text-gray-500 pl-9">
                    Punctual, safe and the car was very clean.
                  </p>
                </div>

                <div className="pt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2.5">
                      <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80" alt="John K." className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">John K.</h4>
                        {renderStars(5)}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">May 28, 2026</span>
                  </div>
                  <p className="text-[11px] text-gray-500 pl-9">
                    Excellent service as always. Highly recommended.
                  </p>
                </div>
              </div>

              <button className="w-full border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition mt-2">
                View All Reviews
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};