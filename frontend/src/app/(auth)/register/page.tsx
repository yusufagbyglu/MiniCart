"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useUserStore } from "@/store/user-store"
import { authService } from "@/services/auth-service"

interface RegisterFormData {
  name: string
  email: string
  password: string
  password_confirmation: string
  agreeToTerms: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser, setToken } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch("password")

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })
      setToken(response.token)
      setUser(response.user)
      toast({ title: "Account created!", description: "Welcome to MiniCart" })
      router.push("/")
    } catch (error: any) {
      let errorMessage = "Failed to create account"

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        errorMessage = Object.values(errors).flat().join(". ")
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-primary/20 shadow-xl shadow-primary/5">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">Join MiniCart and start shopping</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="name"
                placeholder="John Doe"
                className="pl-10 h-11 bg-muted/30 focus-visible:ring-primary/30"
                {...register("name", { required: "Full name is required" })}
              />
            </div>
            {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10 h-11 bg-muted/30 focus-visible:ring-primary/30"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10 h-11 bg-muted/30 focus-visible:ring-primary/30"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm your password"
                className="pl-10 h-11 bg-muted/30 focus-visible:ring-primary/30"
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-sm font-medium text-destructive">{errors.password_confirmation.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2.5 pt-1">
            <Checkbox id="agreeToTerms" {...register("agreeToTerms")} className="mt-0.5" />
            <Label htmlFor="agreeToTerms" className="text-sm font-normal text-muted-foreground leading-tight cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-primary font-medium hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary font-medium hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
