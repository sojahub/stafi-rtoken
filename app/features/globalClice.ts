import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store'; 

const globalClice = createSlice({
  name: 'globalModule',
  initialState: {
    provinces: [],
    processSlider:false,
  },
  reducers: { 
    setProcessSlider(state,{payload}){
      state.processSlider=payload
    }
  },
});
export const { setProcessSlider } = globalClice.actions;
 

export default globalClice.reducer;