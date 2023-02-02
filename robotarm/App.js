import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  LogBox,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';

import BluetoothSerial from 'react-native-bluetooth-serial';
import {BleManager, Device} from 'react-native-ble-plx';

export const manager = new BleManager();
LogBox.ignoreLogs(['new NativeEventEmitter']);

const checkForBluetoothPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    let finalPermission =
      Platform.Version >= 29
        ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

    PermissionsAndroid.check(finalPermission).then(result => {
      if (result) {
        //enableBluetoothInDevice();
      } else {
        PermissionsAndroid.request(finalPermission).then(result => {
          if (result) {
            //enableBluetoothInDevice();
          } else {
            console.log('User refuse');
          }
        });
      }
    });
  } else {
    console.log('IOS');

    //enableBluetoothInDevice();
  }
};

const App = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ileri, setIleri] = useState(0.5);
  const [yukari, setYukari] = useState(0.5);
  const [don, setDon] = useState(0.5);
  const [tut, setTut] = useState(0.5);

  useEffect(() => {
    checkForBluetoothPermission();
    getPairedDevices();
    isBluetoothEnabled();
  }, []);

  useEffect(() => {
    BluetoothSerial.on('bluetoothDisabled', isBluetoothEnabled);
  }, []);
  const isBluetoothEnabled = async () => {
    try {
      const bluetoothState = await BluetoothSerial.isEnabled();
      if (!bluetoothState) {
        setConnectedDevice(null);

        Alert.alert(
          'Bluetooth kapalı',
          'Bluetooth açılsın mı?',
          [
            {
              text: 'Hayır',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Evet',
              onPress: () => enableBluetoothAndRefresh(),
            },
          ],
          {cancelable: false},
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getPairedDevices = async () => {
    try {
      const pairedDeviceses = await BluetoothSerial.list();
      setPairedDevices(pairedDeviceses);
      console.log(pairedDeviceses);
      /*
      const d = {
        address: '20:16:10:09:45:18',
        class: '7936',
        id: '20:16:10:09:45:18',
        name: 'HC-05',
      };
      connectToDevice(d);
      */
    } catch (e) {
      console.log(e);
    }
  };
  const enableBluetoothAndRefresh = async () => {
    try {
      await BluetoothSerial.enable();
      setTimeout(() => {
        getPairedDevices();
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };
  const connectToDevice = async device => {
    setLoading(true);
    const connectedDeviceId = connectedDevice && connectedDevice.id;
    if (!connecting) {
      if (device.id === connectedDeviceId) {
        alert('Cihaz halihazırda bağlı');
      } else {
        try {
          setConnecting(true);
          setConnectedDevice(null);

          await BluetoothSerial.connect(device.id);

          ////////////
          setIsConnected(true);
          setLoading(false);
          //////////

          setConnectedDevice(device);
          setConnecting(false);
        } catch (e) {
          console.log(e);
          setConnectedDevice(null);
          setConnecting(false);
          setLoading(false);

          alert('bu cihaza bağlanılamıyor');
        }
      }
    }
  };

  const sendStringToDevice = async () => {
    try {
      await BluetoothSerial.write('0');
      setIleri(0.5);
      setYukari(0.5);
      setDon(0.5);
      setTut(0.5);
    } catch (e) {
      console.log(e);
    }
  };

  const sendIleri = async value => {
    try {
      let p = value * 180;
      let i = parseInt(p).toString();

      if (i.length === 2) {
        i = '0' + i;
      }

      await BluetoothSerial.write('i' + i.toString());
    } catch (e) {
      console.log(e);
    }
  };
  const sendYukari = async value => {
    try {
      let p = value * 90;
      let a = 180 - p;
      let i = parseInt(a).toString();

      if (i.length === 2) {
        i = '0' + i;
      }
      await BluetoothSerial.write('y' + i.toString());
    } catch (e) {
      console.log(e);
    }
  };
  const sendDon = async value => {
    try {
      let p = value * 180;
      let i = parseInt(p).toString();

      if (i.length === 2) {
        i = '0' + i;
      }
      await BluetoothSerial.write('d' + i.toString());
    } catch (e) {
      console.log(e);
    }
  };
  const sendTut = async value => {
    try {
      let p = value * 90;
      let i = parseInt(p).toString();

      if (i.length === 2) {
        i = '0' + i;
      }
      await BluetoothSerial.write('t' + i.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({item}) => (
    <View key={item.id}>
      <TouchableOpacity style={styles.touchbtn} onPress={() => connectToDevice(item)}>
        <Text style={styles.textdevice}>{item.name}</Text>
        <Text>{'id: ' + item.id}</Text>
      </TouchableOpacity>
    </View>
  );

  const devicelist = () => {
    return (
      <View>
        <Text>Previously connected devices...</Text>
        <FlatList data={pairedDevices} renderItem={renderItem} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          visible={loading}
          textContent={'Connecting...'}
          size="large"
        />
      ) : (
        <View style={styles.container2}>
          {isConnected ? (
            <View>

              <TouchableOpacity style={styles.touchbtn} onPress={() => sendStringToDevice()}>
                <Text style={styles.textdevice}>Reset</Text>
              </TouchableOpacity>

              <View style={{marginTop: 50}}>
                <Slider
                  value={ileri}
                  onValueChange={value => {
                    setIleri(value);
                    sendIleri(value);
                  }}
                />
                <Text>{ileri}</Text>

                <Slider
                  value={yukari}
                  onValueChange={value => {
                    setYukari(value);
                    sendYukari(value);
                  }}
                />
                <Text>{yukari}</Text>

                <Slider
                  value={don}
                  onValueChange={value => {
                    setDon(value);
                    sendDon(value);
                  }}
                />
                <Text>{don}</Text>

                <Slider
                  value={tut}
                  onValueChange={value => {
                    setTut(value);
                    sendTut(value);
                  }}
                />
                <Text>{tut}</Text>
              </View>
            </View>
          ) : (
            devicelist()
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd95d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    backgroundColor: '#ffd95d',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  touchbtn: {
    backgroundColor: '#fff',
    padding: 10,
    height: 60,
    width: 300,
    borderColor: '#bbbaba',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textdevice: {
    fontSize: 18,
    fontStyle: 'italic',
    textShadowColor: 'red',
    color: '#000',
  },
})
