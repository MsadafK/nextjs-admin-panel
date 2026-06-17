'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from 'react';


import { Target, Search, Filter, Star, Clock, BookOpen, Eye, Edit2, Trash2, Award, Brain } from 'lucide-react';


const mockSkills = [
  { id: 1, name: 'React.js', category: 'Frontend', proficiency: 95, lastUpdated: '2024-03-15', level: 'Advanced', description: 'Expert in building dynamic UIs with React hooks and state management.' },
  { id: 2, name: 'Python', category: 'Backend', proficiency: 82, lastUpdated: '2024-03-10', level: 'Intermediate', description: 'Proficient in Django and Flask for web development.' },
  { id: 3, name: 'Leadership', category: 'Soft Skills', proficiency: 90, lastUpdated: '2024-02-28', level: 'Advanced', description: 'Strong team management and motivation skills.' },
  { id: 4, name: 'Data Analysis', category: 'Analytics', proficiency: 75, lastUpdated: '2024-03-01', level: 'Intermediate', description: 'Skilled in SQL and Excel for insights extraction.' },
  { id: 5, name: 'UI/UX Design', category: 'Design', proficiency: 88, lastUpdated: '2024-03-20', level: 'Advanced', description: 'Creative design with Figma and Adobe XD.' },
];

const categoryColors = {
  Frontend: 'bg-muted0',
  Backend: 'bg-muted0',
  'Soft Skills': 'bg-muted0',
  Analytics: 'bg-muted0',
  Design: 'bg-muted0',
};

export default function PerformanceSkills() {
    const t = () => null;
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
    <div className="w-full bg-muted  rounded-full h-2">
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
      <Star key={i} className={`w-4 h-4 ${i < stars ? 'fill-current text-yellow-400' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    <div className={`min-h-screen bg-muted text-foreground`}>
      {/* Header */}
      <div className="p-6 border-b border-border dark:border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-3 text-foreground`}>
              <Brain className="w-8 h-8" />
              {t('skills') || 'Skills'}
            </h1>
            <p className={`text-muted-foreground`}>
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
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <input
              type="text"
              placeholder={t('search_skills') || 'Search by skill name or description...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-card border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className={`w-5 h-5 text-muted-foreground`} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border bg-card border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                  className={`p-6 rounded-xl shadow-card bg-card border border-border transition-all duration-300 hover:shadow-dropdown`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${categoryColors[skill.category]} flex items-center justify-center text-background`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{skill.name}</h3>
                        <p className={`text-muted-foreground text-sm capitalize`}>{skill.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(skill.proficiency)}
                      </div>
                      <p className={`text-muted-foreground text-xs`}>{skill.level}</p>
                    </div>
                  </div>
                  {renderProficiencyBar(skill.proficiency)}
                  <p className="text-sm mt-3 text-center">{skill.proficiency}% Proficiency</p>
                  <p className={`text-muted-foreground text-sm mt-3 line-clamp-2`}>{skill.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border mt-4">
                    <p className={`text-xs flex items-center gap-1 text-muted-foreground`}>
                      <Clock className="w-3 h-3" />
                      Updated {skill.lastUpdated}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-muted-foreground hover:text-green-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-blue-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
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
              className={`p-12 text-center rounded-xl bg-card border border-dashed border-border`}
            >
              <Target className={`w-16 h-16 mx-auto mb-4 text-muted-foreground`} />
              <h3 className="text-lg font-semibold mb-2">{t('no_skills_found') || 'No skills found'}</h3>
              <p className={`text-muted-foreground`}>Try adjusting your search or filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}