import { NavLink } from "react-router-dom";

const EventBreadcrumb = () => {
  return (
    <div className="text-[18px] text-[#3D3E3E] flex items-center space-x-1">
      <NavLink to="/events" className="font-medium hover:underline">
        Events
      </NavLink>

      <span>&gt;</span>

      <span className="font-medium">Abia Business Summit 2026</span>
    </div>
  );
};

export default EventBreadcrumb;
