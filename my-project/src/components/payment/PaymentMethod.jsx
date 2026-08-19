const PaymentMethod = ({
  id,
  icon: Icon,
  title,
  subtitle,
  activeMethod,
  setActiveMethod,
}) => {
  return (
    <button
      onClick={() => setActiveMethod(id)}
      className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all ${
        activeMethod === id
          ? "bg-white border-green-500 shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-300"
      }`}
    >
      <div
        className={`mt-0.5 ${
          activeMethod === id ? "text-[#48782E]" : "text-gray-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div>
        <h3
          className={`font-bold text-sm ${
            activeMethod === id ? "text-black" : "text-gray-700"
          }`}
        >
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </button>
  );
};

export default PaymentMethod;
