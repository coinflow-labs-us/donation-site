import React, { ReactNode } from "react";
import "./App.css";
import { WalletContextProvider } from "./wallet/Wallet";
import { BrowserRouter } from "react-router-dom";
import { CoinflowForm } from "./CoinflowForm";
import {
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { CoinflowPurchaseProtection } from "@coinflowlabs/react";
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  return (
    <ContextWrapper>
        <CoinflowPurchaseProtection coinflowEnv={'prod'}/>
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
  return (
    <div
      className={
        "flex flex-col items-center justify-center min-h-screen w-screen"
      }
    >
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletContextProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </WalletContextProvider>
          </WalletModalProvider>
        </WalletProvider>
    </div>
  );
}

export default App;
