import config from "@config/index";
import { getRtokenPriceList } from "@features/bridgeClice";
import {
  connectMetamask,
  getAssetBalanceAll,
  handleBscAccount
} from "@features/BSCClice";
import CommonClice from "@features/commonClice";
import {
  getUnbondCommission as fis_getUnbondCommission,
  rTokenRate as fis_rTokenRate
} from "@features/FISClice";
import {
  getUnbondCommission as atom_getUnbondCommission,
  rTokenRate as atom_rTokenRate
} from "@features/rATOMClice";
import {
  getUnbondCommission as dot_getUnbondCommission,
  rTokenRate as dot_rTokenRate
} from "@features/rDOTClice";
import { monitoring_Method } from "@features/rETHClice";
import {
  getUnbondCommission as ksm_getUnbondCommission,
  rTokenRate as ksm_rTokenRate
} from "@features/rKSMClice";
import metamask from "@images/metamask.png";
import rasset_fis_svg from "@images/rFIS.svg";
import rasset_ratom_svg from "@images/r_atom.svg";
import rasset_rdot_svg from "@images/r_dot.svg";
import rasset_rfis_svg from "@images/r_fis.svg";
import rasset_rksm_svg from "@images/r_ksm.svg";
import Button from "@shared/components/button/connect_button";
import Content from "@shared/components/content";
import NumberUtil from "@util/numberUtil";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tag from "./components/carTag/index";
import CountAmount from "./components/countAmount";
import DataList from "./components/list";
import DataItem from "./components/list/item";
import "./page.scss";

const commonClice = new CommonClice();
export default function Index(props: any) {
  const dispatch = useDispatch();

  const {
    bscAccount,
    ksm_bepBalance,
    fis_bepBalance,
    rfis_bepBalance,
    dot_bepBalance,
    atom_bepBalance,
    ksmWillAmount,
    fisWillAmount,
    dotWillAmount,
    unitPriceList,
    atomWillAmount,
  } = useSelector((state: any) => {
    return {
      bscAccount: state.BSCModule.bscAccount,
      unitPriceList: state.bridgeModule.priceList,
      ksm_bepBalance: state.BSCModule.bepRKSMBalance,
      fis_bepBalance: state.BSCModule.bepFISBalance,
      rfis_bepBalance: state.BSCModule.bepRFISBalance,
      dot_bepBalance: state.BSCModule.bepRDOTBalance,
      atom_bepBalance: state.BSCModule.bepRATOMBalance,
      ksmWillAmount: commonClice.getWillAmount(
        state.rKSMModule.ratio,
        state.rKSMModule.unbondCommission,
        state.ETHModule.ercRKSMBalance
      ),
      fisWillAmount: commonClice.getWillAmount(
        state.FISModule.ratio,
        state.FISModule.unbondCommission,
        state.ETHModule.ercRFISBalance
      ),
      dotWillAmount: commonClice.getWillAmount(
        state.rDOTModule.ratio,
        state.rDOTModule.unbondCommission,
        state.ETHModule.ercRDOTBalance
      ),
      atomWillAmount: commonClice.getWillAmount(
        state.rATOMModule.ratio,
        state.rATOMModule.unbondCommission,
        state.ETHModule.ercRATOMBalance
      ),
    };
  });
  const totalPrice = useMemo(() => {
    let count: any = "--";
    unitPriceList.forEach((item: any) => {
      if (count == "--") {
        count = 0;
      }
      if (item.symbol == "rFIS" && rfis_bepBalance && rfis_bepBalance != "--") {
        count = count + item.price * rfis_bepBalance;
      } else if (
        item.symbol == "FIS" &&
        fis_bepBalance &&
        fis_bepBalance != "--"
      ) {
        count = count + item.price * fis_bepBalance;
      } else if (
        item.symbol == "rKSM" &&
        ksm_bepBalance &&
        ksm_bepBalance != "--"
      ) {
        count = count + item.price * ksm_bepBalance;
      } else if (
        item.symbol == "rDOT" &&
        dot_bepBalance &&
        dot_bepBalance != "--"
      ) {
        count = count + item.price * dot_bepBalance;
      } else if (
        item.symbol == "rATOM" &&
        atom_bepBalance &&
        atom_bepBalance != "--"
      ) {
        count = count + item.price * atom_bepBalance;
      }
    });
    return count;
  }, [
    unitPriceList,
    ksm_bepBalance,
    fis_bepBalance,
    rfis_bepBalance,
    dot_bepBalance,
    atom_bepBalance,
  ]);

  useEffect(() => {
    if (bscAccount && bscAccount.address) {
      dispatch(handleBscAccount(bscAccount.address));

      dispatch(getAssetBalanceAll());

      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(ksm_getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
    }
  }, [bscAccount && bscAccount.address]);

  useEffect(() => {
    dispatch(getRtokenPriceList());
    dispatch(monitoring_Method());
  }, []);

  const toSwap = (tokenSymbol: string) => {
    props.history.push({
      pathname: "/rAsset/swap/bep20",
      state: {
        rSymbol: tokenSymbol,
      },
    });
  };

  return (
    <Content>
      <Tag
        type="bep"
        onClick={(type: string) => {
          props.history.push(`/rAsset/${type}`);
        }}
      />
      {bscAccount ? (
        <>
          <DataList>
            <DataItem
              rSymbol="FIS"
              icon={rasset_fis_svg}
              fullName="StaFi"
              balance={
                fis_bepBalance == "--"
                  ? "--"
                  : NumberUtil.handleFisAmountToFixed(fis_bepBalance)
              }
              willGetBalance={0}
              unit="FIS"
              trade={config.uniswapUrl(
                "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
                config.FISBep20TokenAddress()
              )}
              operationType="erc20"
              onSwapClick={() => toSwap("FIS")}
            />

            <DataItem
              rSymbol="rFIS"
              icon={rasset_rfis_svg}
              fullName="StaFi"
              balance={
                rfis_bepBalance == "--"
                  ? "--"
                  : NumberUtil.handleFisAmountToFixed(rfis_bepBalance)
              }
              willGetBalance={fisWillAmount}
              unit="FIS"
              trade={config.uniswapUrl(
                "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
                config.rFISBep20TokenAddress()
              )}
              operationType="erc20"
              onSwapClick={() => toSwap("rFIS")}
            />
            <DataItem
              rSymbol="rDOT"
              icon={rasset_rdot_svg}
              fullName="Polkadot"
              balance={
                dot_bepBalance == "--"
                  ? "--"
                  : NumberUtil.handleFisAmountToFixed(dot_bepBalance)
              }
              willGetBalance={dotWillAmount}
              unit="DOT"
              trade={config.uniswapUrl(
                "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
                config.rDOTBep20TokenAddress()
              )}
              operationType="erc20"
              onSwapClick={() => toSwap("rDOT")}
            />

            <DataItem
              rSymbol="rKSM"
              icon={rasset_rksm_svg}
              fullName="Kusama"
              balance={
                ksm_bepBalance == "--"
                  ? "--"
                  : NumberUtil.handleFisAmountToFixed(ksm_bepBalance)
              }
              willGetBalance={ksmWillAmount}
              unit="KSM"
              trade={config.uniswapUrl(
                "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
                config.rKSMBep20TokenAddress()
              )}
              operationType="erc20"
              onSwapClick={() => toSwap("rKSM")}
            />
            <DataItem
              rSymbol="rATOM"
              icon={rasset_ratom_svg}
              fullName="Cosmos"
              balance={
                atom_bepBalance == "--"
                  ? "--"
                  : NumberUtil.handleFisAmountToFixed(atom_bepBalance)
              }
              willGetBalance={atomWillAmount}
              unit="ATOM"
              trade={config.uniswapUrl(
                "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
                config.rATOMBep20TokenAddress()
              )}
              operationType="erc20"
              onSwapClick={() => toSwap("rATOM")}
            />
          </DataList>{" "}
          <CountAmount totalValue={totalPrice} />
        </>
      ) : (
        <div className="rAsset_content">
          <Button
            icon={metamask}
            onClick={() => {
              dispatch(connectMetamask("0x61"));
              dispatch(monitoring_Method());
            }}
          >
            Connect to Metamask
          </Button>
        </div>
      )}
    </Content>
  );
}
