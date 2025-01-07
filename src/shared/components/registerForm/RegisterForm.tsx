import styles from "./styles.module.scss";
import { BeatLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import AuthInput from "../authInput/AuthInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { RegisterData, RegisterSchema } from "@/interface/Register";
import { useSignUpMutation } from "@/service/mutations/signUpMutation";

const RegisterForm = () => {
  const { error } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({ resolver: yupResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<RegisterData> = (data) => {
    signUpMutation.mutate(data, {
      onSuccess: () => {
        toast({
          variant: "default",
          duration: 3000,
          title: "Sign up successfully",
          description: "Please sign in with your newest account!",
          className: styles["toast-success"],
        });
        navigate(`/auth/sign-in`, { replace: true });
      },

      onError: () => {
        toast({
          variant: "destructive",
          duration: 3000,
          title: error || "Sign up failed!",
          description: "Please try again your username or password",
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <AuthInput
        label="Username"
        id="username"
        type="username"
        placeholder="Enter your username"
        register={register}
        error={errors.username?.message}
      />

      <AuthInput
        label="Password"
        id="password"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password?.message}
      />
      <AuthInput
        label="Email"
        id="email"
        type="email"
        placeholder="Enter your email"
        register={register}
        error={errors.email?.message}
      />
      <AuthInput
        label="Name"
        id="displayName"
        type="text"
        placeholder="Enter your name"
        register={register}
        error={errors.displayName?.message}
      />
      <div className={styles["forgot-password"]}>
        <span> Already have an account? </span>
        <a href="/auth/sign-in" className={styles.link}>
          Sign in now
        </a>
      </div>

      <Button
        className={styles["submit-btn"]}
        disabled={signUpMutation.isPending}
      >
        {signUpMutation.isPending ? <BeatLoader color="#FFFFFF" /> : "Sign up"}
      </Button>
    </form>
  );
};

export default RegisterForm;
