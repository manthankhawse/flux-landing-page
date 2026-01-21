import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Cpu, Zap, GitMerge, 
  ArrowRight, Server, Box,
  RefreshCw, Code2, Copy, Check,
  Download, FileJson, Play, Clock, LayoutDashboard, Package, Github
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clsx from 'clsx';
import HeroAsset from './components/HeroAsset';


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

// --- COMPONENT: Code Viewer ---
const CodeViewer = ({ code, lang, title }: { code: string; lang: string, title?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0e0e10] shadow-2xl relative group h-full flex flex-col">
       <div className="flex items-center gap-2 px-4 py-3 bg-[#18181b] border-b border-white/5 font-mono text-xs text-slate-400">
        <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
        <span className="text-slate-300 font-bold">{title || 'example.ts'}</span>
        <span className="ml-auto opacity-50">{lang}</span>
      </div>
      <div className="p-4 text-xs sm:text-sm overflow-auto custom-scrollbar flex-grow">
        <SyntaxHighlighter 
            language={lang} 
            style={vscDarkPlus} 
            customStyle={{ background: 'transparent', margin: 0, padding: 0 }}
            showLineNumbers={true}
            lineNumberStyle={{ minWidth: "2em", paddingRight: "1em", color: "#5c6370", textAlign: "right" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  );
};

// --- COMPONENT: UI Placeholder (Screenshot Frame) ---
const UIFrame = ({ title, route, children }: { title: string, route: string, children: React.ReactNode }) => (
    <div className="rounded-xl border border-white/10 bg-[#030014] shadow-2xl overflow-hidden flex flex-col h-full">
        {/* Browser Header */}
        <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center gap-4">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            </div>
            <div className="bg-black/40 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono flex-grow text-center truncate">
                localhost:3000{route}
            </div>
        </div>
        {/* Content Area */}
        <div className="p-1 flex-grow relative bg-[#050505]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-20 pointer-events-none">
                <LayoutDashboard className="w-16 h-16 mb-4" />
                <div className="text-sm font-bold uppercase tracking-widest">{title} UI</div>
            </div>
            {children}
        </div>
    </div>
)


// --- SNIPPETS & DATA ---

const npmCommand = "npm i @manthankhawse/flux-client";

const featuresData = {
  jobs: {
    title: "Distributed Jobs",
    desc: "Run Node.js, Python, or Bash tasks. We handle the isolation and retries.",
    route: "/job/job-123-abc",
    screenshotAlt: "Job Details Page showing logs and status",
    code: `import { Flux } from '@manthankhawse/flux-client';
const client = new Flux("http://localhost:3000");

// 1. NODE.JS JOB
const nodeWorker = client.createJob({
    name: 'node-math-service',
    runtime: 'node:18',
    handler: async (data) => {
        return { result: data.a + data.b }; 
    }
});

// Trigger job
await nodeWorker.invoke({ a: 10, b: 50 });`
  },
  workflows: {
    title: "DAG Workflows",
    desc: "Chain jobs together. Dependencies are resolved automatically.",
    route: "/workflow/flow-xyz-789",
    screenshotAlt: "Workflow Graph showing dependencies",
    code: `import { Flux } from '@manthankhawse/flux-client';
const client = new Flux("http://localhost:3000");

const flow = client.workflow("daily-news-pipeline");

// Step 1: Scraper
flow.addStep({
    id: 'scrape',
    runtime: 'node:18',
    packages: ['axios'],
    handler: async () => {
        const axios = require('axios');
        return (await axios.get('...')).data;
    }
});

// Step 2: Analyze (Runs after Scrape)
flow.addStep({
    id: 'analyze',
    runtime: 'python:3.9',
    dependsOn: ['scrape'], // 👈 The DAG Edge
    packages: ['textblob'],
    handler: \`
def handler(payload):
    raw_text = payload['context']['scrape']
    return { "score": 0.98 }
\`
});

await flow.commit();`
  },
  cron: {
    title: "Cron Schedules",
    desc: "Turn any workflow into a recurring task with standard Cron syntax.",
    route: "/",
    screenshotAlt: "Dashboard showing scheduled cron jobs",
    code: `import { Flux } from '@manthankhawse/flux-client';
const client = new Flux("http://localhost:3000");

const flow = client.workflow("database-backup");

flow.addStep({
    id: 'backup-db',
    name: 'Dump Postgres',
    runtime: 'bash',
    handler: \`
pg_dump -h $DB_HOST > backup.sql
aws s3 cp backup.sql s3://my-bucket/
\`
});

// ⏱️ Schedule for EVERY NIGHT at 3 AM
flow.schedule("0 3 * * *");

const result = await flow.commit();
console.log("Next Run:", result.nextRunAt);`
  }
};


// --- UTILITY SUB-COMPONENTS ---

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

// --- MAIN PAGE ---

export default function LandingPage() {
  const containerRef = useRef(null);

  const [activeTab, setActiveTab] = useState<'jobs' | 'workflows' | 'cron'>('jobs');
  const [copiedInstall, setCopiedInstall] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(npmCommand);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

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
          </div>
        </Container>
      </motion.nav>

      {/* Hero Section */}
      <Section className="pt-48 pb-32 relative min-h-screen flex items-center">
        {/* Layered Animated Backgrounds */}
        <div className="absolute inset-0 overflow-hidden">
          <HeroAsset/>
        </div>

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
            The Compute Layer <br />
            <GradientText>Your Jobs Deserve.</GradientText>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-24 leading-relaxed"
          >
            Stop building fragile Cron jobs. Flux is a self-healing orchestration engine that runs any code in isolated Docker sandboxes at massive scale.
          </motion.p>

          {/* "Get Running in 3 Steps" Section */}
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
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
                  desc="Download the production config from Gist."
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

      {/* --- INTEGRATION (Developer Experience) --- */}
      <Section id="integration" className="bg-[#050518]">
        <Container>
            {/* Header */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">One SDK, <br/><GradientText>Infinite Possibilities.</GradientText></h2>
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                    Flux isn't just an API. It's a complete TypeScript SDK designed to make distributed systems feel like local function calls.
                </p>
                
                {/* Install Banner */}
                <div className="inline-flex items-center gap-4 p-2 pl-6 pr-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md hover:border-primary/50 transition-colors group">
                     <span className="font-mono text-sm text-slate-300">$ {npmCommand}</span>
                     <button 
                        onClick={copyInstall}
                        className="p-2 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-white transition-all"
                        title="Copy Command"
                     >
                        {copiedInstall ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     </button>
                     <a 
                        href="https://www.npmjs.com/package/@manthankhawse/flux-client" 
                        target="_blank"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-[-8px]"
                        title="View on NPM"
                     >
                        <Package className="w-4 h-4" />
                     </a>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-12">
                 {[
                    { id: 'jobs', label: 'Distributed Jobs', icon: Cpu },
                    { id: 'workflows', label: 'DAG Workflows', icon: GitMerge },
                    { id: 'cron', label: 'Cron Scheduler', icon: Clock },
                 ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border",
                                isActive 
                                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_-5px_rgba(112,66,248,0.3)]" 
                                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-white"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    )
                 })}
            </div>

            {/* Dynamic Content */}
            <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={activeTab + "-left"}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                    >
                         <CodeViewer 
                            code={featuresData[activeTab].code} 
                            lang="typescript"
                            title={`${activeTab}-example.ts`} 
                        />
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode='wait'>
                    <motion.div 
                        key={activeTab + "-right"}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                    >
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                {featuresData[activeTab].title}
                                <ArrowRight className="w-5 h-5 text-slate-500" />
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {featuresData[activeTab].desc}
                            </p>
                        </div>
                        
                        <div className="flex-grow">
                             <UIFrame title={featuresData[activeTab].title} route={featuresData[activeTab].route}>
                                {/* PLACEHOLDER: Replace this div with your actual <img> tag later.
                                    Example: <img src="/screenshots/jobs.png" className="w-full h-full object-cover" />
                                */}
                                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg m-4">
                                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-4">
                                            <div className="w-20 h-2 rounded bg-white/10" />
                                            <div className="w-10 h-2 rounded bg-primary/20" />
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="w-3/4 h-4 rounded bg-white/10" />
                                            <div className="w-1/2 h-4 rounded bg-white/10" />
                                            <div className="w-full h-32 rounded-lg bg-black/20 border border-white/5 mt-4" />
                                        </div>
                                    </div>
                                    <span className="absolute text-xs text-slate-500 font-mono mt-32">
                                        [Insert Screenshot: {featuresData[activeTab].screenshotAlt}]
                                    </span>
                                </div>
                             </UIFrame>
                        </div>
                    </motion.div>
                </AnimatePresence>
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
                {/* Connecting Line (Background) - Aligned to center of cards */}
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

                        {/* Database Tree Structure */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                            {/* Vertical Stem */}
                            <div className="h-8 w-px bg-gradient-to-b from-primary/50 to-white/10"></div>
                            
                            {/* Horizontal Connector */}
                            <div className="w-32 sm:w-40 h-px bg-white/10 relative">
                                <div className="absolute left-0 top-0 h-3 w-px bg-white/10"></div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-0 h-3 w-px bg-white/10"></div>
                                <div className="absolute right-0 top-0 h-3 w-px bg-white/10"></div>
                            </div>

                            {/* DB Icons Row */}
                            <div className="flex gap-4 sm:gap-8 mt-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center backdrop-blur-md">
                                        <span className="text-[7px] font-bold text-[#00ED64]">MONGO</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#FF4438]/10 border border-[#FF4438]/30 flex items-center justify-center backdrop-blur-md relative -top-1 shadow-[0_0_15px_-5px_rgba(255,68,56,0.5)]">
                                        <span className="text-[8px] font-bold text-[#FF4438]">REDIS</span>
                                    </div>
                                </div>
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

      {/* --- FINAL CALL TO ACTION --- */}
      <Section className="relative overflow-hidden border-t border-white/5 bg-[#030014]">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <Container className="text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">
              Stop debugging. <br />
              <GradientText>Start shipping.</GradientText>
            </h2>
            
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The distributed orchestration engine for developers who value sleep.
              <br className="hidden md:block" /> 
              Open source, self-hosted, and production-ready.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <a 
                href="https://github.com/manthankhawse/flux-engine" 
                target="_blank"
                className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <Github className="w-5 h-5" />
                <span>Star on GitHub</span>
              </a>
              
              <a 
                href="https://github.com/manthankhawse/flux-sdk-js/blob/master/README.md"
                target="_blank"
                className="px-8 py-4 glass text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-3 border border-white/10"
              >
                <Terminal className="w-5 h-5 text-slate-400" />
                <span>Read the Docs</span>
              </a>
            </div>

            {/* Trust Badge / Small Social Proof */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">
                    MIT Licensed • Deploy Anywhere
                </p>
            </div>

          </motion.div>
        </Container>
      </Section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-[#02000d] border-t border-white/5 relative z-10 text-sm">
        <Container>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Brand */}
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight opacity-80 hover:opacity-100 transition-opacity">
                    <Zap className="w-5 h-5 text-primary fill-primary" />
                    <span>Flux</span>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-8 text-slate-400 font-medium">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
                    <a href="#integration" className="hover:text-white transition-colors">Integration</a>
                    <a href="https://github.com/manthankhawse/flux-engine" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                </div>

                {/* Copyright */}
                <div className="text-slate-600 font-mono text-xs">
                    © {new Date().getFullYear()} Flux Platform.
                </div>
            </div>
        </Container>
      </footer>
    </div>
  );
}