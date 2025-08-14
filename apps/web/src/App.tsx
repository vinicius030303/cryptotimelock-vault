import React, { useState } from 'react';
import ConnectButton from './components/ConnectButton';
import DepositForm from './components/DepositForm';
import WithdrawPanel from './components/WithdrawPanel';
import { useWallet } from './hooks/useWallet';

export default function App() {
  const { account } = useWallet();
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => setRefresh((x) => x + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Time Lock Vault</h1>
      <ConnectButton />
      {account && (
        <>
          <DepositForm onAction={handleRefresh} />
          <WithdrawPanel refresh={refresh} />
        </>
      )}
    </div>
  );
}