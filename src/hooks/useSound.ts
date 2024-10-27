import { useCallback } from 'react';

const useSound = (soundUrl: string) => {
  const play = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.warn(`Sound not played (${soundUrl}):`, error.message);
    });
  }, [soundUrl]);

  return play;
};

export default useSound;
