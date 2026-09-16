import SectionHeader from "./common/SectionHeader";
import { ChevronRight } from "lucide-react";

const MyTickets = ({ user }) => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="My Tickets"
        description="View and manage your event tickets."
        user={user}
      />    

      {/* rest of your existing JSX */}
    </div>
  );
};

export default MyTickets;
