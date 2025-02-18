'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store/store';
import { hydrateApps } from '@/redux/slices/appsSlice';

export default function HydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Hydrating store from localStorage');
    dispatch(hydrateApps());
  }, [dispatch]);

  return null;
} 