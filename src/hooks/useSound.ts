import { useCallback } from 'react';

const useSound = (soundUrl: string) => {
  const play = useCallback(() => {
    const audio = new Audio(soundUrl);
    audio.play();
  }, [soundUrl]);

  return play;
};

export default useSound;
