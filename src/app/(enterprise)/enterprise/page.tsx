import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, TrendingUp, Lock } from "lucide-react";

export default function EnterprisePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Animated Dot Pattern Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-[spin_120s_linear_infinite]" style={{ transformOrigin: 'center center' }}>
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dot-pattern-enterprise" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#d8d8da" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern-enterprise)" />
          </svg>
        </div>
      </div>
      
      <main className="flex-1 relative z-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-20 text-center md:py-32">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900 md:text-6xl">
                  {/* <span className="text-green-500">Hyperscale</span> your data */}
                  Quality. Hyper-scaled.
                </h1>
                <p className="text-lg text-gray-600 md:text-xl">
                  Collect high-quality POV video data at scale with <span className="text-green-500 font-bold">Pepper</span>
                </p>
              </div>
            </div>
          </section>

          {/* Options Section */}
          <section className="py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Create Dataset */}
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <PlusCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle>Custom Data Contracts</CardTitle>
                  <CardDescription>
                    Post a bounty to collect custom pov video data for your specific use case
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Validate videos with AI pipeline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Quality scoring & rubric</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Custom acceptance criteria</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Full licensing control</span>
                    </li>
                  </ul>
                  <Link href="/enterprise/new">
                    <Button className="w-full" size="lg" variant="enterprise">
                      Create New
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Invest */}
              <Card className="h-full opacity-60">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    <Badge variant="secondary">
                      <Lock className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle>Invest in Platform</CardTitle>
                  <CardDescription>
                    Participate in platform governance and revenue sharing opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Platform token allocation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Governance voting rights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Revenue sharing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Early access to features</span>
                    </li>
                  </ul>
                  <Button className="w-full" size="lg" variant="enterprise" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Why Choose POV Bounties?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">AI-Powered Validation</h3>
                  <p className="text-gray-600">
                    6-stage validation pipeline ensures high-quality data: domain check, scene parsing, VLM classification, supervisory verification, LLM mapping, and quality scoring
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">Global Community</h3>
                  <p className="text-gray-600">
                    Access thousands of contributors ready to capture authentic first-person experiences across diverse scenarios and locations
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">Flexible Licensing</h3>
                  <p className="text-gray-600">
                    Choose from commercial, research, or custom licensing options to fit your specific data usage requirements
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

