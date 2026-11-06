'use client';

import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function SettingsButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition-all hover:scale-105 active:scale-95 sm:h-11 sm:w-11" aria-label="Workspace Customizer" title="Workspace Customizer">
      <Settings2 size={18}/>
    </button>
    <SettingsModal {...props} isOpen={isOpen} onClose={() => setIsOpen(false)}/>
  </>;
}
