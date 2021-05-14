import React from 'react';
import zs_svg from '@images/zs.svg'
import './index.scss'

type Props={
    status:1|2|3|4|5
}
export default function Index(props:Props){
    return <div className="pool_content_process">
            <div className="container">
                <div className={`Matched ${props.status>=1 && "active"}`}>
                    <label>Matched</label>
                    <div className="icon">
                        <img src={zs_svg} />
                    </div>
                </div>
                <div className={`Deposited  ${props.status>=2 && "active"}`}>
                <label>Deposited</label>
                    <div className="icon">
                        <img src={zs_svg} />
                    </div>
                </div> 
                <div className={`Pending  ${props.status>=3 && "active"}`}>
                <label>Pending</label>
                    <div className="icon">
                        <img src={zs_svg} />
                    </div>
                </div>
                <div className={`Active  ${props.status>=4 && "active"}`}>
                    <label>Active</label>
                    <div className="icon">
                        <img src={zs_svg} />
                    </div>
                </div>
                <div className={`Exit  ${props.status>=5 && "active"}`}>
                    <label>Exit</label>
                    <div className="icon">
                        <img src={zs_svg} />
                    </div>
                </div>
            </div>
    </div>
}