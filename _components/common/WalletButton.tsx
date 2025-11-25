'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useBalance } from 'wagmi';
import { Button } from '../ui';

/**
 * 계정 버튼 (잔액 포함)
 */
function AccountButton({
    address,
    displayName,
    onClick,
}: {
    address: string;
    displayName: string;
    onClick: () => void;
}) {
    const { data: balance } = useBalance({
        address: address as `0x${string}`,
    });

    const formattedBalance = balance
        ? `${(
              Number(balance.value) /
              Math.pow(10, balance.decimals)
          ).toFixed(2)} ${balance.symbol}`
        : '...';

    return (
        <Button onClick={onClick} variant="primary">
            {formattedBalance}
            <span className="ml-2 font-mono">
                {displayName}
            </span>
        </Button>
    );
}

/**
 * Wallet Connect Button
 *
 * RainbowKit의 ConnectButton을 커스터마이징한 지갑 연결 버튼
 *
 * Features:
 * - 지갑 미연결: "Connect Wallet" 버튼 표시
 * - 지갑 연결됨: 주소 + 잔액 + 체인 정보 표시
 * - 잘못된 네트워크: "Switch Network" 버튼 표시
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
                                    <Button
                                        onClick={
                                            openConnectModal
                                        }
                                        variant="primary"
                                    >
                                        🔗 Connect Wallet
                                    </Button>
                                );
                            }

                            // 잘못된 네트워크
                            if (chain.unsupported) {
                                return (
                                    <Button
                                        onClick={
                                            openChainModal
                                        }
                                        variant="secondary"
                                    >
                                        ⚠️ Wrong Network
                                    </Button>
                                );
                            }

                            // 지갑 연결됨
                            return (
                                <div className="flex items-center gap-2">
                                    {/* 체인 정보 */}
                                    <Button
                                        onClick={
                                            openChainModal
                                        }
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background:
                                                        chain.iconBackground,
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: 999,
                                                    overflow:
                                                        'hidden',
                                                    marginRight: 4,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={
                                                            chain.name ??
                                                            'Chain icon'
                                                        }
                                                        src={
                                                            chain.iconUrl
                                                        }
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </Button>

                                    {/* 계정 정보 */}
                                    <AccountButton
                                        address={
                                            account.address
                                        }
                                        displayName={
                                            account.displayName
                                        }
                                        onClick={
                                            openAccountModal
                                        }
                                    />
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
