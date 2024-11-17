"use client";

import { useState } from "react";
import { ConnectButton, TransactionButton } from "thirdweb/react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "../client";
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
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  Clock
} from "lucide-react";
import Abi from '../../abi.json';
import { defineChain } from "thirdweb";
import SidebarNav from '../../components/ui/sidebar';

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const account = useActiveAccount();
  
  const contractAddress = '0x20325f6dfd594bf85a7cdd6bfb7485b0906144f9';
  const chain = defineChain(17000);

  const contract = getContract({
    client: client,
    chain: chain,
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

  const getCompletedProjectsCount = (projects) => {
    if (!projects) return 0;
    return projects.filter(project => 
      (project.status === 6 || project.status === 8) && 
      (project.buyerAccepted || project.sellerAccepted)
    ).length;
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 0: return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 1: return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Awaiting Funds</Badge>;
      case 2: return <Badge variant="primary" className="bg-green-500/10 text-green-500">Funded</Badge>;
      case 3: return <Badge variant="warning" className="bg-purple-500/10 text-purple-500">Asset Submitted</Badge>;
      case 5: return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Rejected Asset</Badge>;
      case 6: return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500">Completed</Badge>;
      case 8: return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500">Completed</Badge>;
      case 9: return <Badge variant="success" className="bg-emerald-500/10 text-emerald-500">Dispute Created</Badge>;
      default: return <Badge variant="destructive" className="bg-red-500/10 text-red-500">Unknown</Badge>;
    }
  };

  const isProjectCompleted = (project) => {
    return (project.status === 6 || project.status === 8) && 
           (project.buyerAccepted || project.sellerAccepted);
  };

  const getAcceptanceBadge = (project) => {
    if (project.buyerAccepted) {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500">Buyer Accepted</Badge>;
    }
    if (project.sellerAccepted) {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500">Seller Accepted</Badge>;
    }
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
      <SidebarNav 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <header className="h-16 bg-gray-900/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-green-400">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ConnectButton
              client={client}
              chain={chain}
              appMetadata={{
                name: "Forechain",
                url: "https://Forechain.com",
              }}
            />
          </div>
        </header>

        <main className="p-6">
          {account ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardDescription>Active Projects</CardDescription>
                    <CardTitle className="text-2xl text-green-400">
                      {userProjects?.length || 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardDescription>Pending Invites</CardDescription>
                    <CardTitle className="text-2xl text-green-400">
                      {invitations?.length || 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardDescription>Completed Projects</CardDescription>
                    <CardTitle className="text-2xl text-green-400">
                      {getCompletedProjectsCount(userProjects)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardDescription>Total Value Locked</CardDescription>
                    <CardTitle className="text-2xl text-green-400">
                      {userProjects?.reduce((acc, curr) => acc + Number(toEther(curr.amount)), 0).toFixed(2)} ETH
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-green-400">Active Projects</h2>
                  <Link href="/create-project">
                    <Button className="bg-green-500 hover:bg-green-600 text-black">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </Link>
                </div>

                {userProjects?.length > 0 ? (
                  <div className="grid gap-4">
                    {userProjects.map((project, index) => (
                      <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-green-400">
                              Project #{project.projectId.toString()}
                            </CardTitle>
                            <div className="flex gap-2 items-center">
                              {getStatusBadge(project.status)}
                              {isProjectCompleted(project) && getAcceptanceBadge(project)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <div>
                              <p className="text-sm text-gray-400">Status</p>
                              <p className="text-lg font-semibold text-green-400">
                                {project.buyerAccepted ? 'Buyer Accepted' : 
                                 project.sellerAccepted ? 'Seller Accepted' : 
                                 'Pending Acceptance'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="w-12 h-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">No active projects</p>
                      <Link href="/create-project" className="mt-4">
                        <Button className="bg-green-500 hover:bg-green-600 text-black">
                          Create Your First Project
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                Secure Digital Transactions
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Smart contract powered escrow service for safe and transparent digital transactions
              </p>
              <Button className="bg-green-500 hover:bg-green-600 text-black px-8 py-6 text-lg">
                Connect Wallet to Start
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}