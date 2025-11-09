"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import CardSwap, { Card } from '@/components/CardSwap'

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Animated Dot Pattern Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-[spin_120s_linear_infinite]" style={{ transformOrigin: 'center center' }}>
          <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dot-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="#d8d8da" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
          </svg>
        </div>
      </div>
      
      {/* Top NavBar */}
      <header className="sticky top-0 z-50 w-full bg-background-light/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4 text-gray-900">
            <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
            </svg>
            <h2 className="text-gray-900 text-lg font-bold">Pepper</h2>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/bounties"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Bounties
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors">
                    AJ
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 cursor-pointer bg-gray-50"
                >
                  <User className="h-4 w-4" />
                  <span>User Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/enterprise")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Enterprise Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-20 text-center md:py-32">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900 md:text-6xl">
                  Own your data. Power the future of robotics.
                </h1>
                <p className="text-lg text-gray-600 md:text-xl">
                  Record everyday tasks. Earn bounties. Help robots learn safely.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/bounties">
                  <Button size="lg" className="h-12 px-6 text-base">
                    Explore Bounties
                  </Button>
                </Link>
                <Link href="/enterprise">
                  <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                    For Enterprises
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Video Showcase Section */}
          <section className="pb-16 pt-4 md:pt-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                See It In Action
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Real POV videos from our community
              </p>
            </div>
            
            {/* Video Carousel */}
            <div className="container mx-auto max-w-5xl px-4 py-10">
              <div className="flex items-center justify-start left-[-35%] h-[250px] md:h-[500px]" style={{ position: 'relative'}}>
                <div style={{ width: '50%', maxWidth: '600px' }}>
                  {/* @ts-ignore */}
                  <CardSwap
                    cardDistance={200}
                    verticalDistance={185}
                    delay={3000}
                    pauseOnHover={false}
                    onCardClick={() => {}}
                  >
                {/* @ts-ignore */}
                <Card>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <source src="/video1.mp4" type="video/mp4" />
                  </video>
                </Card>
                {/* @ts-ignore */}
                <Card>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <source src="/video2.mp4" type="video/mp4" />
                  </video>
                </Card>
                {/* @ts-ignore */}
                <Card>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <source src="/video3.mp4" type="video/mp4" />
                  </video>
                </Card>
                {/* @ts-ignore */}
                <Card>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <source src="/video4.mp4" type="video/mp4" />
                  </video>
                </Card>
                {/* @ts-ignore */}
                <Card>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <source src="/video5.mp4" type="video/mp4" />
                  </video>
                </Card>
              </CardSwap>
                </div>
              </div>
            </div>

            {/* Static Video Grid */}
            {/* <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                {/* Video 1 */}
                {/* <div className="w-full">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <source src="/video1.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>  */}

                {/* Video 2 */}
                {/* <div className="w-full">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <source src="/video2.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div> */}

                {/* Video 3 */}
                {/* <div className="w-full">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <source src="/video3.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div> */}

                {/* Video 4 */}
                {/* <div className="w-full">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <source src="/video4.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div> */}
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-16 md:py-24">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                How It Works
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                A simple, rewarding process to contribute to AI.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <span className="material-symbols-outlined text-red-500 text-4xl">videocam</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">Record</h3>
                  <p className="text-gray-600">
                    Capture simple, everyday tasks using your phone's camera.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <span className="material-symbols-outlined text-red-500 text-4xl">upload</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">Submit</h3>
                  <p className="text-gray-600">
                    Easily and securely upload your videos through our platform.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_0_16px_rgba(0,0,0,0.12)]">
                <span className="material-symbols-outlined text-red-500 text-4xl">account_balance_wallet</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-900">Earn</h3>
                  <p className="text-gray-600">
                    Receive rewards and bounties for providing quality training data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trust & Safety Section */}
          <section id="trust-safety" className="py-16 md:py-24">
            <div className="flex flex-col gap-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Built on Trust &amp; Safety
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  We are committed to protecting your privacy and ensuring all data is handled securely and responsibly. Our platform includes robust data anonymization and content moderation.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
                  <span className="material-symbols-outlined text-red-500 text-3xl">shield_person</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-gray-900">Privacy First</h3>
                    <p className="text-gray-600">
                      Your data is anonymized to protect personal information and give you complete control.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
                  <span className="material-symbols-outlined text-red-500 text-3xl">verified_user</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-gray-900">Secure Moderation</h3>
                    <p className="text-gray-600">
                      All submissions are reviewed to ensure they meet our strict safety and quality guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof Section */}
          <section className="py-16 md:py-24">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Trusted By Leading Innovators
              </h2>
            </div>
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <div className="col-span-2 max-h-12 w-full flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition lg:col-span-1">
                <div className="text-gray-400 text-2xl font-bold">Company A</div>
              </div>
              <div className="col-span-2 max-h-12 w-full flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition lg:col-span-1">
                <div className="text-gray-400 text-2xl font-bold">Company B</div>
              </div>
              <div className="col-span-2 max-h-12 w-full flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition lg:col-span-1">
                <div className="text-gray-400 text-2xl font-bold">Company C</div>
              </div>
              <div className="col-span-2 max-h-12 w-full flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition sm:col-start-2 lg:col-span-1">
                <div className="text-gray-400 text-2xl font-bold">Company D</div>
              </div>
              <div className="col-span-2 col-start-2 max-h-12 w-full flex items-center justify-center grayscale opacity-60 hover:opacity-100 transition sm:col-start-auto lg:col-span-1">
                <div className="text-gray-400 text-2xl font-bold">Company E</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 relative z-10">
        <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex justify-center text-red-500 sm:justify-start">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" />
                </svg>
                <span className="font-bold text-lg text-gray-900">Pepper</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 lg:mt-0 lg:text-right">
              © 2024 Pepper. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
