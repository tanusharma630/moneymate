import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Check } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import LogoMark from "@/components/common/LogoMark";
import { signupSchema } from "@/utils/schemas/authSchema";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  // Real-time password requirement checks
  const pwdChecks = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  };

  const onSubmit = async (values) => {
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      showToast("Account created successfully! Welcome to MoneyMate.", "success");
      navigate("/", { replace: true });
    } catch (err) {
      showToast(err.message || "Failed to create account", "error");
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
          <h2 className="text-xl font-semibold text-text-primary">Create your account</h2>
          <p className="mt-1 text-xs text-text-tertiary">Start tracking your income, budget, and savings goals today.</p>
        </div>

        {/* Card Form Container */}
        <div className="rounded-card border border-border bg-surface p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Full Name" error={errors.name?.message}>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                <input
                  type="text"
                  placeholder="Anvi Sharma"
                  className={`${inputClassName({ hasError: !!errors.name })} pl-9`}
                  {...register("name")}
                />
              </div>
            </FormField>

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

              {/* Password complexity helper */}
              <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10.5px]">
                <div className={`flex items-center gap-1 ${pwdChecks.length ? "text-success" : "text-text-tertiary"}`}>
                  <Check size={11} /> At least 8 characters
                </div>
                <div className={`flex items-center gap-1 ${pwdChecks.uppercase ? "text-success" : "text-text-tertiary"}`}>
                  <Check size={11} /> One uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${pwdChecks.lowercase ? "text-success" : "text-text-tertiary"}`}>
                  <Check size={11} /> One lowercase letter
                </div>
                <div className={`flex items-center gap-1 ${pwdChecks.number ? "text-success" : "text-text-tertiary"}`}>
                  <Check size={11} /> One number
                </div>
              </div>
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-text-tertiary pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClassName({ hasError: !!errors.confirmPassword })} pl-9 pr-10`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-text-tertiary hover:text-text-primary"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="mt-2 w-full justify-center">
              {isSubmitting ? "Creating Account..." : "Create Account"}
              <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-text-tertiary">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
