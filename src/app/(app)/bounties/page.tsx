"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock bounties data
const mockBounties = [
  {
    id: "1",
    title: "Make a grilled cheese sandwich",
    company: "The Daily Grind",
    reward: 20,
    industry: "Culinary",
    difficulty: "Easy",
    duration: "10 mins",
    dueDate: "3 days",
    image: "https://plus.unsplash.com/premium_photo-1739906794633-71adada97314?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&?w=400&h=300&fit=crop",
    
    tags: ["#kitchen", "#cooking"],
  },
  {
    id: "9",
    title: "Do a bottle flip",
    company: "PepperTech",
    reward: 67,
    industry: "Sports",
    difficulty: "Easy",
    duration: "Flexible",
    dueDate: "4 hours",
    image: "https://images.unsplash.com/photo-1561041695-d2fadf9f318c?w=400&h=300&fit=crop",
    tags: ["#sports", "#bottleflip", "#hack"],
  },
  {
    id: "2",
    title: "Prepare a Caesar Salad",
    company: "CulinaryAI",
    reward: 50,
    industry: "Culinary",
    difficulty: "Easy",
    duration: "10 mins",
    dueDate: "3 days",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    tags: ["#kitchen", "#cooking"],
  },
  {
    id: "3",
    title: "Change a Tire",
    company: "AutoFix Inc.",
    reward: 250,
    industry: "Auto",
    difficulty: "Hard",
    duration: "45 mins",
    dueDate: "30 days",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    tags: ["#auto", "#tools"],
  },
  {
    id: "4",
    title: "Repot a Houseplant",
    company: "GreenThumb Bots",
    reward: 75,
    industry: "Gardening",
    difficulty: "Medium",
    duration: "15 mins",
    dueDate: "7 days",
    image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop",
    tags: ["#gardening", "#plants"],
  },
  {
    id: "5",
    title: "Bake Chocolate Chip Cookies",
    company: "CulinaryAI",
    reward: 100,
    industry: "Culinary",
    difficulty: "Medium",
    duration: "30 mins",
    dueDate: "5 days",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
    tags: ["#baking", "#cooking"],
  },
  {
    id: "6",
    title: "Set up a New Router",
    company: "ConnectNet",
    reward: 120,
    industry: "Tech",
    difficulty: "Medium",
    duration: "20 mins",
    dueDate: "10 days",
    image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop",
    tags: ["#tech", "#networking"],
  },
  {
    id: "7",
    title: "Fold a Fitted Sheet",
    company: "HomeHelper AI",
    reward: 40,
    industry: "Home",
    difficulty: "Easy",
    duration: "5 mins",
    dueDate: "2 days",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    tags: ["#home", "#laundry"],
  },
  {
    id: "8",
    title: "Brew a Pour-Over Coffee",
    company: "BrewBot",
    reward: 60,
    industry: "Culinary",
    difficulty: "Easy",
    duration: "8 mins",
    dueDate: "4 days",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    tags: ["#coffee", "#brewing"],
  },
];

export default function BountiesPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [difficulty, setDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rewardMax, setRewardMax] = useState(250);

  const itemsPerPage = 8;

  // Filter bounties
  const filteredBounties = mockBounties.filter((bounty) => {
    const matchesSearch = bounty.title.toLowerCase().includes(search.toLowerCase()) ||
      bounty.company.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry === "all" || bounty.industry === industry;
    const matchesDifficulty = difficulty === "All" || bounty.difficulty === difficulty;
    return matchesSearch && matchesIndustry && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredBounties.length / itemsPerPage);
  const paginatedBounties = filteredBounties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900">
          Bounty Marketplace
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 mb-8 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
        {/* Search Bar - Full Width */}
        <div className="w-full">
          <label className="flex flex-col w-full">
            <div className="relative flex w-full flex-1 items-center">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500/50 border border-gray-200 bg-transparent h-12 placeholder:text-gray-400 pl-10 pr-4 text-base font-normal leading-normal"
                placeholder="Search for bounties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Buttons */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Difficulty:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDifficulty("All")}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  difficulty === "All" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDifficulty("Easy")}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  difficulty === "Easy" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty("Medium")}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  difficulty === "Medium" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty("Hard")}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  difficulty === "Hard" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Industry Dropdown */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Industry:</span>
            <select
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-transparent h-10 px-3 text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500/50"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Culinary">Culinary</option>
              <option value="Assembly">Assembly</option>
              <option value="Auto">Auto</option>
              <option value="Gardening">Gardening</option>
              <option value="Tech">Tech</option>
              <option value="Home">Home</option>
            </select>
          </div>

          {/* Reward Range */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">Max Reward:</span>
            <div className="flex items-center justify-between h-10 rounded-lg border border-gray-200 bg-transparent px-4 gap-3">
              <input
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-0"
                id="reward-range"
                type="range"
                min="40"
                max="500"
                step="10"
                value={rewardMax}
                onChange={(e) => setRewardMax(Number(e.target.value))}
              />
              <span className="text-sm font-semibold text-red-500 whitespace-nowrap">${rewardMax}+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bounty Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedBounties.map((bounty) => (
          <Link key={bounty.id} href={`/bounties/${bounty.id}`}>
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_0_12px_rgba(0,0,0,0.08)] hover:shadow-[0_0_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                style={{ backgroundImage: `url(${bounty.image})` }}
              />
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-base font-semibold leading-normal text-gray-900">{bounty.title}</p>
                  <p className="text-sm font-normal leading-normal text-gray-600">{bounty.company}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-200 pt-3 mt-1">
                <span>
                  <strong className="text-red-500 font-bold">${bounty.reward}</strong> Reward
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(bounty.difficulty)}`}>
                  {bounty.difficulty}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>Est. {bounty.duration}</span>
                <span>Due: {bounty.dueDate}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {bounty.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-12">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Previous
        </button>
        <nav className="flex items-center gap-2">
          {[...Array(Math.min(totalPages, 3))].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`flex items-center justify-center size-10 rounded-lg text-sm font-medium ${
                currentPage === i + 1 ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 3 && (
            <>
              <span className="flex items-center justify-center size-10 text-sm font-medium">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="flex items-center justify-center size-10 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}
        </nav>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </>
  );
}

