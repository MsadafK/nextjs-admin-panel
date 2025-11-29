'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const FontsContext = createContext();

export const fonts = {
  inter: { name: 'Inter', value: 'Inter, system-ui, sans-serif', googleFont: 'Inter:wght@300;400;500;600;700' },
  roboto: { name: 'Roboto', value: 'Roboto, sans-serif', googleFont: 'Roboto:wght@300;400;500;700' },
  poppins: { name: 'Poppins', value: 'Poppins, sans-serif', googleFont: 'Poppins:wght@300;400;500;600;700' },
  montserrat: { name: 'Montserrat', value: 'Montserrat, sans-serif', googleFont: 'Montserrat:wght@300;400;500;600;700' },
  lato: { name: 'Lato', value: 'Lato, sans-serif', googleFont: 'Lato:wght@300;400;700' },
  opensans: { name: 'Open Sans', value: '"Open Sans", sans-serif', googleFont: 'Open+Sans:wght@300;400;500;600;700' },
  raleway: { name: 'Raleway', value: 'Raleway, sans-serif', googleFont: 'Raleway:wght@300;400;500;600;700' },
  nunito: { name: 'Nunito', value: 'Nunito, sans-serif', googleFont: 'Nunito:wght@300;400;500;600;700' },
  playfair: { name: 'Playfair Display', value: '"Playfair Display", serif', googleFont: 'Playfair+Display:wght@400;500;600;700' },
  merriweather: { name: 'Merriweather', value: 'Merriweather, serif', googleFont: 'Merriweather:wght@300;400;700' },
};

export function FontsProvider({ children }) {
  const [currentFont, setCurrentFont] = useState('inter');

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=' + 
      Object.values(fonts).map(f => f.googleFont).join('&family=') + 
      '&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Apply saved font
    const savedFont = localStorage.getItem('selectedFont') || 'inter';
    setCurrentFont(savedFont);
    applyFont(savedFont);
  }, []);

  const applyFont = (fontKey) => {
    const fontValue = fonts[fontKey]?.value || fonts.inter.value;
    document.documentElement.style.fontFamily = fontValue;
  };

  const changeFont = (fontKey) => {
    setCurrentFont(fontKey);
    localStorage.setItem('selectedFont', fontKey);
    applyFont(fontKey);
  };

  return (
    <FontsContext.Provider value={{ currentFont, changeFont, fonts }}>
      {children}
    </FontsContext.Provider>
  );
}

export function useFonts() {
  const context = useContext(FontsContext);
  if (!context) {
    throw new Error('useFonts must be used within FontsProvider');
  }
  return context;
}