"use client";



import { useState } from "react";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../client";
import { defineChain } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { 
  Shield, 
  ArrowLeft, 
  Users, 
  AlertCircle,
  Layout,
  Plus,
  House,
  FileText,
  Settings,
  Crown,
  HelpCircle
} from "lucide-react";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Abi from '../../abi.json'
import SidebarNav from '../../components/ui/sidebar';



const CreateProject = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [status, setStatus] = useState('');
  const account = useActiveAccount();

  const contractAddress = '0x20325f6dfd594bf85a7cdd6bfb7485b0906144f9'
  const chain = defineChain(17000);

  const contract = getContract({
    client: client,
    chain: chain,
    address: contractAddress,
    abi: Abi,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
      {/* Sidebar */}
      <SidebarNav 
  isSidebarCollapsed={isSidebarCollapsed} 
  setIsSidebarCollapsed={setIsSidebarCollapsed}
/>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-gray-900/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-green-400">Create Project</h1>
          <div className="flex items-center space-x-4">
            
            <ConnectButton
              client={client}
              chain={chain}
              appMetadata={{
                name: "ForeChain",
                url: "https://ForeChain.com",
              }}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto p-6 max-w-2xl">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-green-400">Create New Project</h2>
              <p className="text-gray-400">Set up a secure escrow transaction between buyer and seller</p>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Enter the wallet addresses for both parties involved in the transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Buyers Wallet Address</label>
                    <Input
                      placeholder="0x..."
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="bg-gray-900 border-gray-700 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">The address of the party sending the payment</p>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Sellers Wallet Address</label>
                    <Input
                      placeholder="0x..."
                      value={sellerAddress}
                      onChange={(e) => setSellerAddress(e.target.value)}
                      className="bg-gray-900 border-gray-700 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">The address of the party receiving the payment</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <TransactionButton
                  className="w-full bg-green-500 hover:bg-green-600 text-black h-12 font-medium rounded-lg"
                  disabled={!account || !buyerAddress || !sellerAddress}
                  transaction={() => {
                    return prepareContractCall({
                      contract,
                      method: "createProject",
                      params: [buyerAddress, sellerAddress]
                    });
                  }}
                  onError={(err) => {
                  
                    console.log(err.message)
                    // Add your own logic here
                  }}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Create Secure Project
                </TransactionButton>
                
                {!account && (
                  <Alert className="bg-yellow-500/10 border-yellow-500/20">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-400">
                      Please connect your wallet to create a project
                    </AlertDescription>
                  </Alert>
                )}
              </CardFooter>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-sm">1</span>
                    </div>
                    <p className="text-gray-400">Create a project by entering both parties wallet addresses</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-sm">2</span>
                    </div>
                    <p className="text-gray-400">Both parties will receive an invitation to participate</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 text-sm">3</span>
                    </div>
                    <p className="text-gray-400">Once accepted, the buyer can fund the escrow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {status && (
            <Alert className="mt-4 bg-gray-800/50 border-gray-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreateProject;