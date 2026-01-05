import { SiNextdotjs, SiTailwindcss, SiLeaflet, SiFramer } from 'react-icons/si';
import { HiOutlineLocationMarker, HiOutlineStatusOnline } from 'react-icons/hi';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Footer({ className, ...props }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/50 px-4 py-4 md:py-6 z-[50]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-slate-400">
        
        {/* Left Section: Stack & Campus Info */}
        <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600">Stack</span>
            <div className="flex gap-4 items-center opacity-80">
              <SiNextdotjs title="Next.js" className="w-4 h-4 md:w-5 md:h-5 hover:text-white transition-colors" />
              <SiTailwindcss title="Tailwind CSS" className="w-4 h-4 md:w-5 md:h-5 hover:text-sky-400 transition-colors" />
              <SiLeaflet title="Leaflet" className="w-4 h-4 md:w-5 md:h-5 hover:text-green-500 transition-colors" />
              <SiFramer title="Framer Motion" className="w-4 h-4 md:w-5 md:h-5 hover:text-pink-500 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs border-l border-slate-800 pl-4 md:pl-8">
            <HiOutlineLocationMarker className="text-green-500 w-4 h-4" />
            <span className="font-medium">DeKUT Main Campus</span>
          </div>
        </div>

        {/* Right Section: Status & Copyright */}
        <div className="flex items-center justify-between md:justify-end gap-6 text-xs border-t border-slate-900 pt-4 md:pt-0 md:border-none">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-slate-500 font-medium">System Online</span>
          </div>
          
          <div className="font-medium tracking-tight text-slate-500">
            © {currentYear} <span className="text-slate-300">Campus Navigator</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}