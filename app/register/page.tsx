'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api-config'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate email domain
        if (!email.endsWith('@gmail.com')) {
            setError('Only @gmail.com email addresses are allowed')
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Registration failed")
            }

            // Immediately login the user after registration
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const benefits = [
        'Track all your donations in one place',
        'Get blockchain-verified receipts',
        'Support verified NGOs worldwide',
    ]

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 mesh-gradient" />
            <div className="absolute top-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-primary animate-bounce-subtle" />
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-accent animate-bounce-subtle" style={{ animationDelay: '1s' }} />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl shadow-primary/20">
                            <Heart className="h-7 w-7 text-primary" />
                        </div>
                        <div className="text-left">
                            <span className="text-2xl font-bold gradient-text">NGO Fund</span>
                            <p className="text-xs text-muted-foreground">Transparent Giving</p>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1.5 text-xs font-medium text-accent bg-accent/10 mb-4">
                            <Sparkles className="h-3 w-3 mr-2" />
                            Join 10,000+ Donors
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">Create your account</h2>
                        <p className="text-muted-foreground">
                            Start your journey of making a difference
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="space-y-2">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="text-muted-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-center gap-3 border border-destructive/20">
                                <div className="size-8 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">!</span>
                                </div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full pl-16 pr-4 py-4 bg-muted/50 border-2 border-border/50 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary transition-all"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full pl-16 pr-4 py-4 bg-muted/50 border-2 border-border/50 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary transition-all"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-primary" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-16 pr-14 py-4 bg-muted/50 border-2 border-border/50 rounded-xl text-base focus:outline-none focus:ring-0 focus:border-primary transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-gradient text-white h-14 text-base font-semibold rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    Create Account
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50">
                        <p className="text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom decoration */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}
