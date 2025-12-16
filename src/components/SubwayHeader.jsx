import { Train, Github, FileText } from "lucide-react";

export default function SubwayHeader() {
  return (
    <header className="w-full bg-transparent">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F7BFF] to-[#0048FF] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(15,123,255,0.45)]">
            <Train size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
              NYC Subway Predictor
            </span>
            <div className="text-xs text-[#7B8299] hidden sm:block">
              Real-time delay predictions
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-4 sm:space-x-6 text-[#8F97B3] text-sm">
          <a
            href="#methodology"
            className="hidden md:flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <FileText size={16} />
            <span>Methodology</span>
          </a>
          <a
            href="#github"
            className="flex items-center space-x-1.5 hover:text-white transition-colors"
          >
            <Github size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
