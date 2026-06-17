'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings, User, Moon, Sun, Bell, Shield, Save, CheckCircle } from 'lucide-react';

const mockSettings = [
  { id: 1, category: 'Profile', icon: User, items: [
    { name: 'Profile Picture', type: 'upload', value: 'Upload new photo' },
    { name: 'Display Name', type: 'text', value: 'John Doe' },
    { name: 'Email Address', type: 'email', value: 'john@example.com' },
  ]},
  { id: 2, category: 'Theme', icon: Sun, items: [
    { name: 'Dark Mode', type: 'toggle', value: true },
    { name: 'Accent Color', type: 'color', value: '#10b981' },
  ]},
  { id: 3, category: 'Notifications', icon: Bell, items: [
    { name: 'Email Alerts', type: 'toggle', value: true },
    { name: 'Push Notifications', type: 'toggle', value: false },
    { name: 'Daily Digest', type: 'toggle', value: true },
  ]},
  { id: 4, category: 'Security', icon: Shield, items: [
    { name: 'Two-Factor Auth', type: 'toggle', value: false },
    { name: 'Password Change', type: 'button', value: 'Change Password' },
    { name: 'Session Management', type: 'button', value: 'Manage Sessions' },
  ]},
];

export default function SettingsPage() {
  const { isDark, toggleDarkMode } = useTheme();
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

  const activeSettings = filteredCategories.find(c => c.category === activeCategory);

  const inputCls = `w-full px-3 py-2 text-sm bg-background border border-border rounded-md
    text-foreground placeholder:text-muted-foreground
    focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors`;

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-muted-foreground" />
            {t('settings') || 'Settings'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customize your dashboard experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium
              border border-border rounded-md text-muted-foreground
              hover:bg-muted hover:text-foreground transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('search_settings') || 'Search settings...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300
          border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Category Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {settings.map(cat => {
              const Icon = cat.icon;
              const active = activeCategory === cat.category;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                    ${active
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <Icon size={16} />
                  {cat.category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSettings && (
            <>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                {activeSettings.category} Settings
              </h2>
              <div className="space-y-3">
                {activeSettings.items.map(item => (
                  <div key={item.name}
                    className="bg-card border border-border rounded-lg p-4
                      flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-medium text-foreground">{item.name}</span>

                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => updateSetting(activeSettings.id, item.name, !item.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full
                          transition-colors focus:outline-none
                          ${item.value ? 'bg-foreground' : 'bg-muted'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full
                          bg-background shadow transition-transform
                          ${item.value ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    ) : item.type === 'color' ? (
                      <input
                        type="color"
                        value={item.value}
                        onChange={(e) => updateSetting(activeSettings.id, item.name, e.target.value)}
                        className="w-8 h-8 rounded-md cursor-pointer border border-border"
                      />
                    ) : item.type === 'button' ? (
                      <button className="px-3 py-1.5 text-xs font-medium bg-foreground text-background
                        rounded-md hover:opacity-90 transition-opacity">
                        {item.value}
                      </button>
                    ) : item.type === 'upload' ? (
                      <button className="px-3 py-1.5 text-xs font-medium border border-border
                        text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors">
                        {item.value}
                      </button>
                    ) : (
                      <input
                        type={item.type}
                        value={item.value}
                        onChange={(e) => updateSetting(activeSettings.id, item.name, e.target.value)}
                        className="text-sm px-3 py-1.5 border border-border rounded-md bg-background
                          text-foreground focus:outline-none focus:ring-1 focus:ring-ring w-56"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium
              bg-foreground text-background rounded-md hover:opacity-90 transition-opacity mt-6"
          >
            <Save className="w-4 h-4" />
            {t('save_changes') || 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}