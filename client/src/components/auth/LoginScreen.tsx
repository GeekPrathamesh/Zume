import { SignIn, SignUp } from "@clerk/clerk-react";

const themeConfig = {
  variables: {
    colorBackground: "#09090b",        // zinc-950
    colorText: "#ffffff",
    colorPrimary: "#facc15",           // yellow-400
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
  },
  elements: {
    // Card
    card: "bg-zinc-950/90 backdrop-blur-xl border border-yellow-400/20 shadow-2xl shadow-yellow-400/10",

    // Header
    headerTitle: "text-yellow-400 font-bold tracking-tight",
    headerSubtitle: "text-zinc-400",

    // Social Buttons
    socialButtonsBlockButton:
      "bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all",
    socialButtonsBlockButtonText: "text-white font-medium",

    // Divider
    dividerLine: "bg-zinc-800",
    dividerText: "text-zinc-500 text-xs uppercase tracking-widest",

    // Form
    formFieldLabel: "text-yellow-400/90 font-semibold",
    formFieldInput:
      "bg-zinc-900/60 border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400",

    // Primary Button
    formButtonPrimary:
      "bg-yellow-400 hover:bg-yellow-500 text-black border-none shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all",

    // Footer (removes white completely)
    footer: "bg-zinc-950 border-t border-zinc-800",
    footerInner: "bg-zinc-950",
    footerDivider: "bg-zinc-800",
    footerActionText: "text-zinc-500",
    footerActionLink: "text-yellow-400 hover:text-yellow-300 font-semibold",

    // Identity
    identityPreviewText: "text-white",
    identityPreviewEditButtonIcon: "text-yellow-400",

    // Dev badge
    developmentModeBadge:
      "bg-zinc-900 text-yellow-400 border border-yellow-400/30",

    // OTP
    otpCodeFieldInput:
      "bg-zinc-900 border border-zinc-800 text-white focus:border-yellow-400",

    // Alerts
    alertText: "text-red-400",
    alertIcon: "text-red-400",
  },
};




// Reusable Wrapper for both screens
const PageWrapper = ({ children }) => (
  <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black overflow-hidden font-sans">
    {/* 1. Background Grid Pattern */}
    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    
    {/* 2. Yellow Glowing Orbs */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-500/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/5 blur-[120px]" />

    {/* 3. Top Branding/Navigation */}
    <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black">
          Σ
        </div>
        <span className="text-white font-bold tracking-tighter text-xl uppercase">Nexus <span className="text-yellow-400">Labs</span></span>
      </div>
      <div className="hidden md:block h-[1px] flex-1 mx-8 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      <div className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-mono">System_v2.0</div>
    </nav>

    {/* 4. The Component Container */}
    <main className="relative z-10 w-full max-w-md px-4">
      {children}
    </main>

    {/* 5. Decorative Footer */}
    <footer className="absolute bottom-6 text-zinc-600 text-[10px] tracking-widest uppercase pointer-events-none">
      © 2026 All Rights Reserved // <span className="text-yellow-400/50">Encrypted Connection</span>
    </footer>
  </div>
);

export function LoginScreen() {
  return (
    <PageWrapper>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        appearance={themeConfig}
      />
    </PageWrapper>
  );
}

export function SignupScreen() {
  return (
    <PageWrapper>
      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/login"
        appearance={themeConfig}
      />
    </PageWrapper>
  );
}