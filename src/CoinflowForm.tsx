import React, {useCallback, useEffect, useMemo, useState} from "react";
import {CoinflowPurchase} from "@coinflowlabs/react";
import {useWallet} from "./wallet/Wallet";
import SuccessModal from "./SuccessModal";
import {createTransferCheckedInstruction, getAssociatedTokenAddressSync} from "@solana/spl-token";
import {Keypair, PublicKey, Transaction} from "@solana/web3.js";

export function CoinflowForm() {
  const wallet = useWallet();

  const [amount, setAmount] = useState<number>(10);
  const [isReady, setIsReady] = useState<boolean>(false);

  if (!wallet.connection || !wallet.publicKey) return null;

  return (
    <div
      className={
        "flex-1 mx-auto flex-col h-full flex max-w-[600px] w-full pt-14 lg:pt-24 items-center "
      }
    >
      <h3
        className={`text-lg lg:text-xl font-bold text-gray-900 mb-2 ${
          isReady ? "pt-0" : "pt-32"
        } transition-all duration-500`}
      >
        🇮🇱 Support Israel 🇮🇱
      </h3>
      <span
        className={
          "text-gray-500 text-xs lg:text-sm px-8 lg:px-4 mb-6 text-center"
        }
      >
        * All donations go directly to the 300k soldiers deployed to defend
        their home and the families suffering from ongoing war
      </span>
      <AmountSelector amount={amount} setAmount={setAmount} />

      {isReady ? null : (
        <>
          <div
            onClick={() => setIsReady(true)}
            className={
              "w-full max-w-[200px] cursor-pointer hover:bg-blue-500 transition bg-blue-600 rounded-3xl p-4 px-5 mt-6 flex justify-center"
            }
          >
            <span className={"text-xs lg:text-sm font-semibold text-white"}>
              Continue
            </span>
          </div>
        </>
      )}
      {isReady ? (
        <PurchaseForm amount={amount} setIsReady={() => setIsReady(false)} />
      ) : null}
    </div>
  );
}

function PurchaseForm({
  amount,
  setIsReady,
}: {
  amount: number;
  setIsReady: (isReady: boolean) => void;
}) {
  const wallet = useWallet();

  const [successOpen, setSuccessOpen] = useState<boolean>(false);

  const [height, setHeight] = useState<number>(1300);
  const [handleHeightChange, setHandleHeightChange] = useState<
    ((newHeight: string) => void) | undefined
  >(undefined);

  const handleHeight = useCallback((newHeight: string) => {
    setHeight(Number(newHeight));
  }, []);

  useEffect(() => {
    if (wallet.publicKey) {
      setHandleHeightChange(() => handleHeight);
    }
  }, [handleHeight, wallet]);

  const transferTx = useMemo(() => {
    if (!wallet.publicKey) return undefined;
    const usdc = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    const source = getAssociatedTokenAddressSync(
        usdc,
        wallet.publicKey
    );
    const destination = new PublicKey('6TkZqxLRNJWnpJRDeo54AJ7RwhzzEJyUgs6ihA7Bu3rG');
    const ix = createTransferCheckedInstruction(source, usdc, destination, wallet.publicKey, amount * 1e6, 6);
    const tx = new Transaction().add(ix);
    tx.recentBlockhash = Keypair.generate().publicKey.toString();
    tx.feePayer = wallet.publicKey;
    return tx;
  }, [amount, wallet.publicKey]);

  if (!wallet.connection || amount === 0) return null;

  return (
    <>
      <div className={`h-[1300px] w-full`}>
        <CoinflowPurchase
          wallet={wallet}
          merchantId={"donation-site"}
          env={"prod"}
          connection={wallet.connection}
          onSuccess={() => {
            setSuccessOpen(true);
            setIsReady(false);
          }}
          transaction={transferTx}
          blockchain={"solana"}
          amount={amount}
          loaderBackground={"#FFFFFF"}
          handleHeightChange={handleHeightChange}
        />
      </div>
      <SuccessModal isOpen={successOpen} setIsOpen={setSuccessOpen} />
    </>
  );
}

function AmountSelector({
  amount,
  setAmount,
}: {
  amount: number;
  setAmount: (a: number) => void;
}) {
  const Amounts = [10, 20, 50, 100];

  const markerPosition =
    amount === Amounts[0]
      ? "left-0"
      : amount === Amounts[1]
      ? "left-1/4"
      : amount === Amounts[2]
      ? "left-1/2"
      : amount === Amounts[3]
      ? "left-3/4"
      : "opacity-0";

  return (
    <div className={"flex w-full relative space-x-4 h-14 lg:h-16 px-4"}>
      <div className={"p-1 rounded-full bg-zinc-100 flex-1"}>
        <div className={"relative flex rounded-full flex-1 bg-zinc-100 h-full"}>
          {Amounts.map((a) => (
            <div key={a} onClick={() => setAmount(a)} className={"w-1/4 z-50"}>
              <SelectorButton text={`$${a}`} active={a === amount} />
            </div>
          ))}
          <div
            className={`w-1/4 transition-all duration-500 rounded-full absolute top-0 bottom-0 bg-blue-600 z-20 ${markerPosition}`}
          />
        </div>
      </div>
      <AmountInput amount={amount} setAmount={setAmount} />
    </div>
  );
}

function AmountInput({
  amount,
  setAmount,
}: {
  amount: number;
  setAmount: (a: number) => void;
}) {
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  return (
    <div className={"w-28 relative"} onClick={() => setInputFocused(true)}>
      <div
        className={
          "absolute left-2 top-0 bottom-0 flex items-center justify-center"
        }
      >
        <i className="bx bxs-badge-dollar text-gray-500 z-50" />
      </div>

      <input
        value={!inputFocused ? "Custom" : amount.toString()}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder={"Custom"}
        className={
          "w-full h-full bg-zinc-100 font-semibold focus:ring-blue-600 text-xs lg:text-sm rounded-full flex items-center justify-center pl-7"
        }
      />
    </div>
  );
}

function SelectorButton({
  text,
  active,
}: {
  text: string | number;
  active: boolean;
}) {
  return (
    <div
      className={`w-full flex justify-center items-center h-full cursor-pointer ${
        active ? "" : "hover:bg-zinc-200"
      } transition rounded-full`}
    >
      <span
        className={`text-xs lg:text-sm font-semibold ${
          active ? "text-white" : "text-gray-900"
        } transition`}
      >
        {text}
      </span>
    </div>
  );
}
