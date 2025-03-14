import { createContext, useContext } from 'react';

import { Plan } from '@/services/api/plans/planSchema';

import { useStorageState } from '../hooks/useStorageState';

interface UserData {
  name: string;
  email: string;
  id: number;
}

export interface Session {
  signIn: (tokens: string, user: UserData) => void;
  signOut: () => void;
  session?: string | null;
  user?: UserData | null;
  isLoading: boolean;
  currentPlan?: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
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
  const [[isLoadingPlan, currentPlan], setCurrentPlan] =
    useStorageState('currentPlan');

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
          setCurrentPlan(null);
        },
        session,
        user: user ? JSON.parse(user) : null,
        isLoading: isLoadingSession || isLoadingUser || isLoadingPlan,
        currentPlan: currentPlan ? JSON.parse(currentPlan) : null,
        setCurrentPlan: (plan: Plan | null) => {
          setCurrentPlan(plan ? JSON.stringify(plan) : null);
        },
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
