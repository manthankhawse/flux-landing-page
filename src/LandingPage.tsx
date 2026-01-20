import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Zap, Shield, GitMerge, 
  ArrowRight, CheckCircle2, Server, Box, 
  RefreshCw, Code2, Copy, Check, Download, FileJson, Play
} from 'lucide-react'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';

// --- UTILITY COMPONENTS ---

const Section = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-32 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-6 lg:px-8 relative z-10 ${className}`}>
    {children}
  </div>
);

const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary ${className}`}>
    {children}
  </span>
);

const GlassCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode; className?: string; hoverEffect?: boolean }) => (
  <div className={clsx(
    "glass rounded-3xl border border-white/10 p-8 relative overflow-hidden group",
    hoverEffect && "hover:border-primary/50 transition-colors duration-500",
    className
  )}>
    {hoverEffect && (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    )}
    {children}
  </div>
);

const AnimatedGridBg = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
  </div>
);

// --- CODE SNIPPETS ---

const integrationSnippets = {
  node: `// worker.js (Node:18)
// Flux treats this like a Serverless Function.
// Dependencies like 'axios' are auto-injected.

module.exports = async (payload) => {
  console.log("🚀 Starting Job for:", payload.userId);
  
  const axios = require('axios');
  // Perform complex async logic securely inside Docker
  const res = await axios.post('https://api.internal/process', payload);
  
  console.log("✅ Data processed");
  // Return value is captured as job output
  return { status: 'success', processedId: res.data.id };
};`,
  python: `# worker.py (Python:3.9)
# Runs as an isolated script.
# Payload is injected as Environment Variable.

import os
import json
import pandas as pd

# 1. Read Input
payload_str = os.environ.get("PAYLOAD", "{}")
payload = json.loads(payload_str)

print(f"🐍 Analysis started for dataset: {payload.get('dataset_id')}")

# 2. Heavy lifting with pre-installed data science libs
df = pd.DataFrame(payload.get('data'))
summary = df.describe().to_json()

# 3. Output is captured via stdout logs or file artifacts
print(f"RESULTS_JSON::{summary}")
`,
  sdk: `// workflow.ts (TypeScript SDK)
// Define complex DAGs as code.

import { Flux } from '@flux/sdk';
const client = new Flux(process.env.FLUX_API_URL);

const flow = client.workflow("nightly-etl-pipeline");

// Step 1: Extract
flow.addStep({
    id: 'extract',
    runtime: 'python:3.9',
    packages: ['sqlalchemy', 'pandas'],
    handler: './scripts/extract_pg.py'
});

// Step 2: Transform (Runs only after Extract succeeds)
flow.addStep({
    id: 'transform',
    runtime: 'node:18',
    dependsOn: ['extract'], // <-- The magic glue
    handler: async (payload) => { /* Transformation logic */ }
});

// Schedule it
flow.schedule("0 3 * * *");
await flow.commit();`
};

const StepCard = ({ number, icon: Icon, title, desc, code }: { number: string, icon: any, title: string, desc: string, code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: parseInt(number) * 0.1 }}
        className="relative group h-full"
      >
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg z-20 border-2 border-[#030014]">
              {number}
          </div>
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col relative z-10 bg-[#030014]/50">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">{desc}</p>
              
              <div className="relative bg-[#0e0e10] rounded-lg border border-white/10 p-3 group/code mt-auto">
                  <code className="text-[10px] sm:text-xs font-mono text-green-400 break-all block pr-6 leading-relaxed">
                    {code}
                  </code>
                  <button 
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors opacity-0 group-hover/code:opacity-100"
                      title="Copy to clipboard"
                  >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
              </div>
          </div>
      </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const CodeViewer = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0e0e10] shadow-2xl relative group">
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </button>
      <div className="flex items-center gap-2 px-4 py-3 bg-[#18181b] border-b border-white/5 font-mono text-xs text-slate-400">
        <Terminal className="w-4 h-4" />
        <span>{lang}</span>
      </div>
      <div className="p-4 text-sm">
        <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ background: 'transparent', margin: 0 }}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <GlassCard className="h-full">
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </GlassCard>
  </motion.div>
);



// --- MAIN COMPONENT ---

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const [activeTab, setActiveTab] = useState<'node' | 'python' | 'sdk'>('node');

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-white selection:bg-primary/30 overflow-hidden">
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl"
      >
        <Container className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-50 animate-pulse" />
                <Zap className="w-6 h-6 text-primary fill-primary relative z-10" />
            </div>
            <span>Flux</span>
          </div>
          <div className="flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Features</a>
            <a href="#architecture" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">How it Works</a>
            <a href="#integration" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">Integration</a>
            <a 
              href="http://localhost:3000" 
              target="_blank"
              className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_20px_-10px_rgba(255,255,255,0.5)]"
            >
              Launch Console
            </a>
          </div>
        </Container>
      </motion.nav>

      {/* Hero Section */}
      <Section className="pt-48 pb-32 overflow-visible">
        <AnimatedGridBg />
        {/* Background Glows */}
        <motion.div style={{ y }} className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -z-10 animate-blob opacity-70" />
        <motion.div style={{ y }} className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] -z-10 animate-blob animation-delay-2000 opacity-70" />

        <Container className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            v1.0 Production Ready System
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            The Operating System for <br />
            <GradientText>Distributed Compute.</GradientText>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            Stop building fragile Cron jobs. Flux is a self-healing orchestration engine that runs any code in isolated Docker sandboxes at massive scale.
          </motion.p>

          {/* New "Get Running in 3 Steps" Section */}
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-8"
            >
              Get Running in 3 Steps
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <StepCard 
                  number="1"
                  icon={Download}
                  title="Pull the Image"
                  desc="Get the latest core platform image from Docker Hub."
                  code="docker pull manthakhawse/flux-platform:latest"
              />
              <StepCard 
                  number="2"
                  icon={FileJson}
                  title="Get Compose File"
                  desc="Download the official production configuration."
                  code="curl -L https://gist.githubusercontent.com/manthankhawse/300068b200029562fb270b86e0f2fc98/raw/docker-compose.yml -o docker-compose.yml"
              />
              <StepCard 
                  number="3"
                  icon={Play}
                  title="Run Platform"
                  desc="Spin up the entire orchestration engine instantly."
                  code="docker-compose up -d"
              />
            </div>
          </div>

        </Container>
      </Section>

      {/* --- METRICS BANNER --- */}
      <hr className="border-y border-white/5 bg-white/2 backdrop-blur-md relative z-20"/>


      {/* --- THE PROBLEM & SOLUTION --- */}
      <Section>
        <Container className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-flex items-center gap-2 text-primary font-bold mb-6 tracking-wider uppercase text-sm">
                    <Shield className="w-4 h-4" /> The Need for Flux
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Your background jobs are a <span className="text-red-500 line-through decoration-4">liability</span>.</h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                    Relying on single-server Cron, fragile message queues, or expensive managed services creates a single point of failure. When a worker crashes, data is lost. When load spikes, systems lock up.
                </p>
                <ul className="space-y-4">
                    {[
                        "No isolation between jobs (one bad script crashes everything).",
                        "Limited runtimes and dependency conflicts.",
                        "Zero visibility into real-time execution logs.",
                        "Manual restarts required on failure."
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-red-500"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </div>
                            <span className="text-slate-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <GlassCard className="bg-gradient-to-br from-primary/5 to-secondary/5 !border-primary/20">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    The Flux Advantage
                </h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                    Flux was engineered based on distributed systems principles to ensure that if a job *can* run, it *will* run, exactly once.
                </p>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <Cpu className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg text-white mb-1">Ephemeral Docker Sandboxes</h4>
                            <p className="text-slate-400">Every execution spins up a fresh, pristine container. No shared state, no pollution.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <GitMerge className="w-8 h-8 text-secondary flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg text-white mb-1">DAG Workflow Engine</h4>
                            <p className="text-slate-400">Chain complex tasks. Job B automatically receives output data from Job A upon success.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg text-white mb-1">At-Least-Once Guarantee</h4>
                            <p className="text-slate-400">Distributed locking ensures jobs are never lost, even during total node power failure.</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </Container>
      </Section>

      {/* --- FEATURES GRID --- */}
      <Section id="features" className="bg-[#050518]">
        <AnimatedGridBg />
        <Container>
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Engineered for <GradientText>Resilience at Scale</GradientText>.</h2>
            <p className="text-xl text-slate-400 leading-relaxed">Everything you need to run mission-critical workloads without the ops headache.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Box} title="Docker Isolation" delay={0.1}
              desc="Zero-trust execution. User code runs in ephemeral containers destroyed immediately after completion."
            />
             <FeatureCard 
              icon={Zap} title="Smart Caching" delay={0.2}
              desc="Code artifacts and Docker layers are cached on workers, reducing cold-start times by over 40%."
            />
            <FeatureCard 
              icon={GitMerge} title="DAG Workflows" delay={0.3}
              desc="Define complex dependency trees. Flux manages execution order and automated data passing between steps."
            />
            <FeatureCard 
              icon={RefreshCw} title="Self-Healing" delay={0.4}
              desc="The heartbeat monitor detects stale locks from crashed workers and recovers jobs instantly."
            />
             <FeatureCard 
              icon={Code2} title="Polyglot Runtimes" delay={0.5}
              desc="Native support for Node.js, Python, and Bash. Bring your own libraries and environment variables."
            />
            <FeatureCard 
              icon={Server} title="Self-Hosted & Private" delay={0.6}
              desc="Keep your data within your VPC. The entire platform boots with a single docker-compose command."
            />
          </div>
        </Container>
      </Section>

      {/* --- ARCHITECTURE DIAGRAM (How it Works) --- */}
      <Section id="architecture" className="overflow-visible">
        <Container>
            <div className="text-center mb-24">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Under the Hood</h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">A split-plane architecture designed for massive horizontal scalability.</p>
            </div>
            
            <div className="relative">
                {/* Connecting Line (Background) - Aligned to center of cards (top-24 matches h-48 center) */}
                <div className="absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    
                    {/* 1. Client */}
                    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} className="relative group">
                        <GlassCard className="h-48 flex flex-col justify-center items-center text-center !p-6 bg-white/5 border-white/10 hover:border-white/20 relative z-20">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                <Code2 className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">1. Client / SDK</h3>
                            <p className="text-xs text-slate-400 leading-relaxed px-2">Submits code & defines DAGs via HTTP.</p>
                            
                            {/* Connector Dot (Right) */}
                            <div className="absolute top-1/2 -right-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                        </GlassCard>
                    </motion.div>

                    {/* 2. API Gateway (Control Plane) */}
                    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.1}} className="relative group">
                         <GlassCard className="h-48 flex flex-col justify-center items-center text-center !p-6 bg-primary/5 border-primary/30 shadow-[0_0_50px_-20px_rgba(112,66,248,0.2)] relative z-20">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                                <Server className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">2. API Gateway</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Ingests jobs, validates auth, queues tasks.</p>

                            {/* Connector Dots (Left & Right) */}
                            <div className="absolute top-1/2 -left-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                            <div className="absolute top-1/2 -right-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                        </GlassCard>

                        {/* Database Tree Structure - Hanging off the card */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                            {/* Vertical Stem */}
                            <div className="h-8 w-px bg-gradient-to-b from-primary/50 to-white/10"></div>
                            
                            {/* Horizontal Connector */}
                            <div className="w-32 sm:w-40 h-px bg-white/10 relative">
                                <div className="absolute left-0 top-0 h-3 w-px bg-white/10"></div> {/* Left drop */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-0 h-3 w-px bg-white/10"></div> {/* Center drop */}
                                <div className="absolute right-0 top-0 h-3 w-px bg-white/10"></div> {/* Right drop */}
                            </div>

                            {/* DB Icons Row */}
                            <div className="flex gap-4 sm:gap-8 mt-3">
                                {/* Mongo */}
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center backdrop-blur-md">
                                        <span className="text-[7px] font-bold text-[#00ED64]">MONGO</span>
                                    </div>
                                </div>
                                {/* Redis */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF4438]/10 border border-[#FF4438]/30 flex items-center justify-center backdrop-blur-md relative -top-1 shadow-[0_0_15px_-5px_rgba(255,68,56,0.5)]">
                                        <span className="text-[8px] font-bold text-[#FF4438]">REDIS</span>
                                    </div>
                                </div>
                                {/* S3 */}
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#38A1FF]/10 border border-[#38A1FF]/30 flex items-center justify-center backdrop-blur-md">
                                        <span className="text-[7px] font-bold text-[#38A1FF]">S3</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Worker Fleet */}
                     <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.2}} className="relative group">
                        <GlassCard className="h-48 flex flex-col justify-center items-center text-center !p-6 bg-secondary/5 border-secondary/30 shadow-[0_0_50px_-20px_rgba(0,212,255,0.2)] relative z-20">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/20">
                                <Cpu className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">3. Worker Nodes</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Polls Redis, locks tasks, executes code.</p>

                            {/* Connector Dots (Left & Right) */}
                            <div className="absolute top-1/2 -left-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                            <div className="absolute top-1/2 -right-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                        </GlassCard>
                    </motion.div>

                    {/* 4. Docker Sandbox */}
                    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay:0.3}} className="relative group">
                         <GlassCard className="h-48 flex flex-col justify-center items-center text-center !p-6 bg-[#1d63ed]/5 border-[#1d63ed]/30 shadow-[0_0_50px_-20px_rgba(29,99,237,0.2)] relative z-20">
                            <div className="w-12 h-12 rounded-lg bg-[#1d63ed]/10 flex items-center justify-center mb-4 border border-[#1d63ed]/20">
                                <Box className="w-6 h-6 text-[#1d63ed]" />
                            </div>
                            <h3 className="font-bold text-white text-lg mb-1">4. Docker Sandbox</h3>
                            <p className="text-xs text-slate-400 leading-relaxed px-2">Ephemeral execution. Logs streamed back.</p>

                            {/* Connector Dot (Left) */}
                            <div className="absolute top-1/2 -left-3.5 w-3 h-3 bg-[#030014] border border-white/20 rounded-full hidden md:block z-30" />
                        </GlassCard>
                    </motion.div>

                </div>
            </div>
            
            {/* Spacer for the hanging DB icons */}
            <div className="h-32" /> 
        </Container>
      </Section>
      
      {/* --- INTEGRATION (Developer Experience) --- */}
      <Section id="integration" className="bg-[#050518]">
        <Container className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Developers, <br /> by Developers.</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Integrate Flux into your existing stack in minutes. Use our strongly-typed SDK for complex workflows, or drop in simple scripts with zero boilerplate.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Polyglot Runtimes</h3>
                  <p className="text-slate-400">Write code in your language of choice. We handle the containerization, dependency injection, and payload passing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 border border-secondary/20">
                  <GitMerge className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Workflow as Code</h3>
                  <p className="text-slate-400">Define dependencies, retries, and schedules programmatically and version control your infrastructure logic.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Tabs */}
          <div>
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 w-fit">
              {(['node', 'python', 'sdk'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
                    activeTab === tab 
                      ? "bg-primary text-white shadow-lg shadow-primary/25" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab === 'node' ? 'Node.js' : tab === 'python' ? 'Python' : 'TypeScript SDK'}
                </button>
              ))}
            </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CodeViewer 
                  code={integrationSnippets[activeTab]} 
                  lang={activeTab === 'sdk' ? 'typescript' : activeTab === 'node' ? 'javascript' : 'python'} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </Section>

      {/* --- FINAL CTA / GET STARTED --- */}
      <Section className="text-center relative overflow-hidden py-32">
        <motion.div style={{ y }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[200px] -z-10 animate-pulse opacity-50" />
        <Container>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Ready to Orchestrate?</h2>
          <p className="text-xl text-slate-300 mb-16 max-w-2xl mx-auto">
            Get your private cluster running in less than 3 minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              <StepCard 
                  number="1"
                  icon={Download}
                  title="Pull the Image"
                  desc="Get the latest core platform image."
                  code="docker pull ghcr.io/flux-run/platform:latest"
              />
              <StepCard 
                  number="2"
                  icon={FileJson}
                  title="Get Compose File"
                  desc="Download the production config."
                  code="curl -L https://flux.run/docker-compose.yml -o docker-compose.yml"
              />
              <StepCard 
                  number="3"
                  icon={Play}
                  title="Run Platform"
                  desc="Spin up the orchestration engine."
                  code="docker-compose up -d"
              />
          </div>

          <div className="mt-16">
            <a 
                href="http://localhost:3000" 
                target="_blank"
                className="inline-flex items-center justify-center px-12 py-5 text-lg font-bold bg-white text-black rounded-full hover:bg-slate-200 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.6)]"
            >
                Launch Console <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

        </Container>
      </Section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-16 bg-[#02000d] relative z-10">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                <Zap className="w-6 h-6 text-primary fill-primary" />
                <span>Flux</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400 font-medium">
                <a href="#features" className="hover:text-white">Features</a>
                <a href="#architecture" className="hover:text-white">Architecture</a>
                <a href="https://github.com/yourusername/flux" className="hover:text-white">GitHub</a>
            </div>
            <div className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Distributed Systems Inc. MIT License.
            </div>
        </Container>
      </footer>
    </div>
  );
}