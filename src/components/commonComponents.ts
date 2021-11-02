import styled from 'styled-components';

interface TextProps {
  size: any;
  color?: any;
  bold?: boolean;
  sameLineHeight?: boolean;
  mt?: any;
  mb?: any;
  ml?: any;
  mr?: any;
  textDecoration?: any;
  scale?: any;
  transformOrigin?: any;
  whiteSpace?: any;
  clickable?: boolean;
}

export const Text = styled.div<TextProps>`
  font-size: ${(props) => props.size};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  color: ${(props) => props.color || '#fff'};
  font-family: ${(props) => (props.bold ? 'Helvetica-Bold' : 'Helvetica')};
  line-height: ${(props) => (props.sameLineHeight ? props.size : '')};
  margin-top: ${(props) => props.mt};
  margin-bottom: ${(props) => props.mb};
  margin-left: ${(props) => props.ml};
  margin-right: ${(props) => props.mr};
  text-decoration: ${(props) => props.textDecoration};
  transform: scale(${(props) => props.scale || 1});
  transform-origin: ${(props) => props.transformOrigin || 'left top'};
  white-space: ${(props) => props.whiteSpace || 'normal'};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const CardContainer = styled.div((props: any) => ({
  width: props.width,
  marginTop: props.mt,
  marginBottom: props.bottom,
  marginLeft: props.left,
  marginRight: props.right,
  paddingLeft: props.pl || props.px,
  paddingRight: props.pr || props.px,
  paddingTop: props.pt || props.py,
  paddingBottom: props.pb || props.py,
  alignSelf: props.alignSelf || 'stretch',
  backgroundColor: '#1D2329',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'rgba(82,82,82,0.3)',
  borderRadius: '6px',
}));

interface HContainerProps {
  clickable?: boolean;
  justifyContent?: string;
  alignItems?: string;
  mt?: any;
  mb?: any;
  ml?: any;
  mr?: any;
}

export const HContainer = styled.div<HContainerProps>`
  cursor: ${(props) => (props.clickable ? 'pointer' : '')};
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: ${(props) => props.alignItems || 'center'};
  margin-top: ${(props) => props.mt || 0};
  margin-bottom: ${(props) => props.mb || 0};
  margin-left: ${(props) => props.ml || 0};
  margin-right: ${(props) => props.mr || 0};
`;
