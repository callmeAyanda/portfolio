"use client";

export const AboutContent = () => (
  <div className="space-y-3 p-2 font-sans text-sm">
    <h2 className="text-lg font-bold border-b border-border-dark pb-1 mb-2">About Me</h2>
    
    <section className="border-sunken bg-window p-3">
      <p className="leading-relaxed">
        I am a systems-oriented developer who enjoys solving real operational problems through software. 
        My work sits at the intersection of:
      </p>
      
      <ul className="list-disc list-inside ml-1 space-y-1 marker:text-black">
        <li className="pl-1">Full-stack engineering</li>
        <li className="pl-1">AI-powered automation</li>
        <li className="pl-1">Data driven systems</li>
        <li className="pl-1">Scalable SaaS architecture</li>
      </ul>
      
      <p className="leading-relaxed">
        I focus heavily on architecture and maintainability, ensuring that the systems I build can scale, 
        evolve, and support real production workloads.
      </p>
      
      <p className="leading-relaxed">My approach emphasizes:</p>
      
      <ul className="list-disc list-inside ml-1 space-y-1 marker:text-black">
        <li className="pl-1">Building modular and extensible architectures</li>
        <li className="pl-1">Designing clean data models</li>
        <li className="pl-1">Integrating AI capabilities where they meaningfully reduce manual work</li>
        <li className="pl-1">Shipping practical solutions rather than theoretical prototypes</li>
      </ul>
      
      <p className="leading-relaxed pt-1">
        Alongside engineering, I actively pursue product development and entrepreneurship, 
        building software platforms designed to deliver long-term value.
      </p>
    </section>
  </div>
);
