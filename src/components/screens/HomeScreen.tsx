import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Clipboard,
} from 'react-native';
import {ethers} from 'ethers';

import GhoSymbol from '../../images/ghoSymbol.png';
import Cart from '../../images/cart.png';
import ArrowUp from '../../images/arrowUp.png';
import ArrowDown from '../../images/arrowDown.png';
import ArrowRight from '../../images/arrowRight.png';
import ArrowLeft from '../../images/arrowLeft.png';
import {
  ConnectWallet,
  useAddress,
  useContract,
  useSigner,
} from '@thirdweb-dev/react-native';
import Toast from 'react-native-toast-message';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const HomeScreen = () => {
  const address = useAddress();
  const signer = useSigner();
  const {contract} = useContract('0xc4bF5CbDaBE595361438F8c6a187bDc330539c60');
  const [formattedBalance, setFormattedBalance] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [buy, setBuy] = useState<boolean>(false);
  const [value, setValue] = useState<string>('0');
  const [signedMessage, setSignedMessage] = useState('');

  const fetchBalance = useCallback(async () => {
    try {
      if (contract && address) {
        setIsLoading(true);
        const balance = await contract.call('balanceOf', [address]);
        const formatted = ethers.utils.formatUnits(balance, 18);
        setFormattedBalance(formatted);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener el balance:', error);
      setIsLoading(false);
    }
  }, [contract, address]);
  const checkBalance = async () => {
    try {
      if (contract && address) {
        const balance = await contract.call('balanceOf', [address]);
        const formatted = ethers.utils.formatUnits(balance, 18);
        setFormattedBalance(formatted);
      }
    } catch (error) {
      console.error('Error al obtener el balance:', error);
    }
  };
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(checkBalance, 5000);

    return () => clearInterval(interval);
  }, [fetchBalance]);
  const onBack = () => {
    setBuy(false);
    setValue('0');
    setSignedMessage('');
  };
  const signMessage = async () => {
    try {
      // Convertir el valor en Ether a Wei (formato hexadecimal)
      const amountInWei = ethers.utils.parseEther(value);
      console.log('Amount in Wei:', amountInWei);
      // Crear el hash del mensaje
      const hash = ethers.utils.keccak256(amountInWei);
      console.log('Hash:', hash);
      // Firmar el hash
      const signature = await signer?.signMessage(ethers.utils.arrayify(hash));
      setSignedMessage(signature);
      console.log('Firma:', signature);
    } catch (error) {
      console.error('Error al firmar el mensaje:', error);
    }
  };
  const copyToClipboard = () => {
    Clipboard.setString(signedMessage);
    Toast.show({
      type: 'success',
      text1: 'Copied to Clipboard',
      text2: 'You can now paste it anywhere!',
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };
  function getMessageHash(_amount: string) {
    const amountStr = ethers.utils.hexlify(_amount);
    const hash = ethers.utils.keccak256(amountStr);

    return hash;
  }
  if (buy) {
    const shortSignature = signedMessage
      ? `${signedMessage.substring(0, 5)}...${signedMessage.substring(
          signedMessage.length - 5,
        )}`
      : '';
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create a Purchase With Your GHO</Text>
          <Image source={GhoSymbol} style={styles.headerImage} />
          <Text style={styles.equivalentText}> GHO </Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <>
              <Text style={styles.ghoText}>{value} GHO</Text>
              <Text style={styles.equivalentText}>{`= $ ${value}`}</Text>
              {!signedMessage && (
                <TextInput
                  style={styles.inputField}
                  keyboardType="numeric"
                  placeholder="How Much GHO"
                  onChange={e => setValue(e.nativeEvent.text)}
                />
              )}
              {signedMessage ? (
                <View style={styles.signatureContainer}>
                  <Text style={styles.signatureTitle}>
                    {'Your Purchase Token (click to copy):'}
                  </Text>
                  <TouchableOpacity onPress={copyToClipboard}>
                    <Text style={styles.shortSignature}>{shortSignature}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.iconContainerPurchase}
                  onPress={onBack}>
                  <View style={styles.iconButton}>
                    <Image source={ArrowLeft} style={styles.iconImage} />
                  </View>
                  <Text style={styles.iconText}>Back</Text>
                </TouchableOpacity>
                {!signedMessage && (
                  <TouchableOpacity
                    style={styles.iconContainerPurchase}
                    onPress={signMessage}>
                    <View style={styles.iconButton}>
                      <Image source={ArrowRight} style={styles.iconImage} />
                    </View>
                    <Text style={styles.iconText}>Go!</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
        <View style={styles.iconsRow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.connectButton}>
          <ConnectWallet />
        </View>
        <Image source={GhoSymbol} style={styles.headerImage} />
        <Text style={styles.equivalentText}> GHO </Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.ghoText}>{formattedBalance} GHO</Text>
            <Text
              style={styles.equivalentText}>{`= $ ${formattedBalance}`}</Text>
          </>
        )}
      </View>

      <View style={styles.iconsRow}>
        <TouchableOpacity style={styles.iconContainer}>
          <View style={styles.iconButton}>
            <Image source={ArrowDown} style={styles.iconImage} />
          </View>
          <Text style={styles.iconText}>Fund</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <View style={styles.iconButton}>
            <Image source={ArrowUp} style={styles.iconImage} />
          </View>
          <Text style={styles.iconText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setBuy(true)}>
          <View style={styles.iconButton}>
            <Image source={Cart} style={styles.iconImage} />
          </View>
          <Text style={styles.iconText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
  },
  connectButton: {
    width: screenWidth * 0.6,
    marginBottom: screenHeight * 0.02,
  },
  ghoText: {
    color: 'black',
    fontSize: 48,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  equivalentText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  headerImage: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.05,
    backgroundColor: '#D9D9D9',
    marginBottom: screenHeight * 0.02,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.8,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconButton: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: screenWidth * 0.075,
    backgroundColor: '#8247CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: screenWidth * 0.075,
    height: screenWidth * 0.075,
    resizeMode: 'contain',
  },
  iconText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    marginTop: 8,
  },
  loadingText: {
    color: 'black',
    fontSize: 32,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: screenWidth * 0.7,
  },
  iconContainerPurchase: {
    alignItems: 'center',
    marginTop: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: screenWidth * 0.8,
    marginTop: 20,
  },
  signatureContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signatureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signatureField: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: screenWidth * 0.8,
    maxHeight: 100,
  },
  shortSignature: {
    color: 'blue',
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
