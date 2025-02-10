import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface App {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface AppsState {
  myApps: App[];
}

const loadFromLocalStorage = (): App[] => {
  try {
    const stored = localStorage.getItem('myApps');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading apps from localStorage:', error);
    return [];
  }
};

const initialState: AppsState = {
  myApps: [],
};

// Rename the hydrate action to avoid conflicts
export const hydrateApps = () => {
  return (dispatch: AppDispatch) => {
    const savedApps = loadFromLocalStorage();
    dispatch(setApps(savedApps));
  };
};

const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setApps: (state, action: PayloadAction<App[]>) => {
      state.myApps = action.payload;
    },
    addApp: (state, action: PayloadAction<App>) => {
      if (!action.payload.id) {
        console.error('Cannot add app without ID');
        return;
      }
      console.log('Redux addApp reducer called with:', action.payload);
      const exists = state.myApps.some(app => app.id === action.payload.id);
      console.log('App already exists:', exists);
      
      if (!exists) {
        console.log('Adding new app to state');
        state.myApps.push(action.payload);
        localStorage.setItem('myApps', JSON.stringify(state.myApps));
        console.log('Updated apps in localStorage');
      }
    },
    removeApp: (state, action: PayloadAction<string>) => {
      console.log('Redux removeApp reducer called for ID:', action.payload);
      state.myApps = state.myApps.filter(app => {
        const match = app.id !== action.payload;
        console.log(`App ${app.id} ${match ? 'remains' : 'removed'}`);
        return match;
      });
      localStorage.setItem('myApps', JSON.stringify(state.myApps));
      console.log('Updated apps in localStorage after removal');
    },
  },
});

// Update the exports
export const { setApps, addApp, removeApp } = appsSlice.actions;
export default appsSlice.reducer;

export const fetchApps = createAsyncThunk(
  'apps/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // ... implementation
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
); 