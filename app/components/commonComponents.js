import styled from 'styled-components';

export const Text = styled.div((props) => ({
  fontSize: props.size,
  fontFamily: props.bold ? 'Helvetica-Bold' : 'Helvetica',
  lineHeight: props.sameLineHeight ? props.size : '',
  color: props.color ? props.color : '#ffffff',
  marginTop: props.mt,
  marginBottom: props.mb,
  marginLeft: props.ml,
  marginRight: props.mr,
  textDecoration: props.textDecoration,
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',
}));

export const CardContainer = styled.div((props) => ({
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

export const AccountContainer = styled.div((props) => ({
  paddingLeft: props.paddingHorizontal,
  paddingRight: props.paddingHorizontal,
  backgroundImage: 'linear-gradient(to right, #3dddc4, #37bfa5, #00eba2)',
  color: '#ffffff',
  paddingTop: '6px',
  paddingBottom: '4px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '4px',
}));

export const HContainer = styled.div((props) => ({
  cursor: props.clickable ? 'pointer' : '',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: props.justifyContent || 'space-between',
  alignItems: props.alignItems || 'center',
  marginTop: props.mt || 0,
  marginBottom: props.mb || 0,
  marginLeft: props.ml || 0,
  marginRight: props.mr || 0,
}));
