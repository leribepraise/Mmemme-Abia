import { useAuth } from './AuthContext';
const emptyUser = { fullName: '', email: '', phone: '', whatsapp: '', lga: '', address: '', dateOfBirth: '', gender: '', bio: '', profilePicture: '', plan: 'bronze' };
export const UserProvider = ({ children }) => children;
export const useUser = () => { const { user, updateUser } = useAuth(); return { user: user || emptyUser, updateUser }; };
