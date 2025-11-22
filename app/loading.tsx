export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div className="loader">
                <svg id="cloud" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <defs>
                        <filter id="cloud-shadow">
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="black" />
                        </filter>
                    </defs>

                    {/* Cloud base */}
                    <g id="shapes">
                        <g>
                            <circle cx="20" cy="60" r="15" className="cloud-circle" />
                            <circle cx="50" cy="45" r="20" className="cloud-circle" />
                            <circle cx="80" cy="60" r="15" className="cloud-circle" />
                        </g>
                    </g>

                    {/* Cloud body */}
                    <rect x="15" y="50" width="70" height="30" rx="15" />

                    {/* Download arrows */}
                    <g filter="url(#cloud-shadow)">
                        <path d="M50 45 L50 75 M42 67 L50 75 L58 67"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            className="text-blue-300" />
                    </g>

                    {/* Rain lines */}
                    <g id="lines">
                        <g>
                            <line x1="35" y1="85" x2="35" y2="95" stroke="currentColor" className="text-blue-400" />
                            <line x1="50" y1="85" x2="50" y2="95" stroke="currentColor" className="text-blue-400" />
                            <line x1="65" y1="85" x2="65" y2="95" stroke="currentColor" className="text-blue-400" />
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
}
