import React, { useEffect, useState } from 'react';

interface CountdownProps {
  timestamp: number; // Unix timestamp in seconds
}

export default function Countdown({ timestamp }: CountdownProps) {
  const [remaining, setRemaining] = useState<number>(timestamp - Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(timestamp - Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (remaining <= 0) return <span>Disponível para saque</span>;
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return (
    <span>
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds
        .toString()
        .padStart(2, '0')}
    </span>
  );
}