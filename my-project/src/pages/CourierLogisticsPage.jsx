import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  MapPin,
  Tag,
  Headphones,
  Globe,
  Bike,
  Utensils,
  FileText,
  Truck,
  Zap,
} from "lucide-react";

const services = [
  { id: "1", title: "Our Services", description: "Send documents, parcels and packages to any location.", icon: Bike },
  { id: "2", title: "Food Delivery", description: "Order food from your favorite restaurants and we'll deliver.", icon: Utensils },
  { id: "3", title: "Document Delivery", description: "Fast and secure delivery of important documents.", icon: FileText },
  { id: "4", title: "Furniture Delivery", description: "We deliver furniture and appliances with care and safety.", icon: Truck },
  { id: "5", title: "Truck Services", description: "Logistics and cargo transportation for businesses.", icon: Truck },
  { id: "6", title: "Express Delivery", description: "Urgent delivery service for time-sensitive packages.", icon: Zap },
];

const features = [
  { title: "Fast Delivery", desc: "Your time is our priority.", icon: Clock },
  { title: "Safe & Secure", desc: "We handle your packages with extra care.", icon: ShieldCheck },
  { title: "Live Tracking", desc: "Track your parcel in real-time.", icon: MapPin },
  { title: "Affordable Rates", desc: "Best prices with no hidden fees.", icon: Tag },
  { title: "24/7 Support", desc: "We are always here to assist you.", icon: Headphones },
  { title: "Wide Coverage", desc: "Across Abia state and beyond.", icon: Globe },
];

const CourierLogisticsPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa]chr pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-gray-400 flex items-center gap-1.5">
          <span>Home</span>
          <span>&gt;</span>
          <span>Transport</span>
          <span>&gt;</span>
          <span className="text-gray-600 font-medium">Courier Logistics</span>
        </nav>

        {/* Header Title Section with Hero Illustration Area */}
        <div className="relative pt-2 pb-4 flex items-end justify-between border-b border-gray-100">
          <div className="max-w-lg">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Courier & Logistics
            </h1>
            <p className="text-xs text-gray-400">
              Choose from a wide range of quality cars for any occasion.
            </p>
          </div>
          
          {/* Header Graphic Background Accent */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-90">
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80"
              alt="Logistics Courier"
              className="w-full h-full object-contain object-right"
            />
          </div>
        </div>

        {/* Our Services Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center justify-between min-h-[190px] hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mt-1">
                    <Icon size={20} className="text-[#0f431f]" />
                  </div>
                  
                  <div className="my-2">
                    <p className="text-xs font-bold text-gray-900 mb-1 leading-snug">
                      {service.title}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <Link
                    to="/transport/book-delivery"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0f431f] hover:text-emerald-800"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Delivery Solution Banner */}
        <div className="bg-[#0f431f] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
          <div className="z-10 max-w-xl">
            <h3 className="text-base font-bold text-white mb-1">
              Need a Custom Delivery Solution?
            </h3>
            <p className="text-xs text-emerald-100">
              We handle bulk deliveries, business logistics and special requests.
            </p>
          </div>

          <Link
            to="/contact"
            className="z-10 bg-white hover:bg-gray-50 text-[#0f431f] font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm transition whitespace-nowrap"
          >
            Contact Us Now
          </Link>
        </div>

        {/* Why Choose Us Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start gap-2.5"
                >
                  <div className="p-1.5 bg-emerald-50 rounded-lg flex-shrink-0">
                    <Icon size={16} className="text-[#0f431f]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {feat.title}
                    </p>
                    <p className="text-[9px] text-gray-400 leading-tight mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourierLogisticsPage;