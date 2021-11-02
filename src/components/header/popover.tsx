import { checkAll_minting, check_swap_status, readNotice, setProcess } from '@features/noticeClice';
import { Popover } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './popover.scss';
import Item from './popoverItem';

type Props = {
  visible: boolean;
  onVisibleChange: Function;
  children: any;
  history?: any;
};
export default function Index(props: Props) {
  const dispatch = useDispatch();

  const data = useSelector((state: any) => {
    return state.noticeModule.noticeData;
  });

  useEffect(() => {}, []);
  const content = (
    <>
      {!data && <Item noData={true} />}
      {data &&
        data.datas.map((item: any, index: any) => {
          return (
            <Item
              key={index}
              data={item}
              hideNoticePopover={() => props.onVisibleChange(false)}
              onClick={() => {
                dispatch(setProcess(item, data.datas));
                // const hasGo_DOT = location.pathname.includes('/rDOT');
                // if (item.rSymbol == Symbol.Dot && !hasGo_DOT) {
                //   props.history && props.history.push('/rDOT/home');
                // }

                // const hasGo_KSM = location.pathname.includes('/rKSM');
                // if (item.rSymbol == Symbol.Ksm && !hasGo_KSM) {
                //   props.history && props.history.push('/rKSM/home');
                // }
                // const hasGo_ATOM = location.pathname.includes('/rATOM');
                // if (item.rSymbol == Symbol.Ksm && !hasGo_KSM) {
                //   props.history && props.history.push('/rATOM/home');
                // }

                // const hasGo_rMATIC = location.pathname.includes('/rMATIC');
                // if (item.rSymbol == Symbol.Matic && !hasGo_rMATIC) {
                //   props.history && props.history.push('/rMATIC/home');
                // }
              }}
            />
          );
        })}
    </>
  );
  return (
    <Popover
      visible={props.visible}
      onVisibleChange={(e) => {
        if (e) {
          dispatch(checkAll_minting(data ? data.datas : []));
          dispatch(check_swap_status());
          dispatch(readNotice({}));
        }
        props.onVisibleChange(e);
      }}
      placement='bottomLeft'
      overlayClassName='stafi_notice_popover'
      title='Notification'
      content={content}
      trigger='click'>
      {props.children}
    </Popover>
  );
}
