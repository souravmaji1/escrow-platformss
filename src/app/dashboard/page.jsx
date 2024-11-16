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
  Shield, 
  Layout,
  House,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Clock,
  ArrowRight
} from "lucide-react";
import Abi from '../../abi.json'
import { defineChain } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const chain = defineChain(baseSepolia);

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const account = useActiveAccount();
  const contractAddress = "0x594512ac9e053d43c637c63db099b1f072098239";
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
        {/* Top Header */}
        <header className="h-16 bg-gray-900/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-green-400">Dashboard</h1>
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
        <main className="p-6">
          {account ? (
            <div className="space-y-6">
              {/* Quick Stats */}
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
                    <CardDescription>Completed</CardDescription>
                    <CardTitle className="text-2xl text-green-400">
                      {userProjects?.filter(p => p.status === 6).length || 0}
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

              {/* Projects List */}
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
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                              <p className="text-sm text-gray-400">Created</p>
                              <p className="text-lg font-semibold text-green-400">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Last Updated</p>
                              <p className="text-lg font-semibold text-green-400">
                                {new Date().toLocaleDateString()}
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