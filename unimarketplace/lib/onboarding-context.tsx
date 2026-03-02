import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type AuthMethod = 'email' | 'google' | null;

type OnboardingData = {
  authMethod: AuthMethod;
  name: string;
  collegeName: string;
  email: string;
  gradYear: string;
  avatarUrl: string;
  emailVerified: boolean;
};

type OnboardingContextValue = {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  reset: () => void;
};

const defaultData: OnboardingData = {
  authMethod: null,
  name: '',
  collegeName: '',
  email: '',
  gradYear: '',
  avatarUrl: '',
  emailVerified: false,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      data,
      update: (patch) => setData((prev) => ({ ...prev, ...patch })),
      reset: () => setData(defaultData),
    }),
    [data],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
