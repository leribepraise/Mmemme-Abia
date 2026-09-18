import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Car, Zap, Crown, Users } from "lucide-react";

const vehicleClasses = [
  { id: "standard", name: "Standard", icon: Car, perKm: 150, eta: "5 mins", desc: "Affordable everyday rides" },
  { id: "comfort", name: "Comfort", icon: Zap, perKm: 220, eta: "7 mins", desc: "Newer cars, extra legroom" },
  { id: "xl", name: "XL", icon: Users, perKm: 260, eta: "9 mins", desc: "Fits up to 6 passengers" },
  { id: "premium", name: "Premium", icon: Crown, perKm: 380, eta: "10 mins", desc: "Luxury vehicles" },
];

const ESTIMATED_DISTANCE_KM = 18;

const RidePage = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("Umuahia, Abia State");
  const [destination, setDestination] = useState("Aba, Abia State");
  const [selectedClass, setSelectedClass] = useState("standard");
  const [requesting, setRequesting] = useState(false);

  const fare = useMemo(() => {
    const cls = vehicleClasses.find((c) => c.id === selectedClass);
    return cls.perKm * ESTIMATED_DISTANCE_KM;
  }, [selectedClass]);

  const handleRequestRide = () => {
  if (!pickup || !destination) return;
  setRequesting(true);
  setTimeout(() => {
    navigate("/transport/ride/driver-details");
  }, 1200);
};

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your trip details and choose a ride type.
          </p>
        </div>

        {/* Trip details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Pick-up Location</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Destination</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Vehicle class selection */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 text-sm mb-4">Choose a ride</h3>
          <div className="space-y-3">
            {vehicleClasses.map((cls) => {
              const Icon = cls.icon;
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors text-left ${
                    isSelected
                      ? "border-[#48782E] bg-[#48782E]/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? "bg-[#48782E] text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{cls.name}</p>
                      <p className="text-xs text-gray-400">{cls.desc} • {cls.eta} away</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-900">
                    ₦{(cls.perKm * ESTIMATED_DISTANCE_KM).toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Estimated fare</p>
            <p className="text-2xl font-black text-emerald-800">₦{fare.toLocaleString()}</p>
          </div>
          <button
            onClick={handleRequestRide}
            disabled={requesting}
            className="bg-[#F97316] hover:bg-[#df5f18] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl text-sm transition"
          >
            {requesting ? "Finding a driver..." : "Request Ride"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePage;