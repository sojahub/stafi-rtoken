import React from "react";
import "./index.scss";

type Props = {
  type: "native" | "erc" | "bep";
  onClick?: Function;
};
export default function index(props: Props) {
  return (
    <div className="rAsset_tag">
      <div
        className={`${props.type == "native" && "tag_active"}`}
        onClick={() => {
          props.onClick && props.type != "native" && props.onClick('native');
        }}
      >
        Native<label>/ StaFi</label>
      </div>
      <div
        className={`${props.type == "erc" && "tag_active"}`}
        onClick={() => {
          props.onClick && props.type != "erc" && props.onClick('erc');
        }}
      >
        ERC20<label>/ Ethereum</label>
      </div>
      <div
        className={`${props.type == "bep" && "tag_active"}`}
        onClick={() => {
          props.onClick && props.type != "bep" && props.onClick('bep');
        }}
      >
        BEP20<label>/ BSC</label>
      </div>
    </div>
  );
}
