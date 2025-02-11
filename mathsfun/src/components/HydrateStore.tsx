'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/store';
import { hydrateApps } from '@/store/appsSlice';

export default function HydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Hydrating store from localStorage');
    dispatch(hydrateApps());
  }, [dispatch]);

  return null;
} 