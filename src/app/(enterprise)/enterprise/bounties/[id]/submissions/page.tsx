"use client";

import { useState, useRef, useEffect } from "react";
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
    video: "/submissions/gcnew_src.mp4",
  },
  {
    title: "Hand Masks",
    video: "/submissions/1_mano_overlay.mp4",
  },
  {
    title: "Synthetic Depth",
    video: "/submissions/depth.mp4",
  },
  {
    title: "Semantic Segmentation",
    video: "/submissions/gcnew_segmented.mp4",
  },
];

export default function BountySubmissionsPage({ params }: { params: { id: string } }) {
  const [selectedSubmission, setSelectedSubmission] = useState(submissions[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for all video elements
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isSyncingRef = useRef(false);

  // Load videos on mount and ensure they start paused
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.load();
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  // Sync all videos when play/pause state changes
  useEffect(() => {
    isSyncingRef.current = true;
    videoRefs.current.forEach((video) => {
      if (video) {
        if (isPlaying) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      }
    });
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 100);
  }, [isPlaying]);

  // Sync all videos when currentTime changes (from user interaction like progress bar)
  useEffect(() => {
    if (isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    videoRefs.current.forEach((video) => {
      if (video && Math.abs(video.currentTime - currentTime) > 0.2) {
        video.currentTime = currentTime;
      }
    });
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 100);
  }, [currentTime]);

  // Update current time from the first video (they should all be in sync)
  useEffect(() => {
    const video = videoRefs.current[0];
    if (!video) return;

    const updateTime = () => {
      // Only update if we're not currently syncing (to avoid loops)
      if (!isSyncingRef.current) {
        setCurrentTime(video.currentTime);
      }
    };

    const updateDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        setTotalTime(video.duration);
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * totalTime;
    
    isSyncingRef.current = true;
    setCurrentTime(newTime);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.currentTime = newTime;
      }
    });
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 100);
  };

  const progress = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

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
                  className="bg-black flex flex-col gap-3 rounded-lg justify-end p-4 aspect-video relative overflow-hidden"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={aug.video}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    preload="auto"
                    onError={(e) => {
                      const video = e.currentTarget;
                      const error = video.error;
                      console.error(`Error loading video ${aug.title}:`, {
                        error,
                        errorCode: error?.code,
                        errorMessage: error?.message,
                        networkState: video.networkState,
                        readyState: video.readyState,
                        src: video.src,
                      });
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      console.log(`Video ${aug.title} metadata loaded:`, {
                        duration: video.duration,
                        videoWidth: video.videoWidth,
                        videoHeight: video.videoHeight,
                        readyState: video.readyState,
                      });
                    }}
                    onLoadedData={(e) => {
                      console.log(`Video ${aug.title} data loaded successfully`);
                    }}
                    onCanPlay={(e) => {
                      const video = e.currentTarget;
                      console.log(`Video ${aug.title} can play:`, {
                        readyState: video.readyState,
                        networkState: video.networkState,
                      });
                    }}
                    onStalled={(e) => {
                      console.warn(`Video ${aug.title} stalled`);
                    }}
                    onSuspend={(e) => {
                      console.warn(`Video ${aug.title} suspended`);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
              <span className="text-sm text-gray-600">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
              </span>
              <div 
                className="w-full h-2 bg-gray-300 rounded-full flex items-center relative cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-green-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-green-500"></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {Math.floor(totalTime / 60)}:{String(Math.floor(totalTime % 60)).padStart(2, "0")}
              </span>
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

