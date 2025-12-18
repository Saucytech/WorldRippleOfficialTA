import React, { useState, useEffect } from 'react';
import { User, Award, BookOpen, Target, TrendingUp, Clock, Star, Settings, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'explorer' | 'analyst' | 'contributor' | 'educator';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface UserDashboardProps {
  defaultTab?: 'overview' | 'achievements' | 'learning' | 'settings';
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ defaultTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'learning' | 'settings'>(defaultTab);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Failed to log out. Please try again.');
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Data Explorer',
      description: 'Activate 5 different data layers',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      category: 'explorer'
    },
    {
      id: '2',
      title: 'Time Traveler',
      description: 'Explore 50 years of historical data',
      progress: 50,
      maxProgress: 50,
      unlocked: true,
      category: 'explorer'
    },
    {
      id: '3',
      title: 'Pattern Finder',
      description: 'Discover 10 AI-generated insights',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      category: 'analyst'
    },
    {
      id: '4',
      title: 'Community Voice',
      description: 'Contribute 3 community insights',
      progress: 1,
      maxProgress: 3,
      unlocked: false,
      category: 'contributor'
    }
  ]);

  const [learningPaths] = useState<LearningPath[]>([
    {
      id: '1',
      title: 'Understanding Historical Patterns',
      description: 'Learn how historical events create ripple effects across different domains',
      progress: 60,
      totalLessons: 8,
      estimatedTime: '2 hours',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Data Analysis Fundamentals',
      description: 'Master the art of interpreting complex data visualizations and correlations',
      progress: 25,
      totalLessons: 12,
      estimatedTime: '4 hours',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Policy Impact Modeling',
      description: 'Advanced techniques for understanding how policies affect multiple societal layers',
      progress: 0,
      totalLessons: 15,
      estimatedTime: '6 hours',
      difficulty: 'advanced'
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'explorer': return 'text-blue-400';
      case 'analyst': return 'text-green-400';
      case 'contributor': return 'text-purple-400';
      case 'educator': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
        </div>
        <p className="text-sm text-gray-400">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'achievements', label: 'Badges', icon: Award },
          { id: 'learning', label: 'Learning', icon: BookOpen },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white mb-1">47</div>
              <div className="text-sm text-gray-400">Hours Explored</div>
              <div className="text-xs text-green-400 mt-1">+12 this week</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white mb-1">156</div>
              <div className="text-sm text-gray-400">Insights Viewed</div>
              <div className="text-xs text-blue-400 mt-1">+23 this week</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="flex-1 text-sm text-gray-300">
                  Explored disease outbreak patterns in 2020
                </div>
                <div className="text-xs text-gray-500">2h ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1 text-sm text-gray-300">
                  Completed "Housing Crisis" learning module
                </div>
                <div className="text-xs text-gray-500">1d ago</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1 text-sm text-gray-300">
                  Unlocked "Time Traveler" achievement
                </div>
                <div className="text-xs text-gray-500">3d ago</div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3">Learning Progress</h3>
            <div className="space-y-3">
              {learningPaths.slice(0, 2).map(path => (
                <div key={path.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{path.title}</span>
                    <span className="text-gray-400">{path.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`bg-gray-800/50 rounded-lg p-4 border transition-all ${
                achievement.unlocked
                  ? 'border-green-500 bg-green-900/20'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  achievement.unlocked
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {achievement.unlocked ? (
                    <Star className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-white' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(achievement.category)} bg-gray-800`}>
                      {achievement.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Learning Tab */}
      {activeTab === 'learning' && (
        <div className="space-y-4">
          {learningPaths.map(path => (
            <div
              key={path.id}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:bg-gray-800/80 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{path.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                {path.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>{path.totalLessons} lessons</span>
                <span>{path.estimatedTime}</span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-400">{path.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
              
              <button className={`w-full py-2 text-sm rounded-lg transition-colors ${
                path.progress > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}>
                {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto-play timeline</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Show AI insights</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Email notifications</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3">Data</h3>
            <div className="space-y-3">
              <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                Clear Cache
              </button>
              <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                Reset Preferences
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-white mb-3">Account</h3>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};