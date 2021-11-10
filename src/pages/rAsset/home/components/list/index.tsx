import React from 'react'

import './index.scss'
type Props={
  children?:any
}
export default function index(props:Props){

  return <div className="stafi_rAsset_list">
    {props.children}
    {/* <Item />
    <Item />
    <Item />
    <Item />
    <Item />
    <Item /> */}
  </div>
}