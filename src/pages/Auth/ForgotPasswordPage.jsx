import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import FormField, { inputClassName } from "@/components/forms/FormField";
import Button from "@/components/ui/Button";
import LogoMark from "@/components/common/LogoMark";
import { forgotPasswordSchema } from "@/utils/schemas/authSchema";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  const { showToast } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await forgotPassword(values.email);
      setIsSubmitted(true);
      showToast("Reset link sent to your email!", "success");
    } catch (err) {
      showToast(err.message || "Failed to process request", "error");
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
          <h2 className="text-xl font-semibold text-text-primary">Forgot password?</h2>
          <p className="mt-1 text-xs text-text-tertiary">No worries, we&apos;ll send you instructions to reset it.</p>
        </div>

        {/* Card Form Container */}
        <div className="rounded-card border border-border bg-surface p-6 shadow-xl backdrop-blur-md">
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Check your email</h3>
              <p className="mt-1 text-xs text-text-tertiary max-w-xs">
                We have sent password reset instructions to your email address.
              </p>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
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

              <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="mt-2 w-full justify-center">
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
