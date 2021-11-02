import React from "react";
import leftArrowSvg from "src/assets/images/left_arrow.svg";
import "./index.scss";

type Props = {
  onClick?: Function;
  top?: any;
  left?: any;
};
export default function Index(props: Props) {
  return (
    <img
      className="stafi_card_back"
      style={{
        left: props.left ? props.left : "60px",
        top: props.top ? props.top : "50px",
      }}
      src={leftArrowSvg}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    />
  );
}
