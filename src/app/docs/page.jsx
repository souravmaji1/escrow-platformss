'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Code,
  Terminal,
  Book,
  Download,
  CheckCircle,
  Copy
} from 'lucide-react';
import SidebarNav from '../../components/ui/sidebar';

const IntegrationPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeBlock = ({ children }) => (
    <pre className="bg-gray-900/50 p-4 rounded-lg">
      <code className="text-green-400 font-mono text-sm">{children}</code>
    </pre>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex">
      <SidebarNav 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-gray-900/95 border-b border-gray-800 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-green-400">Integration Guide</h1>
        
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="space-y-6">
            {/* Quick Start Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-6 h-6 text-green-400" />
                  <CardTitle className="text-xl text-green-400">Quick Start</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Step 1: Installation</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-400 hover:text-green-300"
                      onClick={() => handleCopy('npm install forechain-sdk', 'install')}
                    >
                      {copiedSection === 'install' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <CodeBlock>npm install forechain-sdk</CodeBlock>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Step 2: Initialize SDK</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-400 hover:text-green-300"
                      onClick={() => handleCopy(`import ForechainSDK from 'forechain-sdk';

const sdk = new ForechainSDK();
await sdk.connectWallet();`, 'init')}
                    >
                      {copiedSection === 'init' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <code className="text-green-400 font-mono text-sm whitespace-pre">
                      {`import ForechainSDK from 'forechain-sdk';

const sdk = new ForechainSDK();
await sdk.connectWallet();`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Code className="w-6 h-6 text-green-400" />
                    <CardTitle className="text-lg text-green-400">Project Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Create Project</Badge>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <code className="text-green-400 font-mono text-sm whitespace-pre">
                        {`const txHash = await sdk.createProject(
  buyerAddress,
  sellerAddress
);`}
                      </code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Add Funds</Badge>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <code className="text-green-400 font-mono text-sm whitespace-pre">
                        {`await sdk.addFunds(
  projectId,
  amountInEth
);`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Book className="w-6 h-6 text-green-400" />
                    <CardTitle className="text-lg text-green-400">Asset Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Submit Asset</Badge>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <code className="text-green-400 font-mono text-sm whitespace-pre">
                        {`await sdk.submitAsset(
  projectId,
  assetLink,
  instructions
);`}
                      </code>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-400">Accept/Reject Asset</Badge>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <code className="text-green-400 font-mono text-sm whitespace-pre">
                        {`// Accept asset
await sdk.acceptAsset(projectId);

// Reject asset
await sdk.rejectAsset(projectId);`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Example Implementation */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Download className="w-6 h-6 text-green-400" />
                  <CardTitle className="text-xl text-green-400">Complete Example</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <code className="text-green-400 font-mono text-sm whitespace-pre">
                    {`import ForechainSDK from 'forechain-sdk';

async function main() {
  // Initialize SDK
  const sdk = new ForechainSDK();
  
  // Connect wallet
  const account = await sdk.connectWallet();
  
  // Create new project
  const projectId = await sdk.createProject(
    '0xBuyerAddress',
    '0xSellerAddress'
  );
  
  // Add funds to project
  await sdk.addFunds(projectId, 1.5); // 1.5 ETH
  
  // Get project status
  const status = await sdk.getProjectStatus(projectId);
  
  // Submit asset (seller)
  await sdk.submitAsset(
    projectId,
    'https://asset-link.com',
    'Asset usage instructions'
  );
  
  // Accept asset (buyer)
  await sdk.acceptAsset(projectId);
}`}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntegrationPage;