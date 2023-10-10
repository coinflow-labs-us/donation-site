import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "boxicons";
import { Connection } from "@solana/web3.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

export const RPC_URL =
  "https://rpc.helius.xyz/?api-key=2f915565-3608-4451-9150-4e72f50f10c2";

export const SOLANA_CONNECTION = new Connection(RPC_URL);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
