import React from 'react';
import { useWallet } from '../hooks/useWallet';

export default function ConnectButton() {
  const { account, connect } = useWallet();

  return (
    <div className="mb-4">
      {account ? (
        <span>Conectado: {account}</span>
      ) : (
        <button className="btn" onClick={connect}>
          Conectar carteira
        </button>
      )}
    </div>
  );
}