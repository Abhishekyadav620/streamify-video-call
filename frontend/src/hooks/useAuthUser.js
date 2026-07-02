import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  // Add some debugging
  console.log("useAuthUser - isLoading:", authUser.isLoading);
  console.log("useAuthUser - data:", authUser.data);
  console.log("useAuthUser - authUser:", authUser.data?.user);

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;