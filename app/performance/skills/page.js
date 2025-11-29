'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Target, Search, Filter, Star, Clock, BookOpen, Eye, Edit2, Trash2, Award, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockSkills = [
  { id: 1, name: 'React.js', category: 'Frontend', proficiency: 95, lastUpdated: '2024-03-15', level: 'Advanced', description: 'Expert in building dynamic UIs with React hooks and state management.' },
  { id: 2, name: 'Python', category: 'Backend', proficiency: 82, lastUpdated: '2024-03-10', level: 'Intermediate', description: 'Proficient in Django and Flask for web development.' },
  { id: 3, name: 'Leadership', category: 'Soft Skills', proficiency: 90, lastUpdated: '2024-02-28', level: 'Advanced', description: 'Strong team management and motivation skills.' },
  { id: 4, name: 'Data Analysis', category: 'Analytics', proficiency: 75, lastUpdated: '2024-03-01', level: 'Intermediate', description: 'Skilled in SQL and Excel for insights extraction.' },
  { id: 5, name: 'UI/UX Design', category: 'Design', proficiency: 88, lastUpdated: '2024-03-20', level: 'Advanced', description: 'Creative design with Figma and Adobe XD.' },
];

const categoryColors = {
  Frontend: 'bg-blue-500',
  Backend: 'bg-green-500',
  'Soft Skills': 'bg-purple-500',
  Analytics: 'bg-orange-500',
  Design: 'bg-pink-500',
};

export default function PerformanceSkills() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [skills, setSkills] = useState(mockSkills);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [skillCount, setSkillCount] = useState(0);

  useEffect(() => {
    setSkillCount(skills.length);
  }, [skills]);

  const filteredSkills = skills.filter(skill => 
    (skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     skill.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'all' || skill.category === filterCategory)
  );

  const uniqueCategories = [...new Set(skills.map(s => s.category))];

  const renderProficiencyBar = (proficiency) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${proficiency}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  );

  const renderStars = (proficiency) => {
    const stars = Math.floor(proficiency / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Brain className="w-8 h-8" />
              {t('skills') || 'Skills'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and develop your key competencies. {skillCount} skills assessed.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-sm font-medium`}>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {skillCount} Skills
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
              placeholder={t('search_skills') || 'Search by skill name or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <AnimatePresence>
          {filteredSkills.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${categoryColors[skill.category]} flex items-center justify-center text-white`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{skill.name}</h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm capitalize`}>{skill.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(skill.proficiency)}
                      </div>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{skill.level}</p>
                    </div>
                  </div>
                  {renderProficiencyBar(skill.proficiency)}
                  <p className="text-sm mt-3 text-center">{skill.proficiency}% Proficiency</p>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-3 line-clamp-2`}>{skill.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600 mt-4">
                    <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      <Clock className="w-3 h-3" />
                      Updated {skill.lastUpdated}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
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
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <Target className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_skills_found') || 'No skills found'}</h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}