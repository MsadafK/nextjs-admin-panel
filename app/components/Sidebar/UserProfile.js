// UserProfile.jsx
import React from "react";

const UserProfile = ({ userName, userEmail, colors, translateText }) => {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center`}>
          <span className="text-white font-semibold">
            {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userName || translateText('user')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userEmail || translateText('email')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
