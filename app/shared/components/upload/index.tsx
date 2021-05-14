import React, { useState } from 'react';
import {Upload} from 'antd';
import './index.scss';

const { Dragger } = Upload;
type Type={
    onChange?:Function
}
export default function Index(){
    const [fileName,setFileName]=useState();
    return <Dragger showUploadList={false} beforeUpload ={(e:any)=>{
        console.log(e,"========");
        setFileName(e.name);
        return false;
    }} className="stafi_upload">
        {fileName?<label className="file_name">{fileName}</label>:<label className="tip">upload your file</label>}
    </Dragger>
}