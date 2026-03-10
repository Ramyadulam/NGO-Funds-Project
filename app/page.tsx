'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Shield, Layers, Zap, ArrowRight, Heart, Globe, Users, TrendingUp, CheckCircle2, Sparkles, Lock, Eye, Star, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ngoAPI } from '@/lib/api'

export default function LandingPage() {
  const [stats, setStats] = useState<{ totalNGOs: number; totalRaised: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const fetchStats = async () => {
      try {
        const data = await ngoAPI.getStats()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="orb orb-1 animate-float" style={{ animationDelay: '0s' }} />
        <div className="orb orb-2 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-primary animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-accent animate-bounce-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 rounded-full bg-primary/60 animate-bounce-subtle" style={{ animationDelay: '1.5s' }} />

        <div className={`relative max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center space-y-8">
            {/* Animated badge */}
            <div className="inline-flex items-center rounded-full border border-primary/30 px-5 py-2 text-sm font-medium text-primary bg-primary/10 backdrop-blur-md shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 hover:scale-105 cursor-default">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Blockchain Verified Platform
              <ChevronRight className="h-4 w-4 ml-2" />
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground text-balance leading-tight">
              <span className="block">Transparent NGO</span>
              <span className="block gradient-text">Fund Management</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
              Built on blockchain technology to ensure complete transparency and trust.
              Every donation is tracked, verified, and accounted for on an{' '}
              <span className="text-primary font-semibold">immutable ledger</span>.
            </p>

            <div className="pt-8 flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <Button size="lg" className="btn-gradient text-white rounded-full px-8 py-6 text-lg gap-2 group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Donating
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg group border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                  <Eye className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse NGOs
                </Button>
              </Link>
            </div>

            {/* Live Stats with animations */}
            {stats && (
              <div className="pt-16 flex justify-center gap-6 md:gap-12">
                <div className="glass rounded-2xl p-6 text-center min-w-[140px] hover:scale-105 transition-all duration-300 shadow-xl">
                  <p className="text-4xl md:text-5xl font-bold gradient-text">{stats.totalNGOs}+</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Active NGOs</p>
                </div>
                <div className="glass rounded-2xl p-6 text-center min-w-[140px] hover:scale-105 transition-all duration-300 shadow-xl">
                  <p className="text-4xl md:text-5xl font-bold text-primary">
                    ${(stats.totalRaised / 1000).toFixed(0)}K+
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Funds Raised</p>
                </div>
                <div className="glass rounded-2xl p-6 text-center min-w-[140px] hover:scale-105 transition-all duration-300 shadow-xl">
                  <p className="text-4xl md:text-5xl font-bold text-accent">100%</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Transparent</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce-subtle">
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center">
            <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-sm text-primary bg-primary/5 mb-6">
              <Star className="h-3 w-3 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built for <span className="gradient-text">Trust & Impact</span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              We combine philanthropy with cutting-edge blockchain technology to ensure your donations make the maximum impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass border-0 shadow-2xl card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <CardHeader className="relative">
                <div className="size-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">100% Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  All transactions are recorded on a public blockchain ledger that anyone can verify at any time. No hidden fees, no surprises.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass border-0 shadow-2xl card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
              <CardHeader className="relative">
                <div className="size-16 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <Lock className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Immutable Records</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Once a donation is made, the record cannot be altered or deleted, ensuring complete accountability and trust.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass border-0 shadow-2xl card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
              <CardHeader className="relative">
                <div className="size-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Track how funds are being moved and utilized by NGOs in real-time with our transparency dashboard.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center rounded-full border border-accent/20 px-4 py-1.5 text-sm text-accent bg-accent/5 mb-6">
              <Sparkles className="h-3 w-3 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-xl">Simple steps to make a difference</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Account', description: 'Sign up for free and join our community of changemakers', icon: Users, color: 'primary' },
              { step: '02', title: 'Browse NGOs', description: 'Explore verified organizations aligned with your values', icon: Globe, color: 'blue-500' },
              { step: '03', title: 'Make Donation', description: 'Contribute any amount securely through our platform', icon: Heart, color: 'accent' },
              { step: '04', title: 'Track Impact', description: 'Monitor how your donations are being utilized in real-time', icon: TrendingUp, color: 'primary' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                {/* Connection line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}

                <div className="relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-black text-muted/10 group-hover:text-primary/10 transition-colors duration-500">
                    {item.step}
                  </div>
                  <div className="relative pt-8">
                    <div className={`size-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-${item.color}/20 to-${item.color}/5 flex items-center justify-center text-${item.color} shadow-xl shadow-${item.color}/10 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { label: 'Blockchain Verified', icon: Shield },
              { label: 'SSL Encrypted', icon: Lock },
              { label: 'GDPR Compliant', icon: CheckCircle2 },
              { label: '24/7 Support', icon: Users },
              { label: 'Tax Deductible', icon: CheckCircle2 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-default group">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="orb orb-3 opacity-50" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-[2rem] p-12 md:p-16 shadow-2xl border border-white/20">
            <div className="inline-flex items-center rounded-full border border-primary/30 px-4 py-1.5 text-sm text-primary bg-primary/10 mb-8">
              <Heart className="h-3 w-3 mr-2 animate-pulse" />
              Join Our Mission
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="gradient-text">Make a Difference</span>?
            </h2>
            <p className="text-muted-foreground text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of donors who trust our platform for transparent, accountable giving.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register">
                <Button size="lg" className="btn-gradient text-white rounded-full px-10 py-6 text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group">
                  <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Start Donating Today
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300">
                  Explore Causes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">NGO Fund</span>
                <p className="text-xs text-muted-foreground">Transparent Giving</p>
              </div>
            </Link>

            <div className="flex gap-8 text-sm">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary font-medium transition-colors">Dashboard</Link>
              <Link href="/donate" className="text-muted-foreground hover:text-primary font-medium transition-colors">Donate</Link>
              <Link href="/my-donations" className="text-muted-foreground hover:text-primary font-medium transition-colors">My Donations</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 NGO Fund Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
