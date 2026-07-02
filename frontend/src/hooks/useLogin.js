import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.log("Login error:", error);
      console.log("Error response:", error.response);
    }
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;