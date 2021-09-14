import config from '@config/index';
import { SolKeyring } from '@keyring/SolKeyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { message } from 'antd';
import Stafi from '../stafi';
declare const window: any;

let polkadotApi: any = null;

export default class ExtensionDapp extends SolKeyring {
  constructor() {
    super();
    this._symbol = 'sol';
  }

  getProvider() {
    if ('solana' in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  }

  async connectSolJs(cb: Function) {
    const solana = this.getProvider();
    if (solana) {
      window.solana.on('connect', () => {
        const account = {
          name: '',
          pubkey: solana.publicKey.toString(),
          address: solana.publicKey.toString(),
          balance: '--',
        };
        cb(account);
      });

      await solana.connect();
    } else {
      window.open('https://phantom.app/', '_blank');
    }
  }

  sendTransaction = async (amount: number, poolAddress: string) => {
    await this.connectSolJs(() => {});
    const solana = this.getProvider();
    if (solana && !solana.isConnected) {
      message.info('Please connect Phantom extension first');
      return;
    }
    if (!solana) {
      return;
    }

    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: solana.publicKey,
        // toPubkey: wallet.publicKey,
        toPubkey: new PublicKey(poolAddress),
        lamports: amount,
      }),
    );

    const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = solana.publicKey;

    try {
      let signed = await solana.signTransaction(transaction);
      let txid = await connection.sendRawTransaction(signed.serialize());
      const result = await connection.confirmTransaction(txid);
      const block = await connection.getBlock(result.context.slot);
      return {
        blockHash: block.blockhash,
        txHash: txid,
      };
    } catch (e) {
      console.warn(e);
      throw e;
    }
  };

  getTransactionDetail = async (address: string, txHash: any) => {
    try {
      const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });
      const parsedTx = await connection.getParsedConfirmedTransaction(txHash).catch((error) => {
        throw new Error();
      });

      if (!parsedTx || !parsedTx.slot) {
        return {};
      }
      const block = await connection.getBlock(parsedTx.slot);

      const lamports = this.getTxLamports(parsedTx.transaction.message.instructions[0]);
      const destination = this.getTxDestination(parsedTx.transaction.message.instructions[0]);
      return {
        amount: lamports,
        poolAddress: destination,
        blockhash: block.blockhash,
      };
    } catch (error) {
      throw new Error();
    }
  };

  getTxLamports = (instruction: any) => {
    return instruction.parsed.info.lamports;
  };

  getTxDestination = (instruction: any) => {
    return instruction.parsed.info.destination;
  };

  connectPolkadotjs() {
    const stafi = new Stafi();
    return web3Enable(stafi.getWeb3EnalbeName()).then(() => web3Accounts());
  }
  createPolkadotApi() {
    if (polkadotApi) {
      return polkadotApi;
    }

    const wsProvider = new WsProvider(config.kusamaChain());
    polkadotApi = ApiPromise.create({
      provider: wsProvider,
    });
    return polkadotApi;
  }
  getRSOLTokenAddress() {
    return config.rSOLTokenAddress();
  }

  getTokenAbi() {
    return config.commonAbi();
  }
}
