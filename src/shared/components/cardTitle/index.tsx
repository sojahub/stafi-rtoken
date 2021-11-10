import React from "react";
import "./index.scss";
type Props = {
  label: string;
  padding?: any;
};
export default function Index(props: Props) {
  return (
    <div
      className="stafi_card_title"
      style={{ padding: props.padding ? props.padding : "" }}
    >
      {props.label}
    </div>
  );
}
