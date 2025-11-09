'use client';

import { useState, useRef } from 'react';

interface ProfileCardProps {
  name: string;
  title: string;
  handle: string;
  status?: string;
  contactText?: string;
  avatarUrl?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  onContactClick?: () => void;
  accentColor?: string;
}

export default function ProfileCard({
  name,
  title,
  handle,
  status = 'Online',
  contactText = 'Contact Me',
  avatarUrl,
  showUserInfo = true,
  enableTilt = true,
  enableMobileTilt = false,
  onContactClick,
  accentColor = 'rgb(239, 68, 68)'
}: ProfileCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isTilting = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt) return;
    if (!enableMobileTilt && window.innerWidth < 768) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -8;
    const tiltY = ((x - centerX) / centerX) * 8;

    isTilting.current = true;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    isTilting.current = false;
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isTilting.current ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-200">
        {/* Top accent border */}
        <div 
          className="h-1.5 w-full"
          style={{ backgroundColor: accentColor }}
        />

        {/* Card content */}
        <div className="p-8">
          {/* Avatar section */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-100"
                  style={{ backgroundColor: accentColor }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Status indicator */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
            </div>
            
            {/* Status badge */}
            {status && (
              <span className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                {status}
              </span>
            )}
          </div>

          {/* User info */}
          {showUserInfo && (
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {name}
              </h3>
              <p className="text-base text-gray-600 mb-2">
                {title}
              </p>
              <p 
                className="text-sm font-semibold"
                style={{ color: accentColor }}
              >
                @{handle}
              </p>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={onContactClick}
            className="w-full py-3 px-6 text-white font-semibold rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            {contactText}
          </button>
        </div>

        {/* Decorative gradient */}
        <div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div 
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
}

