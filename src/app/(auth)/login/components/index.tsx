"use client";
import { Button } from "@/components/ui/button";
import { LoginData, LoginSchema } from "@/zod/schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";


const LoginForm = () => {
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/dashboard";
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange", // Real-time validation
  });

  // Watch form values for better UX feedback
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Clear messages after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl,
      });

      if (!response?.error) {
        setSuccess("Login berhasil! Mengalihkan...");
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      } else {
        if (response.error === "CredentialsSignin") {
          setError("Email atau password tidak valid. Silakan periksa kembali.");
        } else {
          setError("Terjadi kesalahan saat login. Silakan coba lagi.");
        }
      }
    } catch (error) {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email / NIP
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email atau NIP Anda"
              {...register("email")}
              className={`pl-10 h-12 ${
                errors.email 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                  : emailValue && !errors.email 
                    ? "border-green-500 focus:border-green-500 focus:ring-green-200" 
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              disabled={isSubmitting}
            />
            {emailValue && !errors.email && (
              <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password Anda"
              {...register("password")}
              className={`pl-10 pr-10 h-12 ${
                errors.password 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                  : passwordValue && !errors.password 
                    ? "border-green-500 focus:border-green-500 focus:ring-green-200" 
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Memproses...
            </>
          ) : (
            "Masuk ke Sistem"
          )}
        </Button>

        {/* Separator */}
        <div className="relative">
          <Separator className="my-6" />
          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-500">
            Butuh bantuan?
          </span>
        </div>

        {/* Help Link */}
        <div className="text-center">
          <Link
            href="tel:+62-21-5201590"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            <Phone className="h-4 w-4" />
            Hubungi Administrator
          </Link>
          <p className="text-xs text-slate-500 mt-2">
            Senin - Jumat, 08:00 - 17:00 WIB
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
