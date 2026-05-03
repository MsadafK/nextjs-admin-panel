import React from 'react';

const UserProfile = ({ userName, userEmail, isDarkMode, translateText }) => {
  return (
    <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs ${
          isDarkMode
            ? 'bg-zinc-100 text-zinc-900'
            : 'bg-zinc-900 text-zinc-50'
        }`}>
          {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>
            {userName || translateText('user')}
          </p>
          <p className={`text-xs truncate ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
            {userEmail || translateText('email')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;