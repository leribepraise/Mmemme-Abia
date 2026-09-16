const SectionHeader = ({ number, title }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-[#48782E] text-white w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold">
        {number}
      </div>
      <h2 className="text-[20px] font-semibold text-gray-900">{title}</h2>
    </div>
  );
};

export default SectionHeader;