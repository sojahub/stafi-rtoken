import React, { useState } from 'react';
import {Upload} from 'antd';
import './index.scss';
import { PropertySafetyFilled } from '@ant-design/icons';
import { Proposal } from '@cosmjs/stargate/build/codec/tendermint/types/types';

const { Dragger } = Upload;
type Props={
    onChange?:Function,
    currentPoolStatus?:Number
}
export default function Index(props:Props){
    const [fileName,setFileName]=useState();
    return <Dragger accept=".json"  disabled={props.currentPoolStatus==2} showUploadList={false} beforeUpload ={(e:any)=>{ 
        setFileName(e.name);
        props.onChange && props.onChange(e);
        return false;
    }} className="stafi_upload">
        {fileName?<label className="file_name">{fileName}</label>:<label className="tip">{props.currentPoolStatus==2?"File is submitted":"Upload your file"}</label>}
    </Dragger>
}