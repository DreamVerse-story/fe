/**
 * 토스트 알림 컴포넌트
 */

'use client';

import {
    createContext,
    useContext,
    useState,
    useCallback,
} from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<
    ToastContextType | undefined
>(undefined);

export function ToastProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info') => {
            const id = Math.random()
                .toString(36)
                .substring(7);
            const newToast: Toast = { id, message, type };

            setToasts((prev) => [...prev, newToast]);

            // 3초 후 자동 제거
            setTimeout(() => {
                setToasts((prev) =>
                    prev.filter((t) => t.id !== id)
                );
            }, 3000);
        },
        []
    );

    const removeToast = (id: string) => {
        setToasts((prev) =>
            prev.filter((t) => t.id !== id)
        );
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() =>
                            removeToast(toast.id)
                        }
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error(
            'useToast must be used within a ToastProvider'
        );
    }
    return context;
}

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠',
    };

    return (
        <div
            className={`${
                bgColors[toast.type]
            } text-white px-8 py-5 rounded-lg shadow-lg flex items-center gap-4 min-w-[320px] max-w-[450px] animate-slide-in-right`}
        >
            <span className="text-3xl">
                {icons[toast.type]}
            </span>
            <p className="flex-1 font-medium text-lg">
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
}
