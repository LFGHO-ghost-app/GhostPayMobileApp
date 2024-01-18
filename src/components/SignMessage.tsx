import {useSigner, useWallet} from '@thirdweb-dev/react-native';
import React, {useState} from 'react';
import {Button, Text} from 'react-native';

const SignMessage = () => {
  const wallet = useWallet();
  const [signedMessage, setSignedMessage] = useState('');
  const signer = useSigner();
  const signMessage = async () => {
    if (!wallet?.getAddress()) {
      console.log('No hay una wallet conectada');
      return;
    }

    try {
      const message = 'Tu mensaje a firmar';
      // Utiliza la función de firma proporcionada por tu proveedor de wallet

      const signature = await signer?.signMessage(message);
      console.log('Firma:', signature);

      setSignedMessage(signature);
      console.log('Firma:', signature);
    } catch (error) {
      console.error('Error al firmar el mensaje:', error);
    }
  };

  return (
    <>
      <Button title="Firmar Mensaje" onPress={signMessage} />
      {signedMessage && <Text>Firma: {signedMessage}</Text>}
    </>
  );
};

export default SignMessage;
