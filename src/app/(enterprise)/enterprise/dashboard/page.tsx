"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, TrendingUp } from "lucide-react";

const bounties = [
  {
    id: 1,
    title: "Kitchen utensil interaction",
    status: "Active",
    submissions: 1204,
    dataCollected: 75.2,
    dataCollectedPercent: 85,
    created: "2023-10-26",
    approved: 1150,
    approvalRate: 95.5,
    trend: "+15.2%",
  },
  {
    id: 2,
    title: "Navigating office hallways",
    status: "Paused",
    submissions: 850,
    dataCollected: 60.1,
    dataCollectedPercent: 68,
    created: "2023-09-15",
    approved: 800,
    approvalRate: 94.1,
    trend: "+8.5%",
  },
  {
    id: 3,
    title: "Assembling furniture",
    status: "Completed",
    submissions: 2500,
    dataCollected: 100.0,
    dataCollectedPercent: 100,
    created: "2023-08-01",
    approved: 2400,
    approvalRate: 96.0,
    trend: "+12.3%",
  },
  {
    id: 4,
    title: "Morning coffee routine",
    status: "Active",
    submissions: 312,
    dataCollected: 25.0,
    dataCollectedPercent: 28,
    created: "2023-11-05",
    approved: 290,
    approvalRate: 92.9,
    trend: "+22.1%",
  },
];

export default function EnterpriseDashboard() {
  const [selectedBounty, setSelectedBounty] = useState(bounties[0]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "Paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Paused
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black leading-tight tracking-tighter text-gray-900 md:text-4xl">
            Your Bounties
          </h1>
          <p className="text-base font-normal leading-normal text-gray-600">
            Manage, track, and create new data collection bounties.
          </p>
        </div>
        <Link href="/enterprise/new">
          <Button variant="enterprise" className="h-10 px-4">
            <Plus className="h-4 w-4 mr-2" />
            Create New Bounty
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2 xl:col-span-3">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounty Title
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Collected
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bounties.map((bounty) => (
                  <TableRow
                    key={bounty.id}
                    className={`border-b border-gray-200 cursor-pointer ${
                      selectedBounty.id === bounty.id
                        ? "bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedBounty(bounty)}
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bounty.title}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(bounty.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {bounty.submissions.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${bounty.dataCollectedPercent}%` }}
                          ></div>
                        </div>
                        <p className="text-gray-900 text-sm font-medium">
                          {bounty.dataCollected} Hours
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {bounty.created}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 xl:col-span-1">
          <div className="sticky top-24 flex flex-col gap-6">
            <Card className="rounded-xl border border-gray-200 bg-white shadow-[0_0_12px_rgba(0,0,0,0.08)] p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {selectedBounty.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Details and statistics for the selected bounty.
              </p>

              <div className="flex flex-col gap-2 mb-6">
                <p className="text-base font-medium leading-normal text-gray-900">
                  Data Collection Rate
                </p>
                <p className="text-3xl font-bold leading-tight tracking-tight text-gray-900 truncate">
                  {selectedBounty.dataCollected} Hours
                </p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm font-normal leading-normal text-gray-600">
                    Last 30 Days
                  </p>
                  <p className="text-sm font-medium leading-normal text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {selectedBounty.trend}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4 mb-6">
                <svg
                  fill="none"
                  height="148"
                  preserveAspectRatio="none"
                  viewBox="-3 0 478 150"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="paint0_linear_chart"
                      x1="236"
                      x2="236"
                      y1="1"
                      y2="149"
                    >
                      <stop stopColor="#22c55e" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                    fill="url(#paint0_linear_chart)"
                  />
                  <path
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                    stroke="#22c55e"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* Stats */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between gap-x-6 py-2">
                  <p className="text-sm font-normal leading-normal text-gray-600">
                    Total Submissions
                  </p>
                  <p className="text-sm font-medium leading-normal text-gray-900 text-right">
                    {selectedBounty.submissions.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between gap-x-6 py-2">
                  <p className="text-sm font-normal leading-normal text-gray-600">
                    Approved Submissions
                  </p>
                  <p className="text-sm font-medium leading-normal text-gray-900 text-right">
                    {selectedBounty.approved.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between gap-x-6 py-2">
                  <p className="text-sm font-normal leading-normal text-gray-600">
                    Approval Rate
                  </p>
                  <p className="text-sm font-medium leading-normal text-gray-900 text-right">
                    {selectedBounty.approvalRate}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link href={`/enterprise/bounties/${selectedBounty.id}/submissions`}>
                  <Button variant="enterprise" className="w-full h-10">
                    View Submissions
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-10 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

