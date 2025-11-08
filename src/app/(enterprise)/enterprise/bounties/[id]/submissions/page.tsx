"use client";

import { useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const submissions = [
  {
    id: "0A4FDE",
    userId: "User 123",
    date: "Today",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuALfozj6Z4zlkC1M0U_DARpAQoo23HPYXpDX5GNN2wCZKPwx5pZ1qGpjAd8TgyH6MOWFjLuvVMJB-rmspoENMpa_zZBhv_5RW0YTxVydkx1Xp6ISkBwk8QKeSKclbS92GNHG5M3oyQkyqns5d7cmhO4BTezaQlulw7Dj6IM0StMIWCeUnvApneB1fzV0QFvmPrbRVmrZuJqdv8Hewcsx47DP34Rsr1yZJRfGu8Fse_UM6--YKwNaOJ-KE1JkXSLvpBxL0G_k2_GyC4o",
  },
  {
    id: "1B8ACC",
    userId: "User 456",
    date: "Yesterday",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT95jZsWgkZKDS96igxMxMfhep1ujhihu95ZVKMj_MRXqBA7VngwKYl9x0I-2Ey6kIDd51gjSbFnCMqUS3v0_AOk1U27vTPI2N7LOT8aDtiNjp2KTUKu5IpNrSdkCOfaBTx-X99JFxTbF_XJLz_HZDLBPlWzhEfEvX7rKRs1arkxy7TrTfPE8xD_X_8HFJEYw7KoPjQCAuc5wOteFF9WdxnzL38qfArtepjQlu7nK7dno69uF2eX8_2RdXndn0uJwiiA5eauWLC43a",
  },
  {
    id: "2C5F01",
    userId: "User 789",
    date: "2 days ago",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYaaUSCA5fVhxhw-qAmcQth0sLnO4wIrne6107UYWdI6BWo9EvBHcSpO6zHXeau-0-OZhWDlA5sBtdQZCTxh7p_5o_mFCS9Z9ATOA5Pq6WDTquUgM6V-9lSkZGw2crnixYCWYWVIZuwtAcw9AxAkHJnfcvp8Zd9vwdDNjoujxJ9eOTbU4lXz7MAhTnGFyXikRli3gnGZnrP-6BHDONza6sIDofG7isMlptCfROAmHHnOVFibLlAEsUgQrlB4sMx7aJVhoay_OEfZxq",
  },
  {
    id: "3D9EBC",
    userId: "User 101",
    date: "3 days ago",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFeU_XOoNiiTKBU5cxNbUqrkGDTQl6D8tF88AKDODAPUa8bNtCP4hF-HToD9XW_2-QbFYwMvfbTR2PuwHjrcpkuA9E6uto7-wUhHt88vKmlLPta2GXAzTO8LUqiFT1Znrzz1Lz3UZc8pbaaNVYTFTEjVewnS6XL3RUl8Xaq8qMChojdJZCaRh6b94YMt6yUsrtclnf884wLBua8twKDm6Zc8HHMa3bZEBa4evxH5SQGx6IPMKQxNUSSqUujG0azwJm9vVc_vFYzP_v",
  },
  {
    id: "4E2A99",
    userId: "User 212",
    date: "3 days ago",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCv68JvdUMEmZ-yjT8loqVb981HM88HhwKVTeRw-wW4Q5zMI5x6WI27bmoBrj5fH7B5jLcAJPg3Y_pnr6qWYdsse55vgw2CgWWDXrETepwmmuZZmDmJDet7S0BSEnLULFhrllrbjzpqUszoblPYJyD4_SZzfqA0dYecHDn1U6RaV7ZhGhh5yskwWYVxIdZeUhIJUgbjXhb8kNyattTGOp0ijueYnwH3YG1qYYuVaJ0TZ28RTketXr1UYadOI03AIINf1qYzJB4rLdV0",
  },
];

const videoAugmentations = [
  {
    title: "Original",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc-zUl-lHKtBCTyIbktQkfM7BymBo-TqcrwZjrER3LADIa2YNwCwS8MRy0ylIlmuBFKkJfVu0963Wws5KJQl4xfLZ0N8JF-78PCZMtWPhD4nOMuEO68fNoZEuJ060A-QFxFD-_5Q2J1iTe_Dtb3oaAhKAYnycBsSA2mju6JA59VOSQZIe1mV9A6N-dHQqmy0ZHdbew-tENb6t9PdAJ2YnYrF9bze8etv4MHicsOlPB47psyquxbo6RY7_DRWFge2YBHDIeVKLjB9WH",
  },
  {
    title: "Hand Masks",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwV4PqLNcBArhFqCchRBcd89h6QLgCAOKSo_o4nyCCSZmuGTU7-SSlWqi1a_Vh9pT34FZ7VgegDS1oYf9kqxboP1pTQO31DaqRBWpy59_znN0j3lIOA_vLCbdoGutt7KnE4UUjJ6P5CQZq1WmXn5KSPODloYSvpQIfHWEGzpVSndcUOrHB-iTkNQijPjBstD4qAHziKvGmZ3zBuITphzF0azoZjnxG0Mhsbd52f3930LcOEvKGl7XABT-IA5ywzygFEhTz1NbyDlLM",
  },
  {
    title: "Synthetic Depth",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRMsERiYKNN_PwaU_TvSk5ruFL7ZQM0FK_UY-5e4Hv08zLVFDY0pdP6nUDZU0OoyTHjkhMB9rzcwQDk2ZQPeGyIqS7Iho2e6fICjBBZf-RQ2iYNGeOaE0j2-jTOwzV8s99AAFZOEdW8OhkL96OPbRY47MyCuJwl6F7LzCplJniOL88VWFf8PDnxt6zD8E_4V5iCJQmf1nIBkid2g_dAY-ezIP4oDJWutqBwRVYiTMjd6FF8NFmGwTEgfBICtG8JRUMhvzp_MVal2yd",
  },
  {
    title: "Semantic Segmentation",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFeU_XOoNiiTKBU5cxNbUqrkGDTQl6D8tF88AKDODAPUa8bNtCP4hF-HToD9XW_2-QbFYwMvfbTR2PuwHjrcpkuA9E6uto7-wUhHt88vKmlLPta2GXAzTO8LUqiFT1Znrzz1Lz3UZc8pbaaNVYTFTEjVewnS6XL3RUl8Xaq8qMChojdJZCaRh6b94YMt6yUsrtclnf884wLBua8twKDm6Zc8HHMa3bZEBa4evxH5SQGx6IPMKQxNUSSqUujG0azwJm9vVc_vFYzP_v",
  },
];

export default function BountySubmissionsPage({ params }: { params: { id: string } }) {
  const [selectedSubmission, setSelectedSubmission] = useState(submissions[0]);
  const [currentTime, setCurrentTime] = useState(12);
  const [totalTime, setTotalTime] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);

  const progress = (currentTime / totalTime) * 100;

  return (
    <div className="flex flex-col p-6">
      <div className="flex w-full gap-6">
          {/* Left Column: Video Grid & Controls */}
          <div className="w-full lg:w-3/4 flex flex-col">
            {/* Page Heading */}
            <header className="flex flex-wrap justify-between gap-3 mb-6">
              <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-3xl font-black leading-tight tracking-tighter text-gray-900">
                  Bounty: Making a Sandwich
                </h1>
                <p className="text-base font-normal leading-normal text-gray-600">
                  Review and analyze video submissions and their augmentations.
                </p>
              </div>
            </header>

            {/* Video Analysis Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
              {videoAugmentations.map((aug, index) => (
                <div
                  key={index}
                  className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-video relative overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url(${aug.image})`,
                  }}
                >
                  <p className="text-white text-base font-bold leading-tight relative z-10">
                    {aug.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Universal Playback Controls */}
            <div className="bg-gray-100 rounded-xl p-4 mt-6 flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-gray-900 rounded-full hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>
              <span className="text-sm text-gray-600">0:{String(currentTime).padStart(2, "0")}</span>
              <div className="w-full h-2 bg-gray-300 rounded-full flex items-center relative">
                <div
                  className="h-full bg-green-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-green-500"></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">0:{String(totalTime).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Right Column: Submission List */}
          <aside className="w-1/4 min-w-[300px] bg-gray-100 rounded-xl flex flex-col border-0">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Submissions ({submissions.length})</h3>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
              <div className="flex flex-col gap-2">
                {submissions.map((submission) => {
                  const isSelected = selectedSubmission.id === submission.id;
                  return (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                        isSelected
                          ? "bg-green-50 border-2 border-green-500"
                          : "hover:bg-gray-200"
                      )}
                    >
                      <div
                        className="w-24 h-14 rounded-md bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${submission.thumbnail})` }}
                      ></div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          Submission #{submission.id}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {submission.userId} | {submission.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
      </div>
    </div>
  );
}

