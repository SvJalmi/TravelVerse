import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserInteraction {
  action: 'view' | 'like' | 'save' | 'share' | 'ar_view' | 'vr_experience';
  destinationId?: string;
  duration?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface UserInteractionContextType {
  trackInteraction: (interaction: UserInteraction) => void;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export function UserInteractionProvider({ children }: { children: ReactNode }) {
  const trackMutation = useMutation({
    mutationFn: (interaction: UserInteraction) => 
      apiRequest('/api/interactions', {
        method: 'POST',
        body: JSON.stringify({
          ...interaction,
          sessionId: getSessionId(),
          timestamp: new Date(),
        }),
      }),
    onError: (error) => {
      console.warn('Failed to track interaction:', error);
    },
  });

  const trackInteraction = useCallback(
    (interaction: UserInteraction) => {
      trackMutation.mutate(interaction);
    },
    [trackMutation]
  );

  return (
    <UserInteractionContext.Provider value={{ trackInteraction }}>
      {children}
    </UserInteractionContext.Provider>
  );
}

export function useUserInteraction() {
  const context = useContext(UserInteractionContext);
  if (context === undefined) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
}

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('travel-session-id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('travel-session-id', sessionId);
  }
  return sessionId;
}