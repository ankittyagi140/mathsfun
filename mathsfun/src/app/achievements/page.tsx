'use client';


import { Medal, Star, Target, Crown, Zap, BookOpen, Lock } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import type { LucideIcon } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  total: number;
  category: string;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first learning module',
    icon: Medal,
    progress: 1,
    total: 1,
    category: 'Learning',
    unlocked: true
  },
  {
    id: '2',
    title: 'Quick Learner',
    description: 'Complete 5 learning modules',
    icon: Zap,
    progress: 3,
    total: 5,
    category: 'Learning',
    unlocked: false
  },
  {
    id: '3',
    title: 'Math Master',
    description: 'Score 100% in any math quiz',
    icon: Crown,
    progress: 90,
    total: 100,
    category: 'Quiz',
    unlocked: false
  },
  {
    id: '4',
    title: 'Perfect Streak',
    description: 'Maintain a 7-day learning streak',
    icon: Target,
    progress: 5,
    total: 7,
    category: 'Engagement',
    unlocked: false
  },
  {
    id: '5',
    title: 'Knowledge Seeker',
    description: 'Study for 10 hours total',
    icon: BookOpen,
    progress: 6,
    total: 10,
    category: 'Learning',
    unlocked: false
  },
  {
    id: '6',
    title: 'All-Star',
    description: 'Earn all basic achievements',
    icon: Star,
    progress: 2,
    total: 5,
    category: 'Special',
    unlocked: false
  }
];

export default function AchievementsPage() {
  const [filter, setFilter] = useState<string>('all');
  
  const {  isAuthenticated} = useSelector((state: RootState) => state.auth);
  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category.toLowerCase() === filter.toLowerCase());

  const categories = ['all', ...new Set(achievements.map(a => a.category.toLowerCase()))];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Achievements
          </h1>
        </div>

        {/* Category Filter */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md transition-all ${
                  filter === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Achievements Grid */}
        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredAchievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.total) * 100;

              return (
                <div
                  key={achievement.id}
                  className="p-4 sm:p-6 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">
                        {achievement.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {achievement.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progressPercentage}%` }}
                        className="h-full bg-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <div className="mb-4 sm:mb-6">
                <Lock className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
                Login Required
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Please login to track your achievements
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}