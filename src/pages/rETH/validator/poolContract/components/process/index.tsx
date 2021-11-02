import React from 'react';
import zs_svg from 'src/assets/images/zs.svg';
import './index.scss';

type Props={
    status:Number,
    currentBalance:any
}
export default function Index(props:Props){
    return <div className="pool_content_process">
            <div className="container">
                <div className={`Matched ${props.status >= 0 && "active"}`}>
                    <label>{Number(props.currentBalance)>8?"Matched":"Matching"}</label>
                    <div className="icon">
                    {props.status >= 0 && <img src={zs_svg} /> }
                    </div>
                </div>
                <div className={`Deposited  ${(props.status >= 1 && props.status !=7) && "active"}`}>
                <label>Deposited</label>
                    <div className="icon">
                    {(props.status >= 1 && props.status !=7) &&<img src={zs_svg} />}
                    </div>
                </div> 
                <div className={`Pending  ${(props.status >= 2 && props.status !=7) && "active"}`}>
                <label>Pending</label>
                    <div className="icon">
                    {(props.status >= 2 && props.status !=7) && <img src={zs_svg} />}
                    </div>
                </div>
                <div className={`Active  ${(props.status >= 3 && props.status !=7) && "active"}`}>
                    <label>Active</label>
                    <div className="icon">
                    {(props.status >= 3 && props.status !=7) && <img src={zs_svg} />}
                    </div>
                </div>
                <div className={`Exit  ${(props.status >= 4 && props.status !=7) && "active"}`}>
                    <label>Exit</label>
                    <div className="icon">
                    {(props.status >= 4 && props.status !=7) && <img src={zs_svg} />}
                    </div>
                </div>
            </div>
    </div>
}