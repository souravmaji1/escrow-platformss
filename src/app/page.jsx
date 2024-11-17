"use client";

"use client";

import React from 'react';
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Wallet,
  X,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Lock,
  Users,
  Menu,
  Zap,
  Activity,
  Database,
  BarChart3,
  Clock,
  Globe,
  Network,
  Cpu,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const HexagonPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
    <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
      <path d="M25 0 L50 14.4 L50 43.2 L25 57.6 L0 43.2 L0 14.4 Z" fill="currentColor"/>
    </pattern>
    <rect width="100" height="100" fill="url(#hexagons)"/>
  </svg>
);

const WavePattern = () => (
  <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 75C960 90 1056 105 1152 105C1248 105 1344 90 1392 82.5L1440 75V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
          fill="currentColor" className="text-gray-800/50"/>
  </svg>
);

const CircuitPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
    <pattern id="circuit" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
      <path d="M10 10h30v30h-30zM15 15h20v20h-20z" stroke="currentColor" fill="none"/>
      <circle cx="25" cy="25" r="2" fill="currentColor"/>
      <path d="M40 25h10M25 40v10" stroke="currentColor"/>
    </pattern>
    <rect width="100" height="100" fill="url(#circuit)"/>
  </svg>
);

const NetworkAnimation = () => (
  <div className="absolute inset-0 overflow-hidden opacity-20">
    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ top: '20%', left: '30%' }}/>
    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ top: '60%', left: '70%' }}/>
    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ top: '40%', left: '50%' }}/>
  </div>
);

const MobileMenu = ({ isOpen, onClose }) => (
  <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-lg">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex flex-col items-center space-y-8 p-8">
        <a href="#features" onClick={onClose} className="text-xl text-gray-300 hover:text-green-400 transition-colors">Features</a>
        <a href="#how-it-works" onClick={onClose} className="text-xl text-gray-300 hover:text-green-400 transition-colors">Solutions</a>
        <a href="#pricing" onClick={onClose} className="text-xl text-gray-300 hover:text-green-400 transition-colors">Enterprise</a>
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Forechain",
            url: "https://Forechain.com",
          }}
        />
      </nav>
    </div>
  </div>
);

// Update LiveMetricsSection with better mobile layout
const LiveMetricsSection = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const metrics = [
    { value: '532ms', label: 'Average Settlement Time' },
    { value: '99.99%', label: 'Network Uptime' },
    { value: '24TB+', label: 'Data Secured' }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-gray-800/30">
      <NetworkAnimation />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="mb-8">
            <Activity className="w-10 h-10 md:w-12 md:h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100">Live Network Metrics</h2>
          </div>
          <div className="relative h-24 md:h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-green-400/5 blur-3xl rounded-full"></div>
            <div className="relative">
              <p className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{metrics[currentMetric].value}</p>
              <p className="text-sm md:text-base text-gray-400">{metrics[currentMetric].label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Update TechnologyStackSection with responsive grid
const TechnologyStackSection = () => {
  const technologies = [
    {
      icon: <Network className="w-6 h-6 md:w-8 md:h-8" />,
      name: "Multi-Chain Protocol",
      description: "Cross-chain compatibility across major networks"
    },
    {
      icon: <Database className="w-6 h-6 md:w-8 md:h-8" />,
      name: "Distributed Storage",
      description: "Redundant data storage with instant recovery"
    },
    {
      icon: <Lock className="w-6 h-6 md:w-8 md:h-8" />,
      name: "Zero-Knowledge Proofs",
      description: "Privacy-preserving transaction validation"
    },
    {
      icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
      name: "AI-Powered Security",
      description: "Real-time threat detection and prevention"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Powered by Advanced Technology
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400">
            Built on cutting-edge blockchain and cryptographic foundations
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-4 md:p-6 bg-gray-800 rounded-lg">
                <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                  <div className="p-2 md:p-3 bg-green-400/10 rounded-lg text-green-400">
                    {tech.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-100">{tech.name}</h3>
                  <p className="text-xs md:text-sm text-gray-400">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



// Global Coverage Section
const GlobalCoverageSection = () => {
  const regions = [
    { name: "North America", transactions: "500K+" },
    { name: "Europe", transactions: "300K+" },
    { name: "Asia Pacific", transactions: "400K+" },
    { name: "Middle East", transactions: "150K+" }
  ];

  return (
    <section className="relative py-24 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Globe className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
            Global Infrastructure
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Strategically positioned nodes ensure low-latency settlement across major financial centers
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {regions.map((region, index) => (
            <div key={index} className="text-center transform hover:scale-105 transition-transform">
              <div className="relative">
                <div className="absolute -inset-2 bg-green-400/10 blur-lg rounded-full"></div>
                <p className="relative text-3xl font-bold text-green-400 mb-2">
                  {region.transactions}
                </p>
              </div>
              <p className="text-gray-400">{region.name}</p>
              <p className="text-sm text-gray-500">Monthly Transactions</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-green-400" />,
      title: "Enterprise-Grade Security",
      description: "Military-grade encryption with multi-signature smart contracts ensures institutional-level protection"
    },
    {
      icon: <Wallet className="w-12 h-12 text-green-400" />,
      title: "Multi-Chain Support",
      description: "Seamlessly operate across major blockchain networks with unified liquidity management"
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-green-400" />,
      title: "Automated Settlement",
      description: "Advanced smart contract automation with customizable settlement conditions and instant execution"
    }
  ];

  const stats = [
    { value: "$2.5B+", label: "Total Volume Secured" },
    { value: "150k+", label: "Enterprise Transactions" },
    { value: "99.99%", label: "Success Rate" }
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800 backdrop-blur-lg bg-gray-900/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <div className="relative">
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                <div className="absolute -inset-1 bg-green-400/20 blur-lg rounded-full"></div>
              </div>
              <span className="ml-3 text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                Forechain
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-green-400 transition-colors">Solutions</a>
              <a href="#pricing" className="text-gray-300 hover:text-green-400 transition-colors">Enterprise</a>
              <ConnectButton
                client={client}
                appMetadata={{
                  name: "Forechain",
                  url: "https://Forechain.com",
                }}
              />
            </nav>
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-32 md:pb-40 px-4">
        <HexagonPattern />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-72 md:w-96 h-72 md:h-96 bg-green-400/20 rounded-full blur-3xl"></div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
            Enterprise Escrow
            <br />
            Infrastructure
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            Powering the next generation of secure digital transactions with institutional-grade smart contract technology and multi-chain settlement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <Link href='/dashboard'>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black px-6 md:px-8 py-5 md:py-6 text-base md:text-lg shadow-lg shadow-green-500/20">
                Start Integration
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg">
              Book Demo
              <ExternalLink className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
        <WavePattern />
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gray-800/50">
        <CircuitPattern />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform">
                <div className="relative">
                  <p className="text-5xl font-bold text-green-400 mb-3">{stat.value}</p>
                  <div className="absolute -inset-2 bg-green-400/10 blur-lg rounded-full"></div>
                </div>
                <p className="text-lg text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <HexagonPattern />
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-16">
            Enterprise Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute -inset-1 bg-green-400/5 blur-lg rounded-lg"></div>
                  <div className="relative">
                    <div className="flex justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-green-400 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-4 bg-gray-800/50">
        <CircuitPattern />
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-16">
            Integration Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <Users />, text: "API Integration" },
              { icon: <Wallet />, text: "Smart Contract Setup" },
              { icon: <RefreshCw />, text: "Custom Settlement Rules" },
              { icon: <Zap />, text: "Automated Execution" }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-green-400 mb-6 relative">
                    <div className="absolute -inset-1 bg-green-400/20 blur-lg rounded-2xl"></div>
                    <div className="relative">{step.icon}</div>
                  </div>
                  <p className="text-xl text-gray-300 font-medium">{step.text}</p>
                </div>
                {index < 3 && (
                  <ChevronRight className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-green-400/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <LiveMetricsSection />

      <TechnologyStackSection />
      <GlobalCoverageSection />

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <HexagonPattern />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -inset-40 bg-gradient-to-r from-green-400/10 to-emerald-500/10 blur-3xl rounded-full"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500 mb-8">
              Ready for Enterprise-Grade Security?
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Join industry leaders who trust Forechain for their mission-critical transactions
            </p>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-black px-8 py-6 text-lg shadow-lg shadow-green-500/20">
              Schedule Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 md:py-16 px-4 relative">
        <CircuitPattern />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-green-400" />
                <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                  Forechain
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade escrow infrastructure for institutional digital assets
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-6">Solutions</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-green-400 transition-colors">Enterprise API</li>
                <li className="hover:text-green-400 transition-colors">Security Features</li>
                <li className="hover:text-green-400 transition-colors">Integration</li>
                <li className="hover:text-green-400 transition-colors">Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-6">Company</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-green-400 transition-colors">About</li>
                <li className="hover:text-green-400 transition-colors">Security</li>
                <li className="hover:text-green-400 transition-colors">Careers</li>
                <li className="hover:text-green-400 transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-6">Legal</h3>
              <ul className="space-y-4 text-gray-400">
  <li className="hover:text-green-400 transition-colors cursor-pointer">Privacy Policy</li>
  <li className="hover:text-green-400 transition-colors cursor-pointer">Terms of Service</li>
  <li className="hover:text-green-400 transition-colors cursor-pointer">Compliance</li>
  <li className="hover:text-green-400 transition-colors cursor-pointer">Security Policies</li>
</ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-gray-400 text-sm">
                <p>&copy; 2024 Forechain. All rights reserved.</p>
              </div>
              <div className="flex justify-start md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Secured by industry-leading smart contract technology and audited by top security firms
            </p>
            <div className="mt-6 flex justify-center space-x-8">
              <div className="text-gray-500 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                SOC2 Certified
              </div>
              <div className="text-gray-500 text-sm flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                ISO 27001
              </div>
              <div className="text-gray-500 text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                GDPR Compliant
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}