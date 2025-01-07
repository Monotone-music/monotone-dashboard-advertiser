import { useMutation } from "@tanstack/react-query";
import { signUp } from "../authService";
import { ISignUpForm } from "@/interface/AuthState";

export const useSignUpMutation = () => {
    return useMutation({
      mutationFn: (data: ISignUpForm) => signUp(data),
    });
  };