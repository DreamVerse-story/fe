/**
 * 로딩 스피너 컴포넌트
 */

export function LoadingSpinner({
    size = 'md',
}: {
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizes = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="flex items-center justify-center relative">
            {/* Outer Glow */}
            <div
                className={`absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse ${sizes[size]}`}
            />

            <svg
                className={`animate-spin ${sizes[size]} text-primary relative z-10`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

export function LoadingPage({
    message,
}: {
    message?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background">
            <LoadingSpinner size="lg" />
            {message && (
                <p className="text-white text-xl font-medium animate-pulse text-center px-4">
                    {message}
                </p>
            )}
        </div>
    );
}
