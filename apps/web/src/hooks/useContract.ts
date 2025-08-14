import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import contractConfig from '../config/contract';
import abi from '../abi/TimeLockVault.json';

export function useContract() {
  const { signer, provider } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!provider) return;
    const address = contractConfig.address;
    const iface = new ethers.Interface(abi as any);
    const newContract = new ethers.Contract(address, iface.fragments, signer ?? provider);
    setContract(newContract);
  }, [signer, provider]);
  return contract;
}