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
    mutationFn: (userId: string) => apiRequest(`/api/dev/switch-role`, {
      method: "POST",
      body: { userId }
    }),
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
