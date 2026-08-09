import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import LogoMark from "@/components/common/LogoMark";
import { resetPasswordSchema } from "@/utils/schemas/authSchema";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "mock-reset-token";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await resetPassword(token, values.password);
      setIsSuccess(true);
      showToast("Password updated successfully!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showToast(err.message || "Failed to reset password", "error");
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
          <h2 className="text-xl font-semibold text-text-primary">Set new password</h2>
          <p className="mt-1 text-xs text-text-tertiary">Your new password must be different from previous passwords.</p>
        </div>

        {/* Card Form Container */}
        <div className="rounded-card border border-border bg-surface p-6 shadow-xl backdrop-blur-md">
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Password reset!</h3>
              <p className="mt-1 text-xs text-text-tertiary">Your password has been successfully reset. Redirecting to login...</p>
              <Link to="/login" className="mt-4 text-xs font-medium text-accent hover:underline">
                Click here to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField label="New Password" error={errors.password?.message}>
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

              <FormField label="Confirm New Password" error={errors.confirmPassword?.message}>
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
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>

              <div className="mt-4 text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-text-primary">
                  <ArrowLeft size={13} /> Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
