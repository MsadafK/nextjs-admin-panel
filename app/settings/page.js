'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings, Search, Filter, User, Moon, Sun, Bell, Shield, Save, X, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockSettings = [
  { id: 1, category: 'Profile', items: [
    { name: 'Profile Picture', type: 'upload', value: 'Upload new photo' },
    { name: 'Display Name', type: 'text', value: 'John Doe' },
    { name: 'Email Address', type: 'email', value: 'john@example.com' },
  ]},
  { id: 2, category: 'Theme', items: [
    { name: 'Dark Mode', type: 'toggle', value: true },
    { name: 'Accent Color', type: 'color', value: '#3B82F6' },
  ]},
  { id: 3, category: 'Notifications', items: [
    { name: 'Email Alerts', type: 'toggle', value: true },
    { name: 'Push Notifications', type: 'toggle', value: false },
    { name: 'Daily Digest', type: 'toggle', value: true },
  ]},
  { id: 4, category: 'Security', items: [
    { name: 'Two-Factor Auth', type: 'toggle', value: false },
    { name: 'Password Change', type: 'button', value: 'Change Password' },
    { name: 'Session Management', type: 'button', value: 'Manage Sessions' },
  ]},
];

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('Profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState(mockSettings);

  const filteredCategories = settings.filter(cat => 
    cat.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    setSuccessMessage(t('settings_saved') || 'Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateSetting = (categoryId, itemName, newValue) => {
    setSettings(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            items: cat.items.map(item => 
              item.name === itemName ? { ...item, value: newValue } : item
            )
          }
        : cat
    ));
  };

  const SettingItem = ({ item, categoryId }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{item.name}</span>
        {item.type === 'toggle' ? (
          <button 
            onClick={() => updateSetting(categoryId, item.name, !item.value)} 
            className={`relative w-10 h-6 rounded-full transition-colors ${item.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <motion.div 
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full ${item.value ? 'translate-x-4' : ''}`} 
              layout 
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        ) : item.type === 'color' ? (
          <input 
            type="color" 
            value={item.value} 
            onChange={(e) => updateSetting(categoryId, item.name, e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600"
          />
        ) : item.type === 'button' ? (
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            {item.value}
          </button>
        ) : item.type === 'upload' ? (
          <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            {item.value}
          </button>
        ) : (
          <input 
            type={item.type} 
            value={item.value} 
            onChange={(e) => updateSetting(categoryId, item.name, e.target.value)}
            className="text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Settings className="w-8 h-8" />
              {t('settings') || 'Settings'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your dashboard experience. Quick and easy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sun 
              className={`w-5 h-5 cursor-pointer ${isDark ? 'text-gray-400' : 'text-yellow-500'}`} 
              onClick={toggleTheme} 
            />
            <Moon 
              className={`w-5 h-5 cursor-pointer ${isDark ? 'text-blue-500' : 'text-gray-400'}`} 
              onClick={toggleTheme} 
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={t('search_settings') || 'Search settings...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {settings.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeCategory === cat.category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Content */}
        <AnimatePresence mode="wait">
          {filteredCategories.map(cat => activeCategory === cat.category && (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {cat.category === 'Theme' && <Sun className="w-5 h-5" />}
                {cat.category === 'Profile' && <User className="w-5 h-5" />}
                {cat.category === 'Notifications' && <Bell className="w-5 h-5" />}
                {cat.category === 'Security' && <Shield className="w-5 h-5" />}
                {cat.category} Settings
              </h2>
              <div className="space-y-3">
                {cat.items.map(item => (
                  <SettingItem key={item.name} item={item} categoryId={cat.id} />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={handleSave}
          className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Save className="w-5 h-5" />
          {t('save_changes') || 'Save Changes'}
        </button>
      </div>
    </div>
  );
}