'use client'
import React, { useState } from "react";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../client";
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { 
  Shield,
  Users,
  AlertCircle,
  Layout,
  Plus,
  House,
  FileText,
  Settings,
  HelpCircle,
  Crown,
  Percent,
  Wallet,
  Ban,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Abi from '../../abi.json';
import SidebarNav from '../../components/ui/sidebar';

export const chain = defineChain(17000);
const contractAddress = "0xfe91278f4aec15d00ddecb4524f7acfe23214de9 ";

const AdminDashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [newFeePercentage, setNewFeePercentage] = useState('');
    const [status, setStatus] = useState('');
    const account = useActiveAccount();
  
    const contract = getContract({
      client,
      chain,
      address: contractAddress,
      abi: Abi,
    });
  
    // Read disputed projects from contract
    const { data: disputedProjects } = useReadContract({
      contract,
      method: "getDisputedProjects",
      params: [],
    });
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
        <SidebarNav 
          isSidebarCollapsed={isSidebarCollapsed} 
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
  
        <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <header className="h-16 bg-gray-900/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-green-400">Admin Dashboard</h1>
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
  
          <main className="container mx-auto p-6 max-w-4xl">
            <div className="space-y-8">
              {/* Fee Management Card */}
              <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-green-400">Admin Controls</h2>
              <p className="text-gray-400">Manage platform settings and resolve disputes</p>
            </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Percent className="w-6 h-6" />
                    Fee Management
                  </CardTitle>
                  <CardDescription>
                    Update the platform fee percentage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Enter fee in basis points (100 = 1%)"
                      value={newFeePercentage}
                      onChange={(e) => setNewFeePercentage(e.target.value)}
                      className="bg-gray-900 border-gray-700"
                    />
                  </div>
                  <TransactionButton
                    className="w-full bg-green-500 hover:bg-green-600 text-black h-12 font-medium rounded-lg"
                    transaction={() => {
                      return prepareContractCall({
                        contract,
                        method: "updateFeePercentage",
                        params: [newFeePercentage]
                      });
                    }}
                  >
                    Update Fee
                  </TransactionButton>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  Fee Withdrawal
                </CardTitle>
                <CardDescription>
                  Withdraw accumulated platform fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionButton
                  className="w-full bg-green-500 hover:bg-green-600 text-black h-12 font-medium rounded-lg"
                  disabled={!account}
                  transaction={() => {
                    return prepareContractCall({
                      contract,
                      method: "withdrawFees",
                      params: []
                    });
                  }}
                >
                  Withdraw Fees
                </TransactionButton>
              </CardContent>
            </Card>
  
              {/* Disputed Projects Card */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Ban className="w-6 h-6" />
                    Disputed Projects
                  </CardTitle>
                  <CardDescription>
                    Review and resolve escalated disputes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {disputedProjects && disputedProjects.length > 0 ? (
                      disputedProjects.map((project) => (
                        <Card key={project.projectId} className="bg-gray-900/50 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-400">
                              Project #{project.projectId.toString()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-lg font-semibold text-green-400">
                                  {project.amount.toString()} ETH
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Rejection Count</p>
                                <p className="text-lg font-semibold text-green-400">
                                  {project.rejectionCount}/3
                                </p>
                              </div>
                            </div>
  
                            <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                              <p className="text-sm">
                                <span className="text-gray-400">Asset Link:</span>{' '}
                                <a href={project.assetLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                                  {project.assetLink}
                                </a>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-400">Instructions:</span>{' '}
                                <span className="text-white">{project.instructions}</span>
                              </p>
                            </div>
  
                            <div className="grid grid-cols-2 gap-4">
                              <TransactionButton
                                className="bg-green-500 hover:bg-green-600 text-black h-12 font-medium rounded-lg"
                                transaction={() => {
                                  return prepareContractCall({
                                    contract,
                                    method: "resolveDispute",
                                    params: [project.projectId, true]
                                  });
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Accept Asset
                              </TransactionButton>
                              <TransactionButton
                                className="bg-red-500 hover:bg-red-600 text-black h-12 font-medium rounded-lg"
                                transaction={() => {
                                  return prepareContractCall({
                                    contract,
                                    method: "resolveDispute",
                                    params: [project.projectId, false]
                                  });
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Asset
                              </TransactionButton>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No disputed projects found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;