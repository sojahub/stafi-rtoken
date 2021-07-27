import React,{useEffect, useRef, useState} from 'react';
import no_data_png from '@images/nodata.png';
import LeftContent from '../content/leftContent'
import Doubt from '@shared/components/doubt';
import InfiniteScroll from 'react-infinite-scroller';
import {Scrollbars} from 'react-custom-scrollbars';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/store';

type Props={
    children:any,
    getReward:Function,
    type:"DOT" | "KSM" | "ATOM" | "ETH" | "MATIC" | "FIS",
    rewardList?:any[],
    hours?:Number
}
export default function Index(props:Props){
    // const tbody:any = useRef();
    const dispatch=useDispatch()
    const [hasMore,setHasMore]=useState(true);
    const [loading,setLoading]=useState(true);
    const [pageIndex,setPageIndex]=useState(0);
    const getMore = () => {
        if(hasMore && !loading){ 
            setLoading(true);
        } 
    } 

    useEffect(()=>{
        if(loading && hasMore){
            dispatch(props.getReward(pageIndex,(hasMore:boolean)=>{ 
                setLoading(false);
                setHasMore(hasMore)
                setPageIndex(pageIndex+1)
            })) 
        }
    },[hasMore,loading]); 
    const {gloading}=useSelector((state:RootState)=>{
        return {
            gloading:state.globalModule.loading
        }
    })
    return <LeftContent className="stafi_reward_card">
        <div className="title">
                 Reward Details <Doubt tip={"This reward records are just estimation, and the actual rewards amount will be confirmed when you redeem. Reward calculation is based on your account balance of the last era, and the changes of rToken  balance mayl impact the accuracy of reward calculation."}/>
        </div>
        <div className="data_table">
            <div className="row heard">
                <div className="col col1">
                    Era
                </div>
                <div className="col col2">
                    r{props.type} <Doubt tip={"rToken amount includes ERC20 rToken and NATIVE rToken that currently connected to this app."}/>
                </div>
                <div className="col col3">
                    r{props.type}:{props.type}
                </div>
                <div className="col col4">
                    Redeemable {props.type}
                </div>
                <div className="col col5">
                    Reward
                </div> 
            </div>
         
            <Scrollbars id='list-scrollbars' style={{height: "336px"}} autoHide>
            <InfiniteScroll
                className="list-contents"
                initialLoad={false}
                pageStart={0}
                loadMore={getMore} 
                hasMore={!loading && hasMore}
                loader={loading?<div className="loader">Loading ...</div>:<></>}
                useWindow={false}
            > 
                {(props.rewardList.length==0 && !gloading) && <div className="no_data"><img src={no_data_png}/></div>}
                {props.children}
                </InfiniteScroll>
            </Scrollbars>
            <div className="tfoot">
                Era is updated every {props.hours} hours
            </div>
        </div>
    </LeftContent>
}