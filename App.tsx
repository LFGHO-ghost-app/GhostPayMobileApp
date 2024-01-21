import {
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
  smartWallet,
} from '@thirdweb-dev/react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {TW_CLIENT_ID} from '@env';
import {Sepolia} from '@thirdweb-dev/chains';

import LoginScreen from './src/components/screens/LoginScreen';

const config = {
  factoryAddress: '0x7e5643D406A778e7F18E403427F5164ba449Ed0B',
  gasless: true,
};

const App = () => {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId={TW_CLIENT_ID}
      supportedWallets={[
        smartWallet(metamaskWallet(), config),
        smartWallet(walletConnect(), config),
      ]}>
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  return (
    <View style={styles.view}>
      <LoginScreen />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});

export default App;
