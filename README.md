"use client";


import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { getContract, prepareContractCall, toWei, sendTransaction } from "thirdweb";
import { useActiveAccount , useSendTransaction} from "thirdweb/react";
import Abi from '@/abi.json'
import { useState } from "react";
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { TransactionButton } from "thirdweb/react";

export const chain = defineChain( baseSepolia );

export default function Home() {
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  

  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x7c87e118560c48c87228d26ffb2030d03f95c564",
    abi: Abi,
  });


  return (
    <main className="p-4 pb-10 min-h-[100vh] bg-black flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            chain={chain}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
          />
        </div>

        <div className="space-y-4">
                <Input
                  placeholder="Buyer Address"
                  value={buyerAddress}
                  className="bg-white text-black"
                  onChange={(e) => setBuyerAddress(e.target.value)}
                />
                <Input
                  placeholder="Seller Address"
                  className="bg-white text-black"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                />
               <TransactionButton
      transaction={() => {
        // Create a transaction object and return it
        const tx = prepareContractCall({
          contract,
          method: "createProject",
    params: [buyerAddress, sellerAddress]
        });
        return tx;
      }}
      onTransactionSent={(result) => {
        console.log("Transaction submitted", result.transactionHash);
      }}
      onTransactionConfirmed={(receipt) => {
        console.log("Transaction confirmed", receipt.transactionHash);
      }}
      onError={(error) => {
        console.error("Transaction error", error);
      }}
    >
      Confirm Transaction
    </TransactionButton>
              </div>



       
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

