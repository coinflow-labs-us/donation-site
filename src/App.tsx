import React, { ReactNode, useMemo } from "react";
import "./App.css";
import { WalletContextProvider } from "./wallet/Wallet";
import { BrowserRouter } from "react-router-dom";
import { CoinflowForm } from "./CoinflowForm";
import { RPC_URL } from "./index";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  return (
    <ContextWrapper>
      <div
        className={
          "w-full flex flex-center min-h-screen bg-white overflow-auto"
        }
      >
        <CoinflowForm />
      </div>
    </ContextWrapper>
  );
}

function ContextWrapper({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => RPC_URL, []);

  return (
    <div
      className={
        "flex flex-col items-center justify-center min-h-screen w-screen"
      }
    >
      {/*<ConnectionProvider endpoint={endpoint}>*/}
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletContextProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </WalletContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      {/*</ConnectionProvider>*/}
    </div>
  );
}

export default App;
