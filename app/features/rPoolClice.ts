import { createSlice } from '@reduxjs/toolkit';  
import { AppThunk, RootState } from '../store';  
import RPoolServer from '@servers/rpool'

const rPoolServer=new RPoolServer();
const rPoolClice = createSlice({
  name: 'rPoolModule',
  initialState: {  
      rPoolList:[],
      totalLiquidity:"--",
      apyAvg:'--',
      slippageAvg:'-'
  },
  reducers: {   
       setRPoolList(state,{payload}){
            state.rPoolList=payload
       },
       setTotalLiquidity(state,{payload}){
         state.totalLiquidity=payload
       },
       setApyAvg(state,{payload}){
         state.apyAvg=payload
       },
       setSlippageAvg(state,{payload}){
         state.slippageAvg=payload
       }
  },
});

export const { 
    setRPoolList,
    setTotalLiquidity,
    setApyAvg,
    setSlippageAvg
}=rPoolClice.actions

 export const getRPoolList=(): AppThunk => async (dispatch, getState)=>{
   const result=await rPoolServer.getRPoolList()
   if(result.status=="80000"){  
       const list=result.data.list;
       let totalLiquidity=0;
       let apyCount=0;
       let apySum=0;
       let slippageSum=0;
       let slippageCount=0;
       dispatch(setRPoolList(list));
       list.forEach((item:any) => {
          totalLiquidity=totalLiquidity+Number(item.liquidity); 
          if(item.slippage){
            slippageCount=slippageCount+1;
            slippageSum=slippageSum+Number(item.slippage); 
          }
          if(item.apy && item.apy.length>0){
            apyCount=apyCount+1;
            item.apy.forEach((apyitem:any)=>{
              apySum=apySum+Number(apyitem.apy)
            })
          }
       }); 
       dispatch(setTotalLiquidity(totalLiquidity.toFixed(2)));
       dispatch(setApyAvg((apySum/apyCount).toFixed(2)));
       dispatch(setSlippageAvg((slippageSum/slippageCount).toFixed(2)))
   }
 }

export default rPoolClice.reducer;