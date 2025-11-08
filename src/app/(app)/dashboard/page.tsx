"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockSubmissions = [
  {
    id: "1",
    date: "2024-05-18",
    bountyTitle: "Kitchen - Making Coffee",
    status: "Approved",
    qualityScore: "4.9/5.0",
    reward: 25.0,
  },
  {
    id: "2",
    date: "2024-05-17",
    bountyTitle: "Outdoor - Crossing a Street",
    status: "Approved",
    qualityScore: "4.7/5.0",
    reward: 15.0,
  },
  {
    id: "3",
    date: "2024-05-16",
    bountyTitle: "Assembly - LEGO Car",
    status: "Pending",
    qualityScore: null,
    reward: 30.0,
  },
  {
    id: "4",
    date: "2024-05-15",
    bountyTitle: "Kitchen - Washing Dishes",
    status: "Rejected",
    qualityScore: "2.1/5.0",
    reward: 0.0,
  },
];

export default function DashboardPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header - Full Width */}
      <header className="py-8">
        <div className="flex flex-col gap-2">
          <h1 className="leading-tight tracking-tight">
            <span className="text-gray-900 font-bold text-2xl">Welcome back,</span>
            <br />
            <span className="text-red-500 font-black text-5xl inline-block mt-2">Here's a preview [coming soon...]</span>
          </h1>
          <p className="text-gray-600 text-base font-normal leading-normal">
            Here's a summary of your creator activity.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
              <p className="text-gray-600 text-sm font-medium leading-normal">Total Submissions</p>
              <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">128</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
              <p className="text-gray-600 text-sm font-medium leading-normal">Approved Videos</p>
              <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">115</p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
              <p className="text-gray-600 text-sm font-medium leading-normal">Lifetime Earnings</p>
              <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">$1,250</p>
            </div>
          </div>

          {/* KPI Section */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue by Category - Donut Chart */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)] xl:col-span-1">
              <p className="text-gray-900 text-base font-medium leading-normal">Revenue by Category</p>
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-current text-gray-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                  />
                  <path
                    className="stroke-current text-red-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="60, 100"
                    strokeWidth="3"
                  />
                  <path
                    className="stroke-current text-amber-400"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-60"
                    strokeWidth="3"
                  />
                  <path
                    className="stroke-current text-emerald-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">$580</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-600">Kitchen Tasks</span>
                  </div>
                  <span className="font-medium text-gray-900">60%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="text-gray-600">Outdoor</span>
                  </div>
                  <span className="font-medium text-gray-900">25%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-600">Assembly</span>
                  </div>
                  <span className="font-medium text-gray-900">15%</span>
                </div>
              </div>
            </div>

            {/* Average Quality Score */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 p-6 bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)] xl:col-span-2">
              <p className="text-gray-900 text-base font-medium leading-normal">Average Quality Score</p>
              <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight truncate">4.8/5.0</p>
              <div className="flex gap-1">
                <p className="text-gray-600 text-sm font-normal leading-normal">Last 30 Days</p>
                <p className="text-emerald-500 text-sm font-medium leading-normal">+0.2</p>
              </div>
              <div className="flex-1 flex items-end mt-4">
                <svg fill="none" height="100" preserveAspectRatio="none" viewBox="0 0 472 100" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="sparkline-gradient" x1="0" x2="0" y1="0" y2="100">
                      <stop offset="0" stopColor="#ef4444" stopOpacity="0.2"></stop>
                      <stop offset="1" stopColor="#ef4444" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M0 69C18.1538 69 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 83 108.923 83C127.077 83 127.077 33 145.231 33C163.385 33 163.385 71 181.538 71C199.692 71 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 91 290.462 91C308.615 91 308.615 99 326.769 99C344.923 99 344.923 1 363.077 1C381.231 1 381.231 51 399.385 51C417.538 51 417.538 89 435.692 89C453.846 89 453.846 25 472 25" fill="url(#sparkline-gradient)" stroke="#ef4444" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </section>

          {/* Submissions Table */}
          <section className="bg-white border border-gray-200 rounded-xl shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-xs text-gray-600 uppercase">Date</TableHead>
                    <TableHead className="text-xs text-gray-600 uppercase">Bounty</TableHead>
                    <TableHead className="text-xs text-gray-600 uppercase">Status</TableHead>
                    <TableHead className="text-xs text-gray-600 uppercase">Quality</TableHead>
                    <TableHead className="text-xs text-gray-600 uppercase text-right">Reward</TableHead>
                    <TableHead className="text-xs text-gray-600 uppercase text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="border-b border-gray-200 hover:bg-background-light">
                      <TableCell className="text-gray-900">{submission.date}</TableCell>
                      <TableCell className="font-medium text-gray-900">{submission.bountyTitle}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(submission.status)} border-0`}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900">{submission.qualityScore || "-"}</TableCell>
                      <TableCell className="text-right text-gray-900">${submission.reward.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Link href={`/validate/${submission.id}`} className="text-red-500 hover:underline font-medium">
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 flex justify-end">
              <Link href="/bounties" className="text-sm font-medium text-red-500 hover:underline">
                View all submissions →
              </Link>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          {/* Tier Progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 justify-between">
                <p className="text-gray-900 text-base font-medium leading-normal">Tier Progress: Pro Creator</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">75%</p>
              </div>
              <div className="rounded-full bg-gray-200 h-2.5">
                <div className="h-2.5 rounded-full bg-red-500" style={{ width: "75%" }}></div>
              </div>
              <p className="text-gray-600 text-sm font-normal leading-normal">2500 XP to next level</p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Badges</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined !text-4xl">rocket_launch</span>
                </div>
                <p className="text-xs text-gray-600">Fast Starter</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined !text-4xl">local_fire_department</span>
                </div>
                <p className="text-xs text-gray-600">Hot Streak</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined !text-4xl">military_tech</span>
                </div>
                <p className="text-xs text-gray-600">Top Creator</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined !text-4xl">verified</span>
                </div>
                <p className="text-xs text-gray-600">Quality Star</p>
              </div>
            </div>
          </div>

          {/* Recommended Bounties */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Bounties</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <Link href="/bounties/1" className="font-medium text-gray-900 hover:underline">
                    Driving - City Navigation
                  </Link>
                  <p className="text-sm text-gray-600">Up to $50</p>
                </div>
                <Link href="/bounties/1" className="text-sm font-medium text-red-500 hover:underline">
                  Start
                </Link>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <Link href="/bounties/2" className="font-medium text-gray-900 hover:underline">
                    Office - Using a Printer
                  </Link>
                  <p className="text-sm text-gray-600">Up to $20</p>
                </div>
                <Link href="/bounties/2" className="text-sm font-medium text-red-500 hover:underline">
                  Start
                </Link>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <Link href="/bounties/3" className="font-medium text-gray-900 hover:underline">
                    Gardening - Watering Plants
                  </Link>
                  <p className="text-sm text-gray-600">Up to $15</p>
                </div>
                <Link href="/bounties/3" className="text-sm font-medium text-red-500 hover:underline">
                  Start
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

