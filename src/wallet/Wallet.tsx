import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useLocalStorage } from "./useLocalStorage";
import { useWallet } from "@solana/wallet-adapter-react";
import {SOLANA_CONNECTION} from "../index";

export interface WalletContextProps {
  connected: boolean;
  publicKey: PublicKey | null;
  connection: Connection | null;
  sendTransaction: (transaction: Transaction) => Promise<string>;
}

const WalletContext = createContext<WalletContextProps>({
  connected: false,
  publicKey: null,
  connection: null,
  sendTransaction: () => Promise.reject(new Error("")),
});

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const [keypairLocalStorage, setKeypairLocalStorage] = useLocalStorage<
    string | null
  >("keypair", null);

  useEffect(() => {
    if (wallet.publicKey) {
      setPublicKey(wallet.publicKey);
    }
  }, [wallet]);

  useEffect(() => {
    if (keypairLocalStorage) return;

    const newKeypair = Keypair.generate();
    setKeypairLocalStorage(JSON.stringify(Array.from(newKeypair.secretKey)));
  }, [keypairLocalStorage, setKeypairLocalStorage]);

  const keypair = useMemo(() => {
    if (!keypairLocalStorage) return null;
    return Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(keypairLocalStorage))
    );
  }, [keypairLocalStorage]);

  useEffect(() => {
    if (!keypair || wallet.publicKey) return;
    if (publicKey?.equals(keypair.publicKey)) return;
    setPublicKey(keypair.publicKey);
  }, [keypair, publicKey, wallet]);

  const connected = useMemo(() => !!publicKey, [publicKey]);

  const connection = useMemo(() => {
    return new Connection(
      "https://rpc.helius.xyz/?api-key=2f915565-3608-4451-9150-4e72f50f10c2",
      "confirmed"
    );
  }, []);

  const sendTransaction = useCallback(
    async (transaction: Transaction) => {
      return await retry(async () => {
        if (wallet.publicKey && wallet.signTransaction) {
          await wallet.signTransaction(transaction);
          return await wallet.sendTransaction(transaction, SOLANA_CONNECTION)
        }

        if (!keypair) throw new Error("Keypair not found");
        transaction.partialSign(keypair);
        return await connection.sendRawTransaction(transaction.serialize());
      }, 3);
    },
    [connection, keypair, wallet]
  );

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        sendTransaction,
        connection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useLocalWallet = () => useContext(WalletContext);

function retry<T>(func: () => Promise<T>, retries: number) {
  for (let i = 0; i < retries; i++) {
    try {
      return func();
    } catch (e) {
      console.error(e);
      if (i === retries - 1) {
        throw e;
      }
    }
  }

  throw new Error('Max Retries Reached');
}
