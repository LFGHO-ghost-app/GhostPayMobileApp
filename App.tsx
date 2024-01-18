import {
  ConnectWallet,
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
  smartWallet,
} from '@thirdweb-dev/react-native';
import React from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TW_CLIENT_ID} from '@env';
import {Sepolia} from '@thirdweb-dev/chains';
// import Test from './src/components/Test';
// import SignMessage from './src/components/SignMessage';
const config = {
  factoryAddress: '0x0A2965a37ffd53cDf6c168B64BC03eF70da772A0',
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
  const isDarkMode = useColorScheme() === 'dark';

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  return (
    <View style={styles.view}>
      <Text style={textStyles}>GhostPay App</Text>
      <ConnectWallet />
      {/* <Test />
      <SignMessage /> */}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
