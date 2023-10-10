import React, { ReactNode } from "react";
import "./App.css";
import { WalletContextProvider } from "./wallet/Wallet";
import { BrowserRouter } from "react-router-dom";
import { CoinflowForm } from "./CoinflowForm";
import LoginForm from "./LoginForm";

function App() {
  return (
    <ContextWrapper>
      <div className={"w-full flex flex-center min-h-screen bg-white overflow-auto"}>
        <CoinflowForm />
        <LoginForm />
      </div>
    </ContextWrapper>
  );
}

function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <div
      className={"flex flex-col items-center justify-center min-h-screen w-screen"}
    >
      <WalletContextProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </WalletContextProvider>
    </div>
  );
}

export default App;
