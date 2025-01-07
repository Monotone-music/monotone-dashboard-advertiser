import styles from "./styles.module.scss";
import AuthInput from "../authInput/AuthInput";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/hooks/use-toast"
import "react-toastify/dist/ReactToastify.css";
import BeatLoader from "react-spinners/BeatLoader";
import { LoginData, LoginSchema } from "@/interface/Login";
import { useNavigate } from "react-router-dom";
import {useAuthStore} from "@/store/useAuthStore";
import { useSignInMutation } from "@/service/mutations/signInMutations";

const AuthForm = () => {
  const {error} = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: yupResolver(LoginSchema) });

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    signInMutation.mutate(data, {
      onSuccess: () => {
        toast({
          variant: "default",
          duration: 3000,
          title: "Sign in successfully",
          description: "Have a nice day!",
          className: styles['toast-success']
        })
        navigate(`/adver/overview`, {replace: true});
      },

      onError: ()=> {
        toast({
          variant: "destructive",
          duration: 3000,
          title: error || "Invalid Credentials",
          description: "Please try again your username or password"
        })
      }
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
   <div className={styles["forgot-password"]}>
        <span> Don't have account? </span>
        <a href="/auth/sign-up" className={styles.link}>
          Sign up now
        </a>
      </div>

      <Button
        className={styles["submit-btn"]}
        disabled={signInMutation.isPending}
      >
        {signInMutation.isPending ? <BeatLoader color="#FFFFFF" /> : "Sign in"}
      </Button>
    </form>
  );
};

export default AuthForm;
