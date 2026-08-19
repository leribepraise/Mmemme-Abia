export default function DisplayImage({
  src,
  alt = "App Promotion",
  className = "",
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl shadow-sm bg-white ${className}`}
    >
      <img src={src} alt={alt} className="w-full h-auto object-cover block" />
    </div>
  );
}
