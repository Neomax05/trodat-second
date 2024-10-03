import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { AuthResponse } from '../types/user.type';

// Define the state interface
interface IAuthState extends AuthResponse {
  isLogin: boolean;
  username: string | null;
}

// Define the actions interface
interface IAuthAction {
  onLogin: (data: AuthResponse) => void;
}

// Combine state and actions into a single type
type TAuth = IAuthState & IAuthAction;

// Define a partial state type for the persisted state
type PartialAuthState = Pick<
  IAuthState,
  'isLogin' | 'access_token' | 'refresh_token' | 'email'
>;

// Type definition for the StateCreator used with the persist middleware
type AuthStateCreator = StateCreator<
  TAuth,
  [['zustand/persist', PartialAuthState]],
  [],
  TAuth
>;

const authStateCreator: AuthStateCreator = (set) => ({
  isLogin: false,
  username: null,
  access_token: '',
  email: '',
  full_name: '',
  phone_number: '',
  refresh_token: '',
  onLogin: (username) => set({ isLogin: true, ...username }),
});

// Persist options for the store
const persistOptions: PersistOptions<TAuth, PartialAuthState> = {
  name: 'auth-storage', // Unique name for the storage
  partialize: (state) => ({
    isLogin: state.isLogin,
    access_token: state.access_token,
    email: state.email,
    refresh_token: state.refresh_token,
  }),
};

// Correct type assertion to bypass TypeScript type checking for persist function compatibility
const useAuthStore = create<TAuth>()(
  persist(
    authStateCreator as StateCreator<TAuth, [], [], TAuth>,
    persistOptions
  )
);

export default useAuthStore;
