'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store/store';
import { hydrateApps } from '@/redux/slices/appsSlice';

export default function HydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateApps());
  }, [dispatch]);

  return null;
} 