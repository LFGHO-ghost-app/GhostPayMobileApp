import {useAddress, useWallet} from '@thirdweb-dev/react-native';
import React, {useEffect} from 'react';
import {Text} from 'react-native';

const Test = () => {
  const wallet = useWallet();
  const address = useAddress();
  useEffect(() => {
    console.log('address 1 is ', address);

    const _wallet = wallet?.getAddress().then(address => {
      console.log('Wallet conectada 1:', address);
    });
    console.log('Wallet conectada:', _wallet);
    if (wallet?.getAddress()) {
      console.log('Wallet conectada:', wallet.walletId);
    } else {
      console.log('No hay una wallet conectada');
    }
  }, [wallet]);

  return (
    <Text>
      {wallet?.isConnected
        ? `Wallet conectada: ${wallet.walletId}`
        : 'Conecta tu Wallet'}
    </Text>
  );
};

export default Test;
