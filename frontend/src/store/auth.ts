import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

// Define the state interface
interface IAuthState {
  isLogin: boolean;
  username: string | null;
}

// Define the actions interface
interface IAuthAction {
  onLogin: (username: string) => void;
}

// Combine state and actions into a single type
type TAuth = IAuthState & IAuthAction;

// Define a partial state type for the persisted state
type PartialAuthState = Pick<IAuthState, 'isLogin' | 'username'>;

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
  onLogin: (username) => set({ isLogin: true, username }),
});

// Persist options for the store
const persistOptions: PersistOptions<TAuth, PartialAuthState> = {
  name: 'auth-storage', // Unique name for the storage
  partialize: (state) => ({
    isLogin: state.isLogin,
    username: state.username,
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
