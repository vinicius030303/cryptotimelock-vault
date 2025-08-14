import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';

interface DepositFormProps {
  onAction?: () => void;
}

export default function DepositForm({ onAction }: DepositFormProps) {
  const { signer } = useWallet();
  const contract = useContract();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !contract) return;
    try {
      setLoading(true);
      const tokenAddress = token.trim();
      const value = ethers.parseEther(amount);
      const seconds = BigInt(duration);
      // Approve token
      const erc20 = new ethers.Contract(tokenAddress, [
        'function approve(address spender, uint256 amount) public returns (bool)',
      ], signer);
      await (await erc20.approve(contract.target, value)).wait();
      // Deposit
      await (await contract.deposit(tokenAddress, value, seconds)).wait();
      setAmount('');
      setDuration('');
      setToken('');
      onAction?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl mb-2">Depositar</h2>
      <label htmlFor="token">Token (endereço)</label>
      <input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="0x..." required />
      <label htmlFor="amount">Quantidade</label>
      <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" required />
      <label htmlFor="duration">Duração (segundos)</label>
      <input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3600" required />
      <button className="btn mt-2" type="submit" disabled={loading}>
        {loading ? 'Processando...' : 'Depositar'}
      </button>
    </form>
  );
}