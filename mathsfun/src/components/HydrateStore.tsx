'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateApps } from '@/store/appsSlice';

export default function HydrateStore() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Hydrating store from localStorage');
    try {
      const savedApps = localStorage.getItem('myApps');
      dispatch(hydrateApps());
      console.log('Store hydration complete');
    } catch (error) {
      console.error('Hydration error:', error);
    }
  }, [dispatch]);

  return null;
}

// The hydrate action should be properly defined in the slice:
export const hydrate = () => {
  return (dispatch: AppDispatch) => {
    const savedApps = loadFromLocalStorage();
    dispatch(setApps(savedApps));
  };
}; 