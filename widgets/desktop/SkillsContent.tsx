"use client";

export const SkillsContent = () => (
  <div className="p-2 font-sans text-sm">
    <h2 className="text-lg font-bold border-b border-border-dark pb-1 mb-3">Skills</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkillCategory title="Software Engineering" items={[
        "JavaScript / TypeScript",
        "Python",
        "SQL",
        "C++"
      ]} />
      <SkillCategory title="Frontend Systems" items={[
        "Next.js",
        "React",
        "TailwindCSS",
        "Component-driven UI architecture",
        "Responsive and scalable design systems"
      ]} />
      <SkillCategory title="Backend Systems" items={[
        "Node.js",
        "Express.js",
        "REST API architecture",
        "Authentication systems (JWT)",
        "Backend service design",
        "Workflow automation systems"
      ]} />
      <SkillCategory title="Databases & Data Engineering" items={[
        "PostgreSQL",
        "Relational database architecture",
        "Data modeling and schema design",
        "Query optimization",
        "Analytics data pipelines"
      ]} />
      <SkillCategory title="AI & Intelligent Systems" items={[
        "AI API integrations",
        "Natural language processing",
        "Document intelligence (OCR pipelines)",
        "Automated data extraction",
        "AI-assisted decision systems",
        "Data Science and Analytics"
      ]} />
      <SkillCategory title="Infrastructure & Tools" items={[
        "Git",
        "Github",
        "Cloud storage architectures",
        "AWS S3",
        "API integration systems"
      ]} />
    </div>
  </div>
);

const SkillCategory = ({ title, items }: { title: string; items: string[] }) => (
  <div className="border-sunken p-2 bg-window">
    <h3 className="font-bold text-sm mb-1 border-b border-border-dark pb-0.5">{title}</h3>
    <ul className="list-disc list-inside space-y-0.5 marker:text-black">
      {items.map((item, idx) => (
        <li key={idx} className="pl-1">{item}</li>
      ))}
    </ul>
  </div>
);
