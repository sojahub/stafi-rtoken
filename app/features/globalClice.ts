import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
 

// const server = new Server();

const globalClice = createSlice({
  name: 'globalModule',
  initialState: {
    provinces: [],
  },
  reducers: { 
  },
});
export const {  } = globalClice.actions;
 

export default globalClice.reducer;