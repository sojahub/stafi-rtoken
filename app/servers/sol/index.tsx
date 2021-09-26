import config from '@config/index';
import { SolKeyring } from '@keyring/SolKeyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { timeout } from '@util/common';
import { message } from 'antd';
import Stafi from '../stafi';
declare const window: any;

const splToken = require('@solana/spl-token');

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

  async connectSolJs(cb?: Function) {
    const solana = this.getProvider();
    if (solana) {
      window.solana.on('connect', () => {
        const account = {
          name: '',
          pubkey: solana.publicKey.toString(),
          address: solana.publicKey.toString(),
          balance: '--',
        };
        cb && cb(account);
      });

      await solana.connect();
    } else {
      window.open('https://phantom.app/', '_blank');
    }
  }

  sendTransaction = async (amount: number, poolAddress: string) => {
    const solana = this.getProvider();
    if (solana && !solana.isConnected) {
      this.connectSolJs();
      await timeout(500);
      if (!solana.isConnected) {
        message.info('Please connect Phantom extension first');
        return;
      }
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

  getTokenAccountPubkey = async (walletAddress: string, tokenType: string) => {
    try {
      let slpTokenMintAddress;
      if (tokenType === 'fis') {
        slpTokenMintAddress = config.slpFisTokenAddress();
      } else if (tokenType === 'rsol') {
        slpTokenMintAddress = config.slpRSolTokenAddress();
      }

      if (!slpTokenMintAddress) {
        throw new Error('Unknown spl token');
      }

      const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });

      const acc = await connection.getTokenAccountsByOwner(new PublicKey(walletAddress), {
        mint: new PublicKey(slpTokenMintAddress),
      });

      console.log('sfasdfsf=======acc', acc);

      if (acc.value && acc.value.length > 0) {
        return acc.value[0].pubkey;
      }
    } catch (err) {
      return null;
    }

    return null;
  };

  createTokenAccount = async (walletAddress: string, tokenType: string) => {
    try {
      const solana = this.getProvider();
      if (solana && !solana.isConnected) {
        this.connectSolJs();
        await timeout(500);
        if (!solana.isConnected) {
          message.info('Please connect Phantom extension first');
          return;
        }
      }
      if (!solana) {
        return false;
      }

      if (solana.publicKey.toString() !== walletAddress) {
        message.info('Please switch Phantom wallet to the target address first');
        return false;
      }

      let slpTokenMintAddress;
      if (tokenType === 'fis') {
        slpTokenMintAddress = config.slpFisTokenAddress();
      } else if (tokenType === 'rsol') {
        slpTokenMintAddress = config.slpRSolTokenAddress();
      }

      if (!slpTokenMintAddress) {
        throw new Error('Unknown spl token');
      }

      const connection = new Connection(config.solRpcApi(), { wsEndpoint: config.solRpcWs() });

      // Random generate token amount, deprecated
      // const newTokenAccount = new Keypair();
      // const createTempTokenAccountIx = SystemProgram.createAccount({
      //   programId: splToken.TOKEN_PROGRAM_ID,
      //   space: AccountLayout.span,
      //   lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
      //   fromPubkey: new PublicKey(walletAddress),
      //   newAccountPubkey: newTokenAccount.publicKey,
      // });

      // const initIx = splToken.Token.createInitAccountInstruction(
      //   splToken.TOKEN_PROGRAM_ID,
      //   new PublicKey(slpTokenMintAddress),
      //   newTokenAccount.publicKey,
      //   solana.publicKey,
      // );

      let ata = await splToken.Token.getAssociatedTokenAddress(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(slpTokenMintAddress),
        solana.publicKey,
      );

      console.log(`ata: ${ata.toBase58()}`);

      const inx = splToken.Token.createAssociatedTokenAccountInstruction(
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(slpTokenMintAddress),
        ata,
        solana.publicKey,
        new PublicKey(walletAddress),
      );

      let transaction = new Transaction().add(inx);

      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = solana.publicKey;
      // transaction.partialSign(newTokenAccount);

      let signed = await solana.signTransaction(transaction);
      let txid = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: false });
      const result = await connection.confirmTransaction(txid);

      if (!result.value.err) {
        message.info('Create token account success');
        return true;
      }
    } catch (err) {
      message.error(err.message);
      return false;
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
