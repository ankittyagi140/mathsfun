'use client';


import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { useTheme } from "../../context/ThemeContext";
import { Medal, Trophy, Star, Award, Target, Crown, Zap, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
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
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<string>('all');
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Achievements', path: '/achievements' }
  ];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category.toLowerCase() === filter.toLowerCase());

  const categories = ['all', ...new Set(achievements.map(a => a.category.toLowerCase()))];

  return (
    <div className={`flex flex-col min-h-screen ${currentTheme.mainBg}`}>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1">
              <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>Achievements</h1>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${
                      filter === category
                        ? `${currentTheme.activeBg} ${currentTheme.activeText}`
                        : `${currentTheme.buttonBg} ${currentTheme.textColor}`
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const progressPercentage = (achievement.progress / achievement.total) * 100;
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`${currentTheme.componentBg} p-6 rounded-lg border ${currentTheme.borderColor} relative overflow-hidden`}
                    >
                      {/* Achievement Icon */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-2 rounded-full ${
                          achievement.unlocked ? currentTheme.activeBg : currentTheme.buttonBg
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            achievement.unlocked ? currentTheme.activeText : currentTheme.textColor
                          }`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${currentTheme.textColor}`}>
                            {achievement.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {achievement.category}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {achievement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-gray-600">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-600">
                              {achievement.progress}/{achievement.total}
                            </span>
                          </div>
                        </div>
                        <div className="flex h-2 mb-4 overflow-hidden rounded bg-gray-200">
                          <div
                            style={{ width: `${progressPercentage}%` }}
                            className={`${currentTheme.activeBg} transition-all duration-300`}
                          />
                        </div>
                      </div>

                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}