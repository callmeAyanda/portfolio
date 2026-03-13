"use client";

export const WelcomeContent = () => (
  <div className="p-3 font-sans text-sm space-y-3">
    <div className="border-b border-border-dark pb-2 mb-1">
      <h1 className="text-xl font-bold leading-tight">Ayanda Makhubu</h1>
      <p className="text-xs text-gray-700 mt-0.5">Software Engineer | SaaS Architect</p>
    </div>

    <p className="leading-relaxed">
      I design and build intelligent software platforms that automate complex business operations. 
      My work focuses on combining modern full-stack engineering, data systems, and applied AI to create 
      scalable products used to streamline workflows, analyze data, and support strategic decision-making.
    </p>

    <p className="leading-relaxed">
      Rather than building isolated applications, I focus on architecting complete systems from database design 
      and backend services to frontend interfaces and AI integrations. My goal is to build software that replaces 
      manual processes with intelligent, automated systems.
    </p>

    <p className="leading-relaxed">
      I specialize in building production-grade SaaS platforms, particularly those that integrate AI, data pipelines, 
      and modern web architectures.
    </p>

    {/* Optional retro-style system info */}
    <div className="border-t border-border-dark pt-2 mt-2 text-xs text-gray-600 flex justify-between">
      <span>SYSTEM: Windows 98 Portfolio</span>
      <span>STATUS: Online</span>
    </div>
  </div>
);
