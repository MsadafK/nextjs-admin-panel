'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, Search, Filter, Star, User, Clock, MessageSquare, Eye, Edit2, Trash2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockReviews = [
  { id: 1, employee: { name: 'Alice Johnson', avatar: 'AJ', role: 'Developer' }, rating: 4.8, reviewDate: '2024-03-15', reviewer: 'Manager', comments: 'Outstanding performance on the dashboard project. Innovative solutions and timely delivery.', strengths: ['Innovation', 'Timeliness'], areas: ['Delegation'], overallScore: 92 },
  { id: 2, employee: { name: 'Bob Smith', avatar: 'BS', role: 'Designer' }, rating: 4.2, reviewDate: '2024-03-10', reviewer: 'Lead Designer', comments: 'Strong visual designs, but could improve on user feedback integration.', strengths: ['Creativity', 'Attention to Detail'], areas: ['User Testing'], overallScore: 85 },
  { id: 3, employee: { name: 'Carol Davis', avatar: 'CD', role: 'Manager' }, rating: 4.9, reviewDate: '2024-02-28', reviewer: 'Director', comments: 'Excellent leadership and team motivation. Exceeded quarterly targets.', strengths: ['Leadership', 'Results-Oriented'], areas: [], overallScore: 95 },
  { id: 4, employee: { name: 'David Wilson', avatar: 'DW', role: 'Analyst' }, rating: 3.9, reviewDate: '2024-03-01', reviewer: 'Senior Analyst', comments: 'Solid data analysis, but reports need more concise summaries.', strengths: ['Accuracy'], areas: ['Communication'], overallScore: 78 },
  { id: 5, employee: { name: 'Eva Brown', avatar: 'EB', role: 'Tester' }, rating: 4.5, reviewDate: '2024-03-20', reviewer: 'QA Lead', comments: 'Thorough testing and quick bug resolutions. Great team player.', strengths: ['Attention to Detail', 'Collaboration'], areas: ['Automation'], overallScore: 89 },
];

const ratingColors = {
  5: 'text-yellow-500',
  4: 'text-yellow-400',
  3: 'text-amber-500',
  2: 'text-orange-500',
  1: 'text-red-500',
};

export default function PerformanceReviews() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Simulate new reviews
    const interval = setInterval(() => {
      const newReview = {
        id: Date.now(),
        employee: { name: 'New Employee', avatar: 'NE', role: 'Intern' },
        rating: Math.floor(Math.random() * 5) + 1,
        reviewDate: new Date().toISOString().split('T')[0],
        reviewer: 'HR',
        comments: 'Initial performance review.',
        strengths: ['Potential'], areas: [], overallScore: Math.floor(Math.random() * 20) + 80,
      };
      setReviews(prev => [newReview, ...prev.slice(0, 4)]); // Keep top 5
    }, 30000);

    setReviewCount(reviews.length);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent infinite loop

  const filteredReviews = reviews.filter(review =>
    (review.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     review.comments.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRating === 'all' || review.rating >= parseInt(filterRating))
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <TrendingUp className="w-8 h-8" />
              {t('performance_reviews') || 'Performance Reviews'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {reviewCount} recent reviews. Track growth and feedback.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {reviewCount} Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={t('search_reviews') || 'Search by employee or comments...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="all">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        <AnimatePresence>
          {filteredReviews.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg`}>
                          {review.employee.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{review.employee.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{review.employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{review.overallScore}% Overall</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm line-clamp-3`}>{review.comments}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {review.strengths.map((strength, sIndex) => (
                        <span key={sIndex} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                          {strength}
                        </span>
                      ))}
                      {review.areas.map((area, aIndex) => (
                        <span key={aIndex} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-purple-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Clock className="w-3 h-3" />
                    {review.reviewDate} by {review.reviewer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_reviews_found') || 'No reviews found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}