import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Cpu, Zap, Shield, GitMerge, 
  ArrowRight, Check, Server 
} from 'lucide-react';

// --- COMPONENTS ---

const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium backdrop-blur-md mb-6">
    <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse" />
    {children}
  </div>
);

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`py-24 relative ${className}`}>
    {children}
  </section>
);

const CodeBlock = ({ code, lang = 'typescript' }: { code: string; lang?: string }) => (
  <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">
    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
      </div>
      <span className="ml-auto text-xs font-mono text-slate-500">{lang}</span>
    </div>
    <div className="p-6 overflow-x-auto">
      <pre className="font-mono text-sm text-slate-300 leading-relaxed">
        {code}
      </pre>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
            <span>Flux</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Architecture</a>
            <a 
              href="http://localhost:3000" 
              className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-slate-200 transition-colors"
            >
              Open Console
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        
        {/* --- HERO --- */}
        <Section className="text-center">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge>v1.0 Production Ready</Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Orchestrate workflows <br />
                <span className="text-gradient">without the infrastructure.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Flux is a distributed job scheduler capable of handling 5,000+ jobs/min. 
                Define DAGs as code, run in isolated Docker containers, and sleep while we handle the retry logic.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="http://localhost:3000"
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]"
                >
                  Start Building
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-mono">
                  <span>npm install @flux/sdk</span>
                  <button className="p-2 hover:text-white transition-colors" title="Copy">
                    <span className="sr-only">Copy</span>
                    <Terminal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* --- STATS --- */}
        <div className="border-y border-white/5 bg-white/0 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Ingestion Rate', value: '5k+', suffix: 'jobs/min' },
              { label: 'Dispatch Latency', value: '<50', suffix: 'ms' },
              { label: 'Recovery Time', value: '<3', suffix: 'seconds' },
              { label: 'Isolation', value: '100%', suffix: 'Docker' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{stat.label} {stat.suffix}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- WHY / FEATURES --- */}
        <Section id="features">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Engineered for Scale</h2>
              <p className="text-slate-400">Everything you need to run mission-critical workloads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature Cards */}
              {[
                {
                  icon: <Cpu className="w-6 h-6 text-blue-400" />,
                  title: "Docker Sandboxing",
                  desc: "Zero-trust execution. Every job runs in an ephemeral container, ensuring absolute isolation and consistent environments."
                },
                {
                  icon: <GitMerge className="w-6 h-6 text-purple-400" />,
                  title: "DAG Workflows",
                  desc: "Define complex dependencies. Job B only starts if Job A succeeds. We handle the data passing and state management."
                },
                {
                  icon: <Shield className="w-6 h-6 text-emerald-400" />,
                  title: "Fault Tolerant",
                  desc: "The orchestrator uses a heartbeat protocol to detect stalled jobs and recovers them instantly without manual intervention."
                },
                {
                  icon: <Zap className="w-6 h-6 text-yellow-400" />,
                  title: "Zero Cold Starts",
                  desc: "Intelligent caching of code artifacts in S3 and Docker layer caching reduces execution startup time by ~40%."
                },
                {
                  icon: <Terminal className="w-6 h-6 text-pink-400" />,
                  title: "Polyglot Runtime",
                  desc: "Write your logic in Node.js, Python, or Bash. We handle the containerization automatically."
                },
                {
                  icon: <Server className="w-6 h-6 text-cyan-400" />,
                  title: "Self Hosted",
                  desc: "Keep your data. Flux runs entirely within your VPC or local machine via a single Docker command."
                }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* --- HOW IT WORKS (CODE) --- */}
        <Section id="how-it-works" className="bg-[#050518]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Define workflows as <br />
                <span className="text-gradient">TypeScript Code.</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Stop clicking buttons in a UI. Flux lets you define your infrastructure logic right alongside your application code.
              </p>
              
              <div className="space-y-4">
                {[
                  "Type-safe SDK definition",
                  "Automatic dependency resolution",
                  "Cron scheduling support",
                  "Local development parity"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Code Block */}
            <div className="flex-1 w-full max-w-xl">
              <CodeBlock code={`import { Flux } from '@flux/sdk';

const client = new Flux('http://localhost:3000');

// 1. Define Pipeline
const flow = client.workflow("daily-etl");

// 2. Add Step: Scrape
flow.addStep({
  id: 'extract',
  runtime: 'python:3.9',
  packages: ['pandas'],
  handler: \`
    import pandas as pd
    def handler(payload):
      print("Extracting data...")
      return { "rows": 500 }
  \`
});

// 3. Add Step: Process (Dependent)
flow.addStep({
  id: 'transform',
  runtime: 'node:18',
  dependsOn: ['extract'],
  handler: async (data) => {
    console.log(\`Processing \${data.rows} rows\`);
  }
});

// 4. Deploy
await flow.commit();`} />
            </div>

          </div>
        </Section>

        {/* --- CTA --- */}
        <Section className="text-center py-32">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to scale?</h2>
            <p className="text-slate-400 mb-10 text-lg">
              Join the future of distributed orchestration. <br/>
              Open source, self-hosted, and developer-first.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="http://localhost:3000"
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-colors"
              >
                Launch Console
              </a>
              <a 
                href="https://github.com/yourusername/flux"
                className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </Section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 py-12 bg-[#02000d]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Zap className="w-4 h-4" />
              <span>Flux Platform</span>
            </div>
            <div>
              &copy; 2026 Distributed Systems Inc. MIT License.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}