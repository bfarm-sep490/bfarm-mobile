import { createContext, useContext } from 'react';

import { useStorageState } from '../hooks/useStorageState';

interface UserData {
  name: string;
  email: string;
}

export interface Session {
  signIn: (tokens: string, user: UserData) => void;
  signOut: () => void;
  session?: string | null;
  user?: UserData | null;
  isLoading: boolean;
}

const AuthContext = createContext<Session | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  return value as Session;
}

export function SessionProvider(props: any) {
  const [[isLoadingSession, session], setSession] = useStorageState('session');
  const [[isLoadingUser, user], setUser] = useStorageState('user');

  return (
    <AuthContext.Provider
      value={{
        signIn: async (tokens: string, userData: UserData) => {
          setSession(JSON.stringify(tokens));
          setUser(JSON.stringify(userData));
        },
        signOut: () => {
          setSession(null);
          setUser(null);
        },
        session,
        user: user ? JSON.parse(user) : null,
        isLoading: isLoadingSession || isLoadingUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
