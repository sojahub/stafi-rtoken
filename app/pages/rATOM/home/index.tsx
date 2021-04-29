import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router'
import HomeCard from '@components/card/homeCard';   
import rDOT_svg from '@images/rDOT.svg'   
import {connectPolkadot_atom} from '@features/globalClice'
import './index.scss';


// import { SigningStargateClient, coins } from '@cosmjs/stargate';
// import {
//     makeAuthInfoBytes,
//     makeSignDoc,
//     makeSignBytes
// } from "@cosmjs/proto-signing";

// declare const window: any;


//  window.onload = async () => {
//      // Keplr extension injects the offline signer that is compatible with cosmJS.
//      // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
//      // And it also injects the helper function to `window.keplr`.
//      // If `window.getOfflineSigner` or `window.keplr` is null, Keplr extension may be not installed on browser.
//      if (!window.getOfflineSigner || !window.keplr) {
//          alert("Please install keplr extension");
//      } else {
//          if (window.keplr.experimentalSuggestChain) {
//              try {
//                  // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
//                  // cosmoshub-3 is integrated to Keplr so the code should return without errors.
//                  // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
//                  // If the user approves, the chain will be added to the user's Keplr extension.
//                  // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
//                  // If the same chain id is already registered, it will resolve and not require the user interactions.
//                  await window.keplr.experimentalSuggestChain({
//                      // Chain-id of the Cosmos SDK chain.
//                      chainId: "stargate-final",
//                      // The name of the chain to be displayed to the user.
//                      chainName: "Cosmos-stargate",
//                      // RPC endpoint of the chain.
//                      rpc: "https://testcosmosrpc.wetez.io",
//                      // REST endpoint of the chain.
//                      rest: "https://testcosmosrset.wetez.io",
//                      // Staking coin information
//                      stakeCurrency: {
//                          // Coin denomination to be displayed to the user.
//                          coinDenom: "MUON",
//                          // Actual denom (i.e. uatom, uscrt) used by the blockchain.
//                          coinMinimalDenom: "umuon",
//                          // # of decimal points to convert minimal denomination to user-facing denomination.
//                          coinDecimals: 6,
//                      },
//                      // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
//                      // The 'stake' button in Keplr extension will link to the webpage.
//                      // walletUrlForStaking: "",
//                      // The BIP44 path.
//                      bip44: {
//                          // You can only set the coin type of BIP44.
//                          // 'Purpose' is fixed to 44.
//                          coinType: 118,
//                      },
//                      // Bech32 configuration to show the address to user.
//                      bech32Config: {
//                          bech32PrefixAccAddr: "cosmos",
//                          bech32PrefixAccPub: "cosmospub",
//                          bech32PrefixValAddr: "cosmosvaloper",
//                          bech32PrefixValPub: "cosmosvaloperpub",
//                          bech32PrefixConsAddr: "cosmosvalcons",
//                          bech32PrefixConsPub: "cosmosvalconspub"
//                      },
//                      // List of all coin/tokens used in this chain.
//                      currencies: [{
//                          // Coin denomination to be displayed to the user.
//                          coinDenom: "MUON",
//                          // Actual denom (i.e. uatom, uscrt) used by the blockchain.
//                          coinMinimalDenom: "umuon",
//                          // # of decimal points to convert minimal denomination to user-facing denomination.
//                          coinDecimals: 6,
//                      }],
//                      // List of coin/tokens used as a fee token in this chain.
//                      feeCurrencies: [{
//                          // Coin denomination to be displayed to the user.
//                          coinDenom: "MUON",
//                          // Actual denom (i.e. uatom, uscrt) used by the blockchain.
//                          coinMinimalDenom: "umuon",
//                          // # of decimal points to convert minimal denomination to user-facing denomination.
//                          coinDecimals: 6,
//                      }],
//                      // (Optional) The number of the coin type.
//                      // This field is only used to fetch the address from ENS.
//                      // Ideally, it is recommended to be the same with BIP44 path's coin type.
//                      // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
//                      // So, this is separated to support such chains.
//                      coinType: 118,
//                      // (Optional) This is used to set the fee of the transaction.
//                      // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
//                      // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
//                      // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
//                      gasPriceStep: {
//                          low: 0.01,
//                          average: 0.025,
//                          high: 0.04
//                      }
//                  });
//              } catch {
//                  alert("Failed to suggest the chain");
//              }
//          } else {
//              alert("Please use the recent version of keplr extension");
//          }
//      }

//      // const chainId = "cosmoshub-4";

//      const chainId = "stargate-final";

//      // You should request Keplr to enable the wallet.
//      // This method will ask the user whether or not to allow access if they haven't visited this website.
//      // Also, it will request user to unlock the wallet if the wallet is locked.
//      // If you don't request enabling before usage, there is no guarantee that other methods will work.
//      await window.keplr.enable(chainId);

      

//  };
export default function Inde(props:any){
  const dispatch = useDispatch();
  const hasAcount=useSelector((state:any)=>{
    if(state.FISModule.fisAccount){
      return true
    }else{
      return false
    }
  })
  if(hasAcount){
    return <Redirect to="/rATOM/type" />
  }
  return <HomeCard 
      title={<><label>Liquify</label> Your Staking ATOM</>}
      subTitle={"Staking via StaFi Staking Contract and get rATOM in return"}
      btnText="Connect to Polkadotjs extension"
      btnIcon={rDOT_svg} 
      onBtnClick={()=>{  
        dispatch(connectPolkadot_atom(()=>{
          props.history.push("/rATOM/wallet")
        })) 
      }}
      onIntroUrl=""
  />
}