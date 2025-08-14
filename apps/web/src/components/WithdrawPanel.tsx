import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import Countdown from './Countdown';

interface WithdrawPanelProps {
  refresh: number;
}

export default function WithdrawPanel({ refresh }: WithdrawPanelProps) {
  const { account, signer } = useWallet();
  const contract = useContract();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDeposits() {
      if (!contract || !account) return;
      try {
        setLoading(true);
        const count = await contract.depositCount(account);
        const items: any[] = [];
        for (let i = 0; i < count; i++) {
          const [token, amount, unlockTime, withdrawn] = await contract.getDeposit(account, i);
          items.push({ token, amount, unlockTime: unlockTime.toString(), withdrawn, id: i });
        }
        setDeposits(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeposits();
  }, [contract, account, refresh]);

  const handleWithdraw = async (id: number) => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.withdraw(id);
      await tx.wait();
      // Refresh list
      setDeposits((prev) => prev.map((d) => (d.id === id ? { ...d, withdrawn: true } : d)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-2">Seus depósitos</h2>
      {loading && <p>Carregando...</p>}
      {deposits.map((dep) => (
        <div key={dep.id} className="mb-4 p-2 border rounded">
          <p>Token: {dep.token}</p>
          <p>Quantidade: {ethers.formatEther(dep.amount)} </p>
          <p>
            Desbloqueio em: <Countdown timestamp={Number(dep.unlockTime)} />
          </p>
          <button
            className="btn mt-1"
            disabled={dep.withdrawn || Date.now() / 1000 < Number(dep.unlockTime)}
            onClick={() => handleWithdraw(dep.id)}
          >
            {dep.withdrawn ? 'Resgatado' : 'Resgatar'}
          </button>
        </div>
      ))}
    </div>
  );
}