import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: false, // Temporarily disable auth checks
  });

  return {
    user: { id: "demo", email: "demo@example.com", firstName: "Demo", lastName: "User" }, // Demo user for testing
    isLoading: false,
    isAuthenticated: true, // Temporarily always authenticated for demo
  };
}
