import React, { useTheme } from 'react';

const AppGrid = () => {
  const { theme } = useTheme();
  
  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4"
      style={{ color: theme.colors.text }}
    >
      {/* ... app grid content ... */}
    </div>
  );
};

export default AppGrid; 