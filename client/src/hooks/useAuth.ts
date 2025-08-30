import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const switchRole = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch('/api/dev/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to switch role');
      return response.json();
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["/api/auth/user"], newUser);
      queryClient.invalidateQueries();
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    switchRole: switchRole.mutate,
    isSwitching: switchRole.isPending,
  };
}
