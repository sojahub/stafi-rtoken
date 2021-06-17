import React from 'react'; 
import Card from '@components/card/index';
import A from '@shared/components/button/a';
import CardItem from './components/cardItem';
import TableHead from './components/tableHead';
import TableItem from './components/tableItem'
import './index.scss';

export default function Inde(props:any){ 
 
  return <Card className="stafi_rpool_home_card">
      <div className="title">
        <label>Provide liquidity and earn reward</label><A>How to earn</A>
      </div>
      <div className="card_list">
        <CardItem label="Total Liquidity" value="$232,236,774"/>
        <CardItem label="Farming APY. avg" value="234.234%"/>
        <CardItem label="rToken Price Slippage. avg" value="0.2%"/>
      </div>
      <div className="table">
            
            <TableHead/>
            <div className="table_body">
            <TableItem/>
            <TableItem/>
            <TableItem/>
            <TableItem/>
            <TableItem/>
            <TableItem/>
            <TableItem/>
            <TableItem/>
            </div>
      </div>
  </Card>
}