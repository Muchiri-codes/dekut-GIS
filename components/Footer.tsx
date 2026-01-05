import { SiNextdotjs, SiTailwindcss, SiLeaflet, SiFramer } from 'react-icons/si';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/50 px-3 py-1.5 md:py-2 z-[50]">
      <div className="flex items-center justify-between text-slate-500">
        
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden xs:inline-block text-[8px] md:text-[10px] font-bold uppercase tracking-tighter opacity-50">Stack</span>
          <div className="flex gap-2.5 items-center opacity-70">
            <SiNextdotjs title="Next.js" className="w-3 h-3 md:w-4 md:h-4 hover:text-white transition-colors" />
            <SiTailwindcss title="Tailwind CSS" className="w-3 h-3 md:w-4 md:h-4 hover:text-sky-400 transition-colors" />
            <SiLeaflet title="Leaflet" className="w-3 h-3 md:w-4 md:h-4 hover:text-green-500 transition-colors" />
            <SiFramer title="Framer Motion" className="w-3 h-3 md:w-4 md:h-4 hover:text-pink-500 transition-colors" />
          </div>
        </div>

        {/* Copyright - Single line for mobile */}
        <div className="text-[8px] md:text-[10px] font-medium tracking-tight">
          © {currentYear} <span className="hidden sm:inline">Campus Navigator</span>
        </div>
        
      </div>
    </footer>
  );
}