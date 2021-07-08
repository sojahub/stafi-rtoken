import SwapLoading from "@components/modal/SwapLoading";
import Understood from "@components/modal/understood";
import config from "@config/index";
import {
  bep20ToNativeSwap,
  bridgeCommon_ChainFees,
  BSC_CHAIN_ID,
  erc20ToNativeSwap,
  ETH_CHAIN_ID,
  getBridgeEstimateEthFee,
  nativeToOtherSwap
} from "@features/bridgeClice";
import {
  clickSwapToBep20Link,
  clickSwapToNativeLink,
  getAssetBalanceAll as getBep20AssetBalanceAll,
  getBep20Allowances,
  handleBscAccount
} from "@features/BSCClice";
import {
  clickSwapToErc20Link,
  getAssetBalanceAll,
  getErc20Allowances
} from "@features/ETHClice";
import {
  checkAddress as fis_checkAddress,
  getUnbondCommission as fis_getUnbondCommission,
  query_rBalances_account as fis_query_rBalances_account,
  reloadData as fisReloadData,
  reloadData,
  rTokenRate as fis_rTokenRate
} from "@features/FISClice";
import {
  getUnbondCommission as atom_getUnbondCommission,
  query_rBalances_account as atom_query_rBalances_account,
  reloadData as atomReloadData,
  rTokenRate as atom_rTokenRate
} from "@features/rATOMClice";
import {
  getUnbondCommission as dot_getUnbondCommission,
  query_rBalances_account as dot_query_rBalances_account,
  reloadData as dotReloadData,
  rTokenRate as dot_rTokenRate
} from "@features/rDOTClice";
import { checkEthAddress, handleEthAccount } from "@features/rETHClice";
import {
  getUnbondCommission,
  query_rBalances_account,
  reloadData as ksmReloadData,
  rTokenRate as ksm_rTokenRate
} from "@features/rKSMClice";
import bsc_white from "@images/bsc_white.svg";
import eth_white from "@images/eth_white.svg";
import exchange_svg from "@images/exchange.svg";
import rasset_fis_svg from "@images/rFIS.svg";
import rasset_ratom_svg from "@images/r_atom.svg";
import rasset_rdot_svg from "@images/r_dot.svg";
import rasset_rfis_svg from "@images/r_fis.svg";
import rasset_rksm_svg from "@images/r_ksm.svg";
import stafi_white from "@images/stafi_white.svg";
import Back from "@shared/components/backIcon";
import Button from "@shared/components/button/button";
import Title from "@shared/components/cardTitle";
import Content from "@shared/components/content";
import AddressInputEmbed from "@shared/components/input/addressInputEmbed";
import AmountInputEmbed from "@shared/components/input/amountInputEmbed";
import TypeSelector from "@shared/components/input/typeSelector";
import NumberUtil from "@util/numberUtil";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.scss";

const datas = [
  {
    icon: rasset_fis_svg,
    title: "FIS",
    amount: "--",
    type: "fis",
  },
  {
    icon: rasset_rfis_svg,
    title: "rFIS",
    amount: "--",
    type: "rfis",
  },
  {
    icon: rasset_rdot_svg,
    title: "rDOT",
    amount: "--",
    type: "rdot",
  },
  {
    icon: rasset_rksm_svg,
    title: "rKSM",
    amount: "--",
    type: "rksm",
  },
  {
    icon: rasset_ratom_svg,
    title: "rATOM",
    amount: "--",
    type: "ratom",
  },
];

type SelectorType = {
  icon: any;
  title: string;
  content: string;
  type: string;
};

const tokenDatas = [
  {
    icon: rasset_fis_svg,
    title: "FIS",
    content: "--",
    type: "fis",
  },
  {
    icon: rasset_rfis_svg,
    title: "rFIS",
    content: "--",
    type: "rfis",
  },
  {
    icon: rasset_rdot_svg,
    title: "rDOT",
    content: "--",
    type: "rdot",
  },
  {
    icon: rasset_rksm_svg,
    title: "rKSM",
    content: "--",
    type: "rksm",
  },
  {
    icon: rasset_ratom_svg,
    title: "rATOM",
    content: "--",
    type: "ratom",
  },
];

const assetDatas = [
  {
    icon: stafi_white,
    title: "StaFi Chain",
    content: "Native",
    type: "native",
  },
  {
    icon: eth_white,
    title: "Ethereum",
    content: "ERC20",
    type: "erc20",
  },
  {
    icon: bsc_white,
    title: "Binance Smart Chain",
    content: "BEP20",
    type: "bep20",
  },
];

export default function Index(props: any) {
  const dispatch = useDispatch();
  const [fromAoumt, setFormAmount] = useState<any>();
  const [selectDataSource, setSelectDataSource] = useState(tokenDatas);
  const [tokenType, setTokenType] = useState(tokenDatas[0]);
  const [address, setAddress] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [transferringModalVisible, setTransferringModalVisible] =
    useState(false);

  // const [operationType, setOperationType] = useState<
  //   undefined | "erc20" | "native"
  // >();
  const [fromTypeData, setFromTypeData] = useState<undefined | SelectorType>();
  const [fromTypeSelections, setFromTypeSelections] = useState(assetDatas);
  const [destTypeData, setDestTypeData] = useState<undefined | SelectorType>();
  const [destTypeSelections, setDestTypeSelections] = useState(assetDatas);

  const [reloadFlag, setReloadFlag] = useState(0);
  const [transferDetail, setTransferDetail] = useState("");
  const [viewTxUrl, setViewTxUrl] = useState("");

  const {
    fisAccount,
    ethAccount,
    bscAccount,
    erc20EstimateFee,
    bep20EstimateFee,
    estimateEthFee,
    estimateBscFee,
    rksm_balance,
    rfis_balance,
    fis_balance,
    rdot_balance,
    ratom_balance,
  } = useSelector((state: any) => {
    if (fromTypeData && fromTypeData.type === "erc20") {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(
          state.ETHModule.ercRKSMBalance
        ),
        rfis_balance: NumberUtil.handleFisAmountToFixed(
          state.ETHModule.ercRFISBalance
        ),
        fis_balance: NumberUtil.handleFisAmountToFixed(
          state.ETHModule.ercFISBalance
        ),
        rdot_balance: NumberUtil.handleFisAmountToFixed(
          state.ETHModule.ercRDOTBalance
        ),
        ratom_balance: NumberUtil.handleFisAmountToFixed(
          state.ETHModule.ercRATOMBalance
        ),
        estimateEthFee: state.bridgeModule.estimateEthFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    } else if (fromTypeData && fromTypeData.type === "bep20") {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(
          state.BSCModule.bepRKSMBalance
        ),
        rfis_balance: NumberUtil.handleFisAmountToFixed(
          state.BSCModule.bepRFISBalance
        ),
        fis_balance: NumberUtil.handleFisAmountToFixed(
          state.BSCModule.bepFISBalance
        ),
        rdot_balance: NumberUtil.handleFisAmountToFixed(
          state.BSCModule.bepRDOTBalance
        ),
        ratom_balance: NumberUtil.handleFisAmountToFixed(
          state.BSCModule.bepRATOMBalance
        ),
        estimateBscFee: state.bridgeModule.estimateBscFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
        bscAccount: state.BSCModule.bscAccount,
      };
    } else {
      return {
        rksm_balance: NumberUtil.handleFisAmountToFixed(
          state.rKSMModule.tokenAmount
        ),
        rfis_balance: NumberUtil.handleFisAmountToFixed(
          state.FISModule.tokenAmount
        ),
        rdot_balance: NumberUtil.handleFisAmountToFixed(
          state.rDOTModule.tokenAmount
        ),
        ratom_balance: NumberUtil.handleFisAmountToFixed(
          state.rATOMModule.tokenAmount
        ),
        fis_balance: state.FISModule.fisAccount
          ? state.FISModule.fisAccount.balance
          : "--",

        erc20EstimateFee: state.bridgeModule.erc20EstimateFee,
        bep20EstimateFee: state.bridgeModule.bep20EstimateFee,
        fisAccount: state.FISModule.fisAccount,
        ethAccount: state.rETHModule.ethAccount,
      };
    }
  });

  useEffect(() => {
    dispatch(bridgeCommon_ChainFees());
    dispatch(getBridgeEstimateEthFee());
  }, []);

  useEffect(() => {
    if (fisAccount && fromTypeData && fromTypeData.type == "native") {
      dispatch(reloadData());
      dispatch(query_rBalances_account());
      dispatch(fis_query_rBalances_account());
      dispatch(dot_query_rBalances_account());
      dispatch(atom_query_rBalances_account());
      dispatch(ksm_rTokenRate());
      dispatch(fis_rTokenRate());
      dispatch(dot_rTokenRate());
      dispatch(atom_rTokenRate());
      dispatch(getUnbondCommission());
      dispatch(fis_getUnbondCommission());
      dispatch(dot_getUnbondCommission());
      dispatch(atom_getUnbondCommission());
    }
  }, [
    reloadFlag,
    fisAccount && fisAccount.address,
    fromTypeData && fromTypeData.type,
  ]);

  useEffect(() => {
    if (
      props.match.params &&
      props.match.params.fromType == "erc20" &&
      ethAccount &&
      ethAccount.address
    ) {
      dispatch(handleEthAccount(ethAccount.address));
      dispatch(getErc20Allowances());
      dispatch(getAssetBalanceAll());
    }
    if (
      props.match.params &&
      props.match.params.fromType == "bep20" &&
      bscAccount &&
      bscAccount.address
    ) {
      dispatch(handleBscAccount(bscAccount.address));
      dispatch(getBep20Allowances());
      dispatch(getBep20AssetBalanceAll());
    }
  }, [
    reloadFlag,
    props.match.params && props.match.params.fromType,
    ethAccount && ethAccount.address,
    bscAccount && bscAccount.address,
  ]);

  useEffect(() => {
    if (props.location.state) {
      if (selectDataSource.length > 0) {
        const data = selectDataSource.find(
          (item) => item.title == props.location.state.rSymbol
        );
        setTokenType({ ...data });
      }
    } else {
      setTokenType(selectDataSource[0]);
    }
  }, [props.location.state, selectDataSource]);

  useEffect(() => {
    if (props.match.params && props.match.params.fromType) {
      const data = assetDatas.find(
        (item) => item.type == props.match.params.fromType
      );
      setFromTypeData(data);
      if (props.location.state && props.location.state.destType) {
        const destTypeData = assetDatas.find(
          (item) => item.type == props.location.state.destType
        );
        setDestTypeData(destTypeData);
      } else {
        if (props.match.params.fromType === "native") {
          setDestTypeData(assetDatas[1]);
        } else {
          setDestTypeData(assetDatas[0]);
        }
      }
    } else {
      setFromTypeData(assetDatas[0]);
      setDestTypeData(assetDatas[1]);
    }
  }, [
    props.match.params && props.match.params.fromType,
    props.location.state && props.location.state.destType,
  ]);

  useEffect(() => {
    selectDataSource[0].content = fis_balance;
    selectDataSource[1].content = rfis_balance;
    selectDataSource[2].content = rdot_balance;
    selectDataSource[3].content = rksm_balance;
    selectDataSource[4].content = ratom_balance;
    setSelectDataSource([...selectDataSource]);

    if ((tokenType.title = "FIS")) {
      tokenType.content = fis_balance;
    } else if ((tokenType.title = "rFIS")) {
      tokenType.content = rfis_balance;
    } else if ((tokenType.title = "rKSM")) {
      tokenType.content = rksm_balance;
    } else if ((tokenType.title = "rDOT")) {
      tokenType.content = rdot_balance;
    } else if ((tokenType.title = "rATOM")) {
      tokenType.content = ratom_balance;
    }
    setTokenType({ ...tokenType });
  }, [rksm_balance, rfis_balance, fis_balance, rdot_balance, ratom_balance]);

  useEffect(() => {
    if (fromTypeData) {
      if (
        props.match.params &&
        props.match.params.fromType !== fromTypeData.type
      ) {
        props.history.push({
          pathname: `/rAsset/swap/${fromTypeData.type}`,
          state: {
            destType: destTypeData && destTypeData.type,
            rSymbol: tokenType && tokenType.title,
          },
        });
      }

      if (fromTypeData.type == "native") {
        setFromTypeSelections([assetDatas[0]]);
      } else {
        setFromTypeSelections([assetDatas[1], assetDatas[2]]);
      }
    }
  }, [fromTypeData && fromTypeData.type]);

  useEffect(() => {
    if (destTypeData) {
      if (destTypeData.type == "native") {
        setDestTypeSelections([assetDatas[0]]);
      } else {
        setDestTypeSelections([assetDatas[1], assetDatas[2]]);
      }
    }
  }, [destTypeData && destTypeData.type]);

  const reverseExchangeType = () => {
    const oldFromTypeData = fromTypeData;
    setFromTypeData(destTypeData);
    setDestTypeData(oldFromTypeData);
    setFormAmount("");
    setAddress("");
  };

  if (
    fromTypeData &&
    fromTypeData.type == "native" &&
    (!fisAccount || !fisAccount.address)
  ) {
    props.history.push("/rAsset/native");
    return null;
  }

  if (
    fromTypeData &&
    fromTypeData.type == "erc20" &&
    (!ethAccount || !ethAccount.address)
  ) {
    props.history.push("/rAsset/eth");
    return null;
  }

  if (
    fromTypeData &&
    fromTypeData.type == "bep20" &&
    (!bscAccount || !bscAccount.address)
  ) {
    props.history.push("/rAsset/bep");
    return null;
  }

  const checkAddress = (address: string) => {
    return fis_checkAddress(address);
  };

  return (
    <Content className="stafi_rasset_swap ">
      <Back
        top={"40px"}
        left={"50px"}
        onClick={() => {
          props.history && props.history.push("/rAsset/native");
        }}
      />
      <div className={"title_container"}>
        <Title label="rBridge Swap" padding={"30px 0"} />
      </div>

      <div>
        <div className="row" style={{ marginBottom: 0 }}>
          <div className={"asset_selector_container"}>
            <div className={"selector_container"}>
              <TypeSelector
                popTitle={"Select a Chain"}
                selectDataSource={fromTypeSelections}
                selectedData={fromTypeData}
                selectedTitle={fromTypeData ? fromTypeData.content : ""}
                selectedDescription={fromTypeData ? fromTypeData.title : ""}
                onSelectChange={(e: SelectorType) => {
                  setFormAmount("");
                  setAddress("");
                  setFromTypeData(e);
                }}
              />
            </div>

            <div>
              {/* <img className={"arrow_icon"} src={right_arrow_solid} /> */}
              <div>
                <a onClick={reverseExchangeType}>
                  <img className={"exchange_icon"} src={exchange_svg} />
                </a>
              </div>
            </div>

            <div className={"selector_container"}>
              <TypeSelector
                popTitle={"Select a Chain"}
                selectDataSource={destTypeSelections}
                selectedData={destTypeData}
                selectedTitle={destTypeData ? destTypeData.content : ""}
                selectedDescription={destTypeData ? destTypeData.title : ""}
                onSelectChange={(e: SelectorType) => {
                  setFormAmount("");
                  setAddress("");
                  setDestTypeData(e);
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <TypeSelector
              popTitle={
                fromTypeData ? "Select a " + fromTypeData.type + " rToken" : ""
              }
              selectDataSource={selectDataSource}
              selectedData={tokenType}
              selectedTitle={tokenType ? tokenType.title : ""}
              onSelectChange={(e: SelectorType) => {
                setFormAmount("");
                setAddress("");
                setTokenType({ ...e });
              }}
            />
          </div>

          <div className={"input_container"} style={{ marginTop: "20px" }}>
            <div className={"title"}>Swap Amount</div>
            <AmountInputEmbed
              maxInput={tokenType.content}
              placeholder="0.0"
              value={fromAoumt}
              onChange={(value: any) => {
                setFormAmount(value);
              }}
            />
          </div>

          <div className={"input_container"} style={{ marginTop: "20px" }}>
            <div className={"title"}>Received Address</div>
            <AddressInputEmbed
              placeholder="0x..."
              value={address}
              onChange={(e: any) => {
                setAddress(e.target.value);
              }}
            />
          </div>
        </div>

        <div
          className={`row last link_container ${address && "show_tip"}`}
          style={{ marginBottom: "4px", marginTop: "4px" }}
        >
          {address && destTypeData && destTypeData.type == "native" && (
            <div className="tip">
              Click on this{" "}
              <a href={clickSwapToNativeLink(address)} target="_blank">
                link
              </a>{" "}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == "erc20" && (
            <div className="tip">
              Click on this{" "}
              <a
                href={clickSwapToErc20Link(tokenType.title, address)}
                target="_blank"
              >
                link
              </a>{" "}
              to check your swap status.
            </div>
          )}
          {address && destTypeData && destTypeData.type == "bep20" && (
            <div className="tip">
              Click on this{" "}
              <a
                href={clickSwapToBep20Link(tokenType.title, address)}
                target="_blank"
              >
                link
              </a>{" "}
              to check your swap status.
            </div>
          )}
        </div>

        <div className="fee">
          {fromTypeData &&
            fromTypeData.type === "erc20" &&
            `Estimate Fee: ${estimateEthFee} ETH`}

          {fromTypeData &&
            fromTypeData.type === "bep20" &&
            `Estimate Fee: ${estimateBscFee} BNB`}

          {fromTypeData &&
            fromTypeData.type === "native" &&
            destTypeData &&
            destTypeData.type === "erc20" &&
            `Estimate Fee: ${erc20EstimateFee} FIS`}

          {fromTypeData &&
            fromTypeData.type === "native" &&
            destTypeData &&
            destTypeData.type === "bep20" &&
            `Estimate Fee: ${bep20EstimateFee} FIS`}
        </div>

        <div className="btns">
          <Button
            disabled={!(fromAoumt && address)}
            onClick={() => {
              if (fromTypeData && fromTypeData.type === "erc20") {
                if (
                  !ethAccount ||
                  Number(ethAccount.balance) <= Number(estimateEthFee)
                ) {
                  message.error(`No enough ETH to pay for the fee`);
                  return;
                }
                if (!checkAddress(address)) {
                  message.error("Input address error");
                  return;
                }
              }
              if (fromTypeData && fromTypeData.type === "bep20") {
                if (
                  !bscAccount ||
                  Number(bscAccount.balance) <= Number(estimateBscFee)
                ) {
                  message.error(`No enough BNB to pay for the fee`);
                  return;
                }
                if (!checkAddress(address)) {
                  message.error("Input address error");
                  return;
                }
              }
              if (
                fromTypeData &&
                fromTypeData.type === "native" &&
                destTypeData &&
                destTypeData.type === "erc20"
              ) {
                if (Number(fis_balance) <= Number(erc20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
                if (!checkEthAddress(address)) {
                  message.error("Input address error");
                  return;
                }
              }
              if (
                fromTypeData &&
                fromTypeData.type === "native" &&
                destTypeData &&
                destTypeData.type === "bep20"
              ) {
                if (Number(fis_balance) <= Number(bep20EstimateFee)) {
                  message.error(`No enough FIS to pay for the fee`);
                  return;
                }
                if (!checkEthAddress(address)) {
                  message.error("Input address error");
                  return;
                }
              }

              if (fromTypeData && fromTypeData.type === "native") {
                let chainId = ETH_CHAIN_ID;
                if (destTypeData && destTypeData.type === "bep20") {
                  chainId = BSC_CHAIN_ID;
                }
                dispatch(
                  nativeToOtherSwap(
                    chainId,
                    tokenType.title,
                    tokenType.type,
                    fromAoumt,
                    address,
                    () => {
                      setTransferDetail(
                        `${fromAoumt} ${tokenType && tokenType.title} ${
                          fromTypeData && fromTypeData.content
                        }`
                      );
                      if (destTypeData && destTypeData.type === "erc20") {
                        setViewTxUrl(
                          config.etherScanErc20TxInAddressUrl(address)
                        );
                      } else {
                        setViewTxUrl(
                          config.bscScanBep20TxInAddressUrl(address)
                        );
                      }

                      setFormAmount("");
                      setAddress("");
                      setReloadFlag(reloadFlag + 1);
                      setTransferringModalVisible(true);
                    }
                  )
                );
              } else {
                // bep20ToNativeSwap
                let swapFun;
                if (fromTypeData && fromTypeData.type === "erc20") {
                  swapFun = erc20ToNativeSwap;
                } else if (fromTypeData && fromTypeData.type === "bep20") {
                  swapFun = bep20ToNativeSwap;
                }
                if (swapFun) {
                  dispatch(
                    swapFun(
                      tokenType.title,
                      tokenType.type,
                      fromAoumt,
                      address,
                      () => {
                        setTransferDetail(
                          `${fromAoumt} ${tokenType && tokenType.title} ${
                            fromTypeData && fromTypeData.content
                          }`
                        );
                        setViewTxUrl(config.stafiScanUrl(address));
                        setFormAmount("");
                        setAddress("");
                        setReloadFlag(reloadFlag + 1);
                        setTransferringModalVisible(true);
                      }
                    )
                  );
                }
              }
            }}
          >
            Swap
          </Button>
        </div>
      </div>
      <Understood
        visible={visible}
        context={
          fromTypeData && fromTypeData.type === "native"
            ? `Tx is broadcasting, please check your ${tokenType.title} balance on your Metamask later. It may take 2~10 minutes`
            : `Tx is broadcasting, please check your ${tokenType.title} balance later. It may take 2~10 minutes`
        }
        onOk={() => {
          if (fromTypeData && fromTypeData.type === "native") {
            if (tokenType.title == "FIS" || tokenType.title == "rFIS") {
              dispatch(fisReloadData());
            }
            if (tokenType.title == "rKSM") {
              dispatch(ksmReloadData());
            }
            if (tokenType.title == "rDOT") {
              dispatch(dotReloadData());
            }
            if (tokenType.title == "rATOM") {
              dispatch(atomReloadData());
            }
          } else {
            dispatch(getAssetBalanceAll());
            dispatch(getErc20Allowances());
          }
          setFormAmount(undefined);
          setAddress(undefined);
          setVisible(false);
        }}
      />

      <SwapLoading
        visible={transferringModalVisible}
        destChainName={destTypeData && destTypeData.title}
        transferDetail={transferDetail}
        viewTxUrl={viewTxUrl}
        onClose={() => setTransferringModalVisible(false)}
      />
    </Content>
  );
}
