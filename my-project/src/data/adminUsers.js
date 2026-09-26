import { Users, UserCheck, UserPlus } from "lucide-react";

export const roleOptions = ["User", "Organizer", "Vendor", "Driver", "Host"];
export const statusOptions = ["Active", "Pending", "Suspended"];
export const lgaOptions = [
  "Aba North",
  "Aba South",
  "Arochukwu",
  "Bende",
  "Ikwuano",
  "Isiala Ngwa North",
  "Isiala Ngwa South",
  "Isuikwuato",
  "Obi Ngwa",
  "Ohafia",
  "Osisioma",
  "Ugwunagbo",
  "Ukwa East",
  "Ukwa West",
  "Umu Nneochi",
  "Umuahia North",
  "Umuahia South",
];

// Platform-wide totals (these will come from the backend later)
export const userStats = [
  {
    id: "total",
    label: "Total Users",
    value: "12,458",
    change: "+12%",
    icon: Users,
  },
  {
    id: "active",
    label: "Active Users",
    value: "11,230",
    change: "+10%",
    icon: UserCheck,
  },
  {
    id: "new",
    label: "New This Month",
    value: "2,340",
    change: "+15%",
    icon: UserPlus,
  },
];

const seedUsers = [
  {
    id: 1,
    name: "Chinedu Okafor",
    email: "chinedu@gmail.com",
    phone: "+234 810 123 4567",
    role: "User",
    lga: "Umuahia North",
    status: "Active",
  },
  {
    id: 2,
    name: "Ngozi Eze",
    email: "ngozi@gmail.com",
    phone: "+234 803 987 6543",
    role: "User",
    lga: "Isiala Ngwa North",
    status: "Active",
  },
  {
    id: 3,
    name: "Emeka Nwosu",
    email: "emeka@gmail.com",
    phone: "+234 706 111 2222",
    role: "Organizer",
    lga: "Aba South",
    status: "Active",
  },
  {
    id: 4,
    name: "Blessing John",
    email: "blessing@gmail.com",
    phone: "+234 802 333 4444",
    role: "Vendor",
    lga: "Obi Ngwa",
    status: "Active",
  },
  {
    id: 5,
    name: "Adaeze Uche",
    email: "adaeze@gmail.com",
    phone: "+234 805 555 6666",
    role: "User",
    lga: "Ukwa East",
    status: "Active",
  },
  {
    id: 6,
    name: "Lawrence Chukwu",
    email: "lawrence@gmail.com",
    phone: "+234 810 777 8888",
    role: "Driver",
    lga: "Ikwuano",
    status: "Pending",
  },
  {
    id: 7,
    name: "Felicia Okoro",
    email: "felicia@gmail.com",
    phone: "+234 803 999 0000",
    role: "Host",
    lga: "Umuahia South",
    status: "Active",
  },
  {
    id: 8,
    name: "Ifeanyi Eze",
    email: "ifeanyi@gmail.com",
    phone: "+234 706 222 3333",
    role: "User",
    lga: "Bende",
    status: "Active",
  },
  {
    id: 9,
    name: "Chioma Adebayo",
    email: "chioma@gmail.com",
    phone: "+234 802 444 5555",
    role: "User",
    lga: "Isiala Ngwa South",
    status: "Active",
  },
  {
    id: 10,
    name: "Victor Nwachukwu",
    email: "victor@gmail.com",
    phone: "+234 803 666 7777",
    role: "Organizer",
    lga: "Arochukwu",
    status: "Suspended",
  },
];

// Extra generated users so search, filters and pagination have something to work with
const firstNames = [
  "Obinna",
  "Amaka",
  "Kelechi",
  "Ijeoma",
  "Uchenna",
  "Nneka",
  "Chukwudi",
  "Ada",
  "Ikenna",
  "Oluchi",
  "Somto",
  "Tochi",
];
const lastNames = [
  "Nwankwo",
  "Eze",
  "Okeke",
  "Ugwu",
  "Onyeka",
  "Igwe",
  "Nnadi",
  "Obi",
];

const generatedUsers = Array.from({ length: 24 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[(i * 3) % lastNames.length];
  return {
    id: 11 + i,
    name: `${first} ${last}`,
    email: `${first}.${last}${i}@gmail.com`.toLowerCase(),
    phone: `+234 80${i % 10} ${String(200 + i * 11).padStart(3, "0")} ${String(1000 + i * 37).slice(0, 4)}`,
    role: roleOptions[(i * 2) % roleOptions.length],
    lga: lgaOptions[(i * 5) % lgaOptions.length],
    status: i % 7 === 0 ? "Pending" : i % 11 === 0 ? "Suspended" : "Active",
  };
});

export const initialUsers = [...seedUsers, ...generatedUsers];
