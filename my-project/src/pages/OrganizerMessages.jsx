import ChatPanel from '@/components/ChatPanel';
import OrganizerShell from '@/components/organizer/OrganizerPublicShell';
export default function OrganizerMessages(){ return <OrganizerShell breadcrumb={['Home','Organizer','Messages']} title="Messages" subtitle="Connect with attendees and support."><ChatPanel/></OrganizerShell>; }
