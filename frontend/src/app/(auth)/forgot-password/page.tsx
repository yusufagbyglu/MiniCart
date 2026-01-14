"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/auth-service"

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword({ email: data.email })
      setIsSubmitted(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md border-primary/20 shadow-xl shadow-primary/5">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Check Your Email</h2>
            <p className="mb-8 text-muted-foreground/80 leading-relaxed">
              We've sent a password reset link to <span className="font-semibold text-foreground">your email address</span>. Please check your inbox and follow the instructions.
            </p>
            <Button asChild className="w-full h-11 text-base font-semibold">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-primary/20 shadow-xl shadow-primary/5">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight">Forgot Password?</CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">Enter your email and we'll send you a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <Button type="submit" className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
