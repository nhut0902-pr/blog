'use client';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Tech Background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Decorative orbs */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

            <div className="relative max-w-lg w-full">
                {/* Main card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-8 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-2 border-cyan-500/30">
                            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white text-center mb-4 font-mono">
                        <span className="text-cyan-400">&gt;_</span> OFFLINE_MODE
                    </h1>

                    {/* Message */}
                    <p className="text-slate-300 text-center mb-6">
                        Bạn đang <span className="text-red-400 font-mono">offline</span>. Vui lòng kiểm tra kết nối mạng để tiếp tục sử dụng BlogApp.
                    </p>

                    {/* Reload button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        >
                            RETRY_CONNECTION
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <p className="text-xs text-slate-500 text-center font-mono">
                            SYSTEM_CODE: NET_ERR_OFFLINE // v2.0.4
                        </p>
                    </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />
            </div>
        </div>
    );
}

export const metadata = {
    title: 'Offline - BlogApp',
    description: 'Bạn đang offline',
};
