import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface App {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

interface AppsState {
  myApps: App[];
  loading: boolean;
}


const initialState: AppsState = {
  myApps: [],
  loading: true,
};

// Add hydration thunk
export const hydrateApps = createAsyncThunk(
  'apps/hydrate',
  async (_, { dispatch }) => {
    const savedApps = localStorage.getItem('myApps');
    if (savedApps) {
      dispatch(setApps(JSON.parse(savedApps)));
    }
  }
);

const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setApps: (state, action: PayloadAction<App[]>) => {
      state.myApps = action.payload;
    },
    addApp: (state, action: PayloadAction<App>) => {
      if (!action.payload.id) {
        return;
      }
      const exists = state.myApps.some(app => app.id === action.payload.id);
      
      if (!exists) {
        state.myApps.push(action.payload);
        localStorage.setItem('myApps', JSON.stringify(state.myApps));
      }
    },
    removeApp: (state, action: PayloadAction<string>) => {
      state.myApps = state.myApps.filter(app => {
        const match = app.id !== action.payload;
        return match;
      });
      localStorage.setItem('myApps', JSON.stringify(state.myApps));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateApps.fulfilled, (state) => {
      state.loading = false;
    });
  }
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