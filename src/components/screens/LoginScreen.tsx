import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  metamaskWallet,
  useAddress,
  useSmartWallet,
  useWallet,
} from '@thirdweb-dev/react-native';

import GhostPay from '../../images/ghostpay.png';
import Background from '../../images/background.png';
import HomeScreen from './HomeScreen';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const LoginScreen = () => {
  const address = useAddress();
  const {connect} = useSmartWallet(metamaskWallet(), {
    factoryAddress: '0x7e5643D406A778e7F18E403427F5164ba449Ed0B',
    gasless: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log('checking time');
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  useEffect(() => {
    if (address) {
      setLoading(false);
    }
  }, [address]);
  const handleConnect = async () => {
    try {
      setLoading(true);
      await connect();
      setLoading(false);
    } catch (error) {
      console.log('error connecting ', error);
    }
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={Background}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
        <View style={styles.content}>
          <Image source={GhostPay} style={styles.icon} />
          <Text style={styles.buttonText}>Connecting...</Text>
        </View>
      </View>
    );
  }
  if (address) {
    return <HomeScreen />;
  } else {
    return (
      <View style={styles.container}>
        <Image
          source={Background}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
        <View style={styles.content}>
          <Image source={GhostPay} style={styles.icon} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleConnect}>
              <Text style={styles.buttonText}>Create Your Smart Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Login With Your Smart Wallet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    marginBottom: screenHeight * 0.03,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#b687ee',
    padding: screenWidth * 0.05,
    borderRadius: 15,
    marginTop: screenHeight * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
  },
});

export default LoginScreen;
