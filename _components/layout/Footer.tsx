/**
 * 공통 Footer 컴포넌트
 */

'use client';

export function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-base text-white/80 uppercase tracking-wider font-medium">
                <div className="text-center md:text-left">
                    © 2025 IDI Incubation.
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                    <a
                        href="#"
                        className="hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                        Protocol
                    </a>
                    <a
                        href="#"
                        className="hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                        Terms
                    </a>
                    <a
                        href="#"
                        className="hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
}
