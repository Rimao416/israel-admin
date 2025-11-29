// hooks/invites/useInvites.ts
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInviteStore } from '@/store/inviteStore';
import { getInvites } from '@/services/invite.service';

interface UseInvitesOptions {
  tableId?: string;
}

export const useInvites = (options?: UseInvitesOptions) => {
  const { invites, setInvites, setError, setLoading } = useInviteStore();

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['invites', options?.tableId],
    queryFn: () => getInvites(options?.tableId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  useEffect(() => {
    if (data) {
      const formattedData = data.map(invite => ({
        ...invite,
        createdAt: new Date(invite.createdAt),
        updatedAt: new Date(invite.updatedAt),
      }));
      setInvites(formattedData);
    }
  }, [data, setInvites]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      setError(message);
    }
  }, [error, setError]);

  return {
    data: invites,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

// Hook pour les invités d'une table spécifique
export const useTableInvites = (tableId: string) => {
  return useInvites({ tableId });
};

