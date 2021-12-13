import { isdev } from 'src/config';

const lpConfig = {
  rSolLpContract: '2Jufhrr5w2zbavrUZgwkv91z6phoCFrjNDzvp3YCaveD',
  rBNBBSCLpContract1: '0xbdc8ee55d888784fb90b4d3d6632e19db72cd992',
  rDOTBSCLpContract1: '0xc1f6d716d5d3a6cc53ce9387b03cf2d777779502',
  rEthLpContract: '0xF9440930043eb3997fc70e1339dBb11F341de7A8',
  rETHLpContract2: () => {
    if (!isdev()) {
      return '0x5f49da032defe35489ddb205f3dc66d8a76318b3';
    }
    return '0x483d0adcc3fe2d5f8a73385a63e3612e83da1c3c';
  },
};

export default lpConfig;

export enum LPType {
  ADD_LIQUIDITY,
  EARN,
}

export enum LPPoolName {
  CURVE = 2,
  QUICKSWAP = 3,
  UNISWAP = 4,
  PANCAKE = 5,
  ATRIX = 6,
}
