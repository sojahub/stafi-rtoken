import React from 'react'; 
import Content from '../components/validatorContent';  
import LeftContent from '@components/content/leftContent';
import rFIS_stafi_svg from '@images/selected_r_fis.svg';
import rFIS_detail_svg from '@images/rfis_detail.svg';
import Button from '@shared/components/button/button'; 
import no_details from '@images/noDetail.png'
import A from '@shared/components/button/a';
import './index.scss';

export default function Index(props:any){
  return <LeftContent className="stafi_validator_context rfis_offboard_context">
      <div className="item first">
          <div className="title">
              <div>
                  <img src={rFIS_stafi_svg} />  Nominated FIS
              </div>
               <A>
                  Active
               </A>
          </div>

          <div className="info">
            <div className="rfis_value">
              64.15
            </div>
            <div className="rfis_info_item">
              Self-bond: <label>12.342398</label>
            </div>
            <div className="rfis_info_item">
              Reward last 7-day: 102.234234 FIS
            </div>
            <div className="rfis_info_item">
              Commission: 10%
            </div>
          </div>
      </div>
      <div className="item last nodata">
          <div className="title">
              <div>
                  <img src={rFIS_detail_svg} />  Nominated Details
              </div> 
          </div>
          <img className="no_details" src={no_details} />
          {/* <div className="list">
              <div className="row">
                  <div className="col col1">
                    Pool Address: <A>3Ns23…HNe8</A>
                  </div>
                  <div className="col col2">
                    ERA 34
                  </div>
                  <div className="col col3">
                    +2833.234 FIS
                  </div>
              </div>
              <div className="row">
                  <div className="col col1">
                    Pool Address: <A>3Ns23…HNe8</A>
                  </div>
                  <div className="col col2">
                    ERA 34
                  </div>
                  <div className="col col3">
                    +2833.234 FIS
                  </div>
              </div>
          </div> */}
          <div className="btns">
            <Button size="small" btnType="ellipse" >Offboard</Button>
          </div>
      </div>
    </LeftContent>
}