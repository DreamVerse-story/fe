'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

/**
 * Wallet Connect Button
 * 네비게이션 바와 통일된 스타일의 지갑 연결 버튼
 */
export function WalletButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready =
                    mounted &&
                    authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus ===
                            'authenticated');

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            // 지갑 미연결
                            if (!connected) {
                                return (
                                    <button
                                        onClick={
                                            openConnectModal
                                        }
                                        className="h-10 px-4 rounded-full bg-primary text-black font-semibold text-sm border-2 border-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 shadow-md"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={
                                                    2
                                                }
                                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">
                                            Connect
                                        </span>
                                    </button>
                                );
                            }

                            // 잘못된 네트워크
                            if (chain.unsupported) {
                                return (
                                    <button
                                        onClick={
                                            openChainModal
                                        }
                                        className="h-10 px-4 rounded-full bg-red-500/20 text-red-400 border-2 border-red-500/40 hover:border-red-500/50 font-semibold text-sm transition-all hover:bg-red-500/30 flex items-center gap-2 shadow-sm"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={
                                                    2
                                                }
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">
                                            Switch
                                        </span>
                                    </button>
                                );
                            }

                            // 지갑 연결됨 - 통합 버튼
                            return (
                                <button
                                    onClick={
                                        openAccountModal
                                    }
                                    className="h-10 px-3 sm:px-4 rounded-full bg-white/10 border-2 border-white/20 hover:border-white/30 font-medium text-sm transition-all hover:bg-white/15 flex items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md"
                                >
                                    {/* 체인 아이콘 */}
                                    {chain.hasIcon &&
                                        chain.iconUrl && (
                                            <div
                                                className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/20"
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                }}
                                            >
                                                <img
                                                    alt={
                                                        chain.name ??
                                                        'Chain'
                                                    }
                                                    src={
                                                        chain.iconUrl
                                                    }
                                                    className="w-5 h-5"
                                                />
                                            </div>
                                        )}

                                    {/* 주소 */}
                                    <span className="text-white font-mono text-sm">
                                        {
                                            account.displayName
                                        }
                                    </span>

                                    {/* 드롭다운 아이콘 */}
                                    <svg
                                        className="w-3.5 h-3.5 text-white/50"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
