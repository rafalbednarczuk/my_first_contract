import React, {useState, ChangeEvent} from 'react';
import {useMinterBCContract} from "./hooks/useJettonMinterBC";
import {useJettonWalletContract} from "./hooks/useJettonWallet";
import {useTonConnect} from "./hooks/useTonConnect";
import {ArrowDownUp, RefreshCw} from 'lucide-react';
import './Swap.css';

const Swap: React.FC = () => {
    const {minterAddress, totalSupply, buyCoins} = useMinterBCContract();
    const {sellCoins} = useJettonWalletContract();
    const {connected} = useTonConnect();
    const [sendAmount, setSendAmount] = useState<string>("");
    const [receiveAmount, setReceiveAmount] = useState<string>("");
    const [isSendingTon, setIsSendingTon] = useState<boolean>(true);

    const TON_TO_DUPC_RATE = 100000;

    const handleSwap = () => {
        if (isSendingTon) {
            buyCoins(sendAmount);
        } else {
            sellCoins(sendAmount);
        }
    };

    const calculateReceiveAmount = (amount: string, fromTon: boolean): string => {
        if (!amount) return "";
        const parsedAmount = parseFloat(amount);
        if (fromTon) {
            return (parsedAmount * TON_TO_DUPC_RATE).toFixed(0);
        } else {
            return (parsedAmount / TON_TO_DUPC_RATE).toFixed(8);
        }
    };

    const handleFlip = () => {
        setIsSendingTon(!isSendingTon);
        setSendAmount(receiveAmount);
        setReceiveAmount(calculateReceiveAmount(receiveAmount, !isSendingTon));
    };

    const handleSendAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value;
        setSendAmount(amount);
        setReceiveAmount(calculateReceiveAmount(amount, isSendingTon));
    };

    const formatAmount = (amount: string, isTon: boolean): string => {
        if (!amount) return "0";
        const parsedAmount = parseFloat(amount);
        return isTon ? parsedAmount.toFixed(8) : parsedAmount.toLocaleString('en-US', {maximumFractionDigits: 0});
    };

    return (
        <div className="swap-card">
            <h2 className="swap-title">Swap tokens</h2>

            <div className="swap-input-container">
                <div className="swap-input">
                    <div className="swap-input-header">
                        <span>You send</span>
                        <span>≈ {sendAmount ? `$${(parseFloat(sendAmount) * (isSendingTon ? 2 : 0.00002)).toFixed(2)}` : "$0.00"}</span>
                    </div>
                    <div className="swap-input-body">
                        <input
                            type="number"
                            value={sendAmount}
                            onChange={handleSendAmountChange}
                            placeholder="0"
                        />
                        <div className="token-selector">
                            <div className="token-icon-wrapper">
                                <img
                                    src={isSendingTon ? "https://ton.org/download/ton_symbol.png" : "https://i1.sndcdn.com/artworks-WL8TnfYG5XrRCMRM-5IjLig-t500x500.jpg"}
                                    alt={isSendingTon ? "TON logo" : "DUPC logo"}
                                    className="token-icon"
                                />
                            </div>
                            <span>{isSendingTon ? "TON" : "DUPC"}</span>
                        </div>
                    </div>
                </div>

                <button onClick={handleFlip} className="flip-button">
                    <ArrowDownUp size={20}/>
                </button>

                <div className="swap-input">
                    <div className="swap-input-header">
                        <span>You receive</span>
                        <span>≈ {receiveAmount ? `$${(parseFloat(receiveAmount) * (isSendingTon ? 0.00002 : 2)).toFixed(2)}` : "$0.00"}</span>
                    </div>
                    <div className="swap-input-body">
                        <input
                            type="text"
                            value={formatAmount(receiveAmount, !isSendingTon)}
                            readOnly
                            placeholder="0"
                        />
                        <div className="token-selector">
                            <div className="token-icon-wrapper">
                                <img
                                    src={isSendingTon ? "https://i1.sndcdn.com/artworks-WL8TnfYG5XrRCMRM-5IjLig-t500x500.jpg" : "https://ton.org/download/ton_symbol.png"}
                                    alt={isSendingTon ? "DUPC logo" : "TON logo"}
                                    className="token-icon"
                                />
                            </div>
                            <span>{isSendingTon ? "DUPC" : "TON"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="swap-info">
                <span>1 {isSendingTon ? "TON" : "DUPC"} ≈ {isSendingTon ? TON_TO_DUPC_RATE.toLocaleString() : (1 / TON_TO_DUPC_RATE).toFixed(8)} {isSendingTon ? "DUPC" : "TON"}</span>
                <RefreshCw size={16}/>
            </div>

            <button
                onClick={handleSwap}
                disabled={!connected || !sendAmount}
                className="swap-button"
            >
                {connected ? "Swap" : "Connect Wallet"}
            </button>
        </div>
    );
};

export default Swap;