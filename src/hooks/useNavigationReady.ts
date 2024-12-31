import { useEffect, useState } from 'react';

import { useRootNavigation } from 'expo-router';

export const useNavigationReady = () => {
  const [isNavigationReady, setNavigationReady] = useState(false);
  const rootNavigation = useRootNavigation();

  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener('state', event => {
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  return isNavigationReady;
};
