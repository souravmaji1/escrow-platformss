"use client";



import { useState } from "react";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../client";
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
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

export const chain = defineChain(baseSepolia);
const contractAddress = "0x594512ac9e053d43c637c63db099b1f072098239";

const CreateProject = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [status, setStatus] = useState('');
  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: Abi,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col fixed h-full`}>
        <div className="p-4 border-b border-gray-800">
          <Link className="flex items-center justify-center" href="/">
            <Shield className="w-8 h-8 text-green-500" />
            {!isSidebarCollapsed && (
              <span className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                SecureEscrow
              </span>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
        <div className="space-y-2">
            <Link href="/" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
              <House className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-3">Home</span>}
            </Link>
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
            </Link>
            <Link href="/projects" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-3">Projects</span>}
            </Link>
            <Link href="/createproject" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="ml-3">Create</span>}
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="space-y-2">
              <Link href="/settings" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
              </Link>
              <Link href="/help" className="flex items-center px-4 py-3 text-gray-300 hover:bg-green-500/10 hover:text-green-400 rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="ml-3">Help Center</span>}
              </Link>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-green-500/10 hover:text-green-400"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Layout className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="ml-3">Collapse</span>}
          </Button>
        </div>
      </aside>

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
                name: "SecureEscrow",
                url: "https://secureescrow.com",
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
                    <label className="text-sm text-gray-400 block mb-2">Buyer's Wallet Address</label>
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
                    <label className="text-sm text-gray-400 block mb-2">Seller's Wallet Address</label>
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
                    <p className="text-gray-400">Create a project by entering both parties' wallet addresses</p>
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