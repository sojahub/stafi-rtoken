import sort_arrow from '@images/sort_arrow.svg';
import sort_arrow_white from '@images/sort_arrow_white.svg';
import React from 'react';
type Props={
    sortField?:string,
    sortWay?:string,
    onClick?:Function
}
export default function Index(props:Props){ 
    return <div className="head">
    <div className="col col1">
        Pair
    </div>
    <div className="col  col5">
        Pool on
    </div>
    <div className="col col2 sort_field" onClick={()=>{
        props.onClick && props.onClick("apy")
    }}>
        APY {props.sortField=="apy"?<img className={`${props.sortWay=="desc" && "desc"}`} src={sort_arrow_white}/>:<img src={sort_arrow}/>}
    </div>
    <div className="col col3 sort_field" onClick={()=>{
        props.onClick && props.onClick("liquidity")
    }}>
        Liquidity {props.sortField=="liquidity"?<img className={`${props.sortWay=="desc" && "desc"}`} src={sort_arrow_white}/>:<img src={sort_arrow}/>}
    </div>
    <div className="col col4 sort_field" onClick={()=>{
        props.onClick && props.onClick("slippage")
    }}>
        Slippage {props.sortField=="slippage"?<img className={`${props.sortWay=="desc" && "desc"}`} src={sort_arrow_white}/>:<img src={sort_arrow}/>}
    </div>
   
    <div className="col col6">
        Farm 
    </div>
</div>
}