import { useEffect } from 'react';

interface KeyboardShortcuts {
  onSave?: () => void;
  onCopy?: () => void;
  onExport?: () => void;
  onReset?: () => void;
}

export function useKeyboardShortcuts({
  onSave,
  onCopy,
  onExport,
  onReset,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S or Cmd+S: Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Ctrl+Enter or Cmd+Enter: Copy
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        onCopy?.();
      }

      // Ctrl+E or Cmd+E: Export
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        onExport?.();
      }

      // Ctrl+Shift+R or Cmd+Shift+R: Reset
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'r') {
        event.preventDefault();
        onReset?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onCopy, onExport, onReset]);
}
