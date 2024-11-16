"use client";

import { useState } from "react";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, toWei, toEther } from "thirdweb";
import { client } from "./client";
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import Abi from '@/abi.json';
import Image from 'next/image';
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Shield, 
  DollarSign, 
  FileCheck,
  Clock,
  ArrowRight,
  Wallet,
  Users,
  Lock
} from "lucide-react";

export const chain = defineChain(baseSepolia);
const contractAddress = "0x594512ac9e053d43c637c63db099b1f072098239";

export default function Home() {
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [status, setStatus] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [assetLink, setAssetLink] = useState('');
  const [assetInstructions, setAssetInstructions] = useState('');

  const account = useActiveAccount();

  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: Abi,
  });

  const { data: userProjects, isLoading: projectsLoading } = useReadContract({
    contract,
    method: "getUserProjects",
    params: account ? [account.address] : undefined,
  });

  const { data: invitations, isLoading: invitationsLoading } = useReadContract({
    contract,
    method: "getProjectsForApproval",
    params: account ? [account.address] : undefined,
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 0: return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 1: return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Awaiting Funds</Badge>;
      case 2: return <Badge variant="primary" className="bg-green-500/10 text-green-500">Funded</Badge>;
      case 3: return <Badge variant="warning" className="bg-purple-500/10 text-purple-500">Asset Submitted</Badge>;
      case 6: return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500">Completed</Badge>;
      default: return <Badge variant="destructive" className="bg-red-500/10 text-red-500">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="w-8 h-8 mr-2 text-green-500" />
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            SecureEscrow
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-green-400 transition-colors" href="#">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:text-green-400 transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-green-400 transition-colors" href="#">
            Pricing
          </Link>
        </nav>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <Lock className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-green-400">Secure Transactions</CardTitle>
              <CardDescription>Smart contract powered escrow service</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-green-400">Protected Payments</CardTitle>
              <CardDescription>Funds are held securely until delivery</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <FileCheck className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle className="text-green-400">Verified Delivery</CardTitle>
              <CardDescription>Confirm receipt before release</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              Connect Wallet
            </CardTitle>
            <CardDescription>
              Connect your wallet to manage escrow transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectButton
              client={client}
              chain={chain}
              className="w-full"
              appMetadata={{
                name: "SecureEscrow",
                url: "https://secureescrow.com",
              }}
            />
          </CardContent>
        </Card>

        {account && (
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList className="bg-gray-800/50 border-gray-700">
              <TabsTrigger value="projects" className="data-[state=active]:bg-green-500/20">
                Your Projects
              </TabsTrigger>
              <TabsTrigger value="invitations" className="data-[state=active]:bg-green-500/20">
                Invitations
              </TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-green-500/20">
                Create Project
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Your Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userProjects?.length > 0 ? (
                    <div className="space-y-4">
                      {userProjects.map((project, index) => (
                        <Card key={index} className="bg-gray-900/50 border-gray-700">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg text-green-400">
                                Project #{project.projectId.toString()}
                              </CardTitle>
                              {getStatusBadge(project.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-lg font-semibold text-green-400">
                                  {toEther(project.amount)} ETH
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Role</p>
                                <p className="text-lg font-semibold text-green-400">
                                  {project.buyer.toLowerCase() === account?.address.toLowerCase() 
                                    ? 'Buyer' 
                                    : 'Seller'}
                                </p>
                              </div>
                            </div>

                            <Separator className="bg-gray-700" />

                            {project.status === 1 && project.buyer.toLowerCase() === account?.address.toLowerCase() && (
                              <div className="space-y-2">
                                <Input
                                  type="number"
                                  placeholder="Amount to fund (ETH)"
                                  value={fundAmount}
                                  onChange={(e) => setFundAmount(e.target.value)}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <TransactionButton
                                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                                  transaction={() => {
                                    return prepareContractCall({
                                      contract,
                                      method: "addFunds",
                                      params: [project.projectId],
                                      value: toWei(fundAmount)
                                    });
                                  }}
                                >
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Add Funds
                                </TransactionButton>
                              </div>
                            )}

                            {project.status === 2 && project.seller.toLowerCase() === account?.address.toLowerCase() && (
                              <div className="space-y-2">
                                <Input
                                  type="text"
                                  placeholder="Asset Link"
                                  value={assetLink}
                                  onChange={(e) => setAssetLink(e.target.value)}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <Textarea
                                  placeholder="Asset Instructions"
                                  value={assetInstructions}
                                  onChange={(e) => setAssetInstructions(e.target.value)}
                                  className="bg-gray-800 border-gray-700"
                                />
                                <TransactionButton
                                  className="w-full bg-green-500 hover:bg-green-600 text-black"
                                  transaction={() => {
                                    return prepareContractCall({
                                      contract,
                                      method: "submitAsset",
                                      params: [project.projectId, assetLink, assetInstructions]
                                    });
                                  }}
                                >
                                  <FileCheck className="w-4 h-4 mr-2" />
                                  Submit Asset
                                </TransactionButton>
                              </div>
                            )}

                            {project.status === 3 && project.buyer.toLowerCase() === account?.address.toLowerCase() && (
                              <div className="space-y-4">
                                <div className="bg-gray-900 p-4 rounded-lg">
                                  <h3 className="text-green-400 font-semibold mb-2">Asset Details</h3>
                                  <p className="text-sm mb-2">
                                    <span className="text-gray-400">Link:</span>{' '}
                                    <Link href={project.assetLink} className="text-green-400 hover:underline" target="_blank">
                                      {project.assetLink}
                                    </Link>
                                  </p>
                                  <p className="text-sm">
                                    <span className="text-gray-400">Instructions:</span>{' '}
                                    <span className="text-white">{project.instructions}</span>
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <TransactionButton
                                    className="bg-green-500 hover:bg-green-600 text-black"
                                    transaction={() => {
                                      return prepareContractCall({
                                        contract,
                                        method: "acceptAsset",
                                        params: [project.projectId]
                                      });
                                    }}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Accept Asset
                                  </TransactionButton>
                                  <TransactionButton
                                    className="bg-red-500 hover:bg-red-600 text-black"
                                    transaction={() => {
                                      return prepareContractCall({
                                        contract,
                                        method: "rejectAsset",
                                        params: [project.projectId]
                                      });
                                    }}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Asset
                                  </TransactionButton>
                                </div>
                              </div>
                            )}

                            {project.status === 6 && (
                              <Alert className="bg-green-500/10 border-green-500/20">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-400">
                                  Transaction Successfully Completed
                                </AlertDescription>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No projects found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invitations">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Project Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                  {invitations?.length > 0 ? (
                    <div className="space-y-4">
                      {invitations.map((projectId) => (
                        <Card key={projectId} className="bg-gray-900/50 border-gray-700">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg text-green-400">
                                Project #{projectId.toString()}
                              </CardTitle>
                              <TransactionButton
                                className="bg-green-500 hover:bg-green-600 text-black"
                                transaction={() => {
                                  return prepareContractCall({
                                    contract,
                                    method: "acceptProject",
                                    params: [projectId]
                                  });
                                }}
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Accept Invitation
                              </TransactionButton>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No pending invitations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Create New Project</CardTitle>
                  <CardDescription>Set up a new escrow transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Buyer Address</label>
                      <Input
                        placeholder="0x..."
                        value={buyerAddress}
                        onChange={(e) => setBuyerAddress(e.target.value)}
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Seller Address</label>
                      <Input
                        placeholder="0x..."
                        value={sellerAddress}
                        onChange={(e) => setSellerAddress(e.target.value)}
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <TransactionButton
                    className="w-full bg-green-500 hover:bg-green-600 text-black"
                    transaction={() => {
                      return prepareContractCall({
                        contract,
                        method: "createProject",
                        params: [buyerAddress, sellerAddress]
                      });
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Create Secure Project
                  </TransactionButton>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {status && (
          <Alert className="bg-gray-800/50 border-gray-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}