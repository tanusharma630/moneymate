import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import LogoMark from "@/components/common/LogoMark";
import { loginSchema } from "@/utils/schemas/authSchema";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "anvi@example.com",
      password: "Password123",
      rememberMe: true,
    },
  });

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password, values.rememberMe);
      showToast("Welcome back!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message || "Failed to log in", "error");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2.5">
            <LogoMark size={34} />
            <span className="text-xl font-bold tracking-tight text-text-primary">MoneyMate</span>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">Welcome back</h2>
          <p className="mt-1 text-xs text-text-tertiary">Sign in to your account to continue managing your finances.</p>
        </div>

        {/* Card Form Container */}
        <div className="rounded-card border border-border bg-surface p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Email Address" error={errors.email?.message}>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`${inputClassName({ hasError: !!errors.email })} pl-9`}
                  {...register("email")}
                />
              </div>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClassName({ hasError: !!errors.password })} pl-9 pr-10`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-tertiary hover:text-text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-accent"
                  {...register("rememberMe")}
                />
                Remember me
              </label>

              <Link to="/forgot-password" className="font-medium text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="mt-2 w-full justify-center">
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-text-tertiary">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
