import React, { useState } from 'react';
import { Users, MessageSquare, Plus, Heart, Share2, Flag, CheckCircle, Clock, Filter } from 'lucide-react';

interface CommunityContribution {
  id: string;
  author: string;
  title: string;
  content: string;
  type: 'story' | 'data' | 'insight' | 'question';
  votes: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'flagged';
  tags: string[];
  location?: string;
}

export const CommunityPanel: React.FC = () => {
  const [contributions, setContributions] = useState<CommunityContribution[]>([
    {
      id: '1',
      author: 'Dr. Sarah Chen',
      title: 'COVID-19 Impact on Bay Area Housing',
      content: 'During 2020-2021, I observed a 40% increase in remote work policies in tech companies, which directly correlated with increased housing demand in suburban areas...',
      type: 'insight',
      votes: 24,
      timestamp: new Date('2024-01-15'),
      status: 'approved',
      tags: ['housing', 'pandemic', 'bay-area'],
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      author: 'Marcus Rodriguez',
      title: 'Local Food Desert Data',
      content: 'I\'ve been tracking food accessibility in Detroit since 2018. Would like to contribute census tract-level data showing the correlation between food deserts and health outcomes...',
      type: 'data',
      votes: 18,
      timestamp: new Date('2024-01-12'),
      status: 'pending',
      tags: ['health', 'food', 'detroit'],
      location: 'Detroit, MI'
    },
    {
      id: '3',
      author: 'Prof. Elena Vasquez',
      title: 'Climate Migration Patterns',
      content: 'My research shows climate-induced migration from coastal areas to inland cities is accelerating. This data could enhance the environmental-social connections in WorldRipple...',
      type: 'insight',
      votes: 31,
      timestamp: new Date('2024-01-10'),
      status: 'approved',
      tags: ['climate', 'migration', 'demographics'],
      location: 'Multiple States'
    }
  ]);

  const [filterType, setFilterType] = useState<'all' | 'story' | 'data' | 'insight' | 'question'>('all');
  const [newContribution, setNewContribution] = useState('');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const filteredContributions = contributions.filter(
    contrib => filterType === 'all' || contrib.type === filterType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'story': return 'bg-purple-900/30 text-purple-400 border-purple-400';
      case 'data': return 'bg-blue-900/30 text-blue-400 border-blue-400';
      case 'insight': return 'bg-green-900/30 text-green-400 border-green-400';
      case 'question': return 'bg-yellow-900/30 text-yellow-400 border-yellow-400';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'flagged': return <Flag className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const handleVote = (id: string) => {
    setContributions(prev => prev.map(contrib =>
      contrib.id === id ? { ...contrib, votes: contrib.votes + 1 } : contrib
    ));
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Community Insights</h2>
        </div>
        <p className="text-sm text-gray-400">
          Crowdsourced stories, data, and insights from the WorldRipple community
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Filter by Type</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'story', 'data', 'insight', 'question'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add Contribution Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Contribute Your Insight</span>
        </button>
      </div>

      {/* Submission Form */}
      {showSubmissionForm && (
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-3">Share Your Contribution</h3>
          <textarea
            value={newContribution}
            onChange={(e) => setNewContribution(e.target.value)}
            placeholder="Share your story, data, or insights that could help others understand interconnected patterns..."
            className="w-full h-24 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm p-3 focus:outline-none focus:border-green-400 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-2">
              {['story', 'data', 'insight', 'question'].map(type => (
                <button
                  key={type}
                  className={`px-2 py-1 text-xs rounded border ${getTypeColor(type)}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contributions List */}
      <div className="space-y-4">
        {filteredContributions.map(contrib => (
          <div
            key={contrib.id}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/80 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs rounded border ${getTypeColor(contrib.type)}`}>
                    {contrib.type}
                  </span>
                  {contrib.location && (
                    <span className="text-xs text-gray-500">📍 {contrib.location}</span>
                  )}
                  {getStatusIcon(contrib.status)}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">
                  {contrib.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>by {contrib.author}</span>
                  <span>•</span>
                  <span>{contrib.timestamp.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {contrib.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {contrib.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleVote(contrib.id)}
                  className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart className="w-3 h-3" />
                  <span>{contrib.votes}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  <span>Reply</span>
                </button>
                
                <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-green-400 transition-colors">
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
              
              {contrib.status === 'approved' && (
                <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors">
                  View on Map
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Community Stats */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3">Community Activity</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">847</div>
            <div className="text-xs text-gray-400">Contributors</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">2,341</div>
            <div className="text-xs text-gray-400">Insights</div>
          </div>
        </div>
      </div>
    </div>
  );
};