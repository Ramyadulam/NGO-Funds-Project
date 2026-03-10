'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Shield, Menu, X, Heart, DollarSign, LayoutDashboard, User, LogOut, Sparkles, ChevronDown } from 'lucide-react'
import { WalletConnector } from './wallet-connector'

interface UserData {
    name: string
    email: string
    role: 'user' | 'admin'
}

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setMounted(true)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user", e)
            }
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Listen for storage changes (for when user logs in/out in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch (e) {
                    setUser(null)
                }
            } else {
                setUser(null)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
        setMobileMenuOpen(false)
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Donate', href: '/donate', icon: Heart },
        { name: 'My Donations', href: '/my-donations', icon: DollarSign },
    ]

    const isAuthPage = pathname === '/login' || pathname === '/register'

    if (isAuthPage) return null

    return (
        <nav className={cn(
            "sticky top-0 z-50 transition-all duration-300",
            scrolled
                ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
                : "bg-transparent"
        )}>
            <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/20 group-hover:shadow-primary/30">
                            <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold gradient-text">NGO Fund</span>
                            <p className="text-[10px] text-muted-foreground -mt-0.5">Transparent Giving</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                    pathname === item.href
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                                {pathname === item.href && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                        {mounted && user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                className={cn(
                                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                    pathname === '/admin'
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Shield className="h-4 w-4" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Buttons / User Info */}
                    <div className="hidden md:flex items-center gap-4">
                        <WalletConnector />
                        {mounted && user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/50 border border-border/50">
                                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground leading-tight">
                                            {user.name}
                                        </span>
                                        {user.role === 'admin' && (
                                            <span className="text-[10px] text-primary font-medium flex items-center gap-1">
                                                <Sparkles className="h-2.5 w-2.5" />
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all group"
                                >
                                    <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="rounded-xl px-5 hover:bg-muted/50 transition-all">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="btn-gradient text-white rounded-xl px-5 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border/50 mt-4 pt-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center transition-colors",
                                    pathname === item.href ? "bg-primary/20" : "bg-muted/50"
                                )}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                {item.name}
                            </Link>
                        ))}
                        {mounted && user?.role === 'admin' && (
                            <Link
                                href="/admin"
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    pathname === '/admin'
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "size-10 rounded-xl flex items-center justify-center transition-colors",
                                    pathname === '/admin' ? "bg-primary/20" : "bg-muted/50"
                                )}>
                                    <Shield className="h-5 w-5" />
                                </div>
                                Admin
                            </Link>
                        )}

                        <div className="border-t border-border/50 pt-4 mt-4">
                            <div className="px-4 pb-4">
                                <WalletConnector />
                            </div>
                            {mounted && user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                            {user.role === 'admin' && (
                                                <span className="text-[10px] text-primary font-medium flex items-center gap-1 mt-0.5">
                                                    <Sparkles className="h-2.5 w-2.5" />
                                                    Admin Account
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-xl h-12 border-destructive/30 text-destructive hover:bg-destructive/10 transition-all"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-3 px-4">
                                    <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="outline" size="sm" className="w-full rounded-xl h-12">Log in</Button>
                                    </Link>
                                    <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                        <Button size="sm" className="w-full rounded-xl h-12 btn-gradient text-white shadow-lg">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Sign up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
