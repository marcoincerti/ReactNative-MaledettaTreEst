import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import BachecaUno from './pages/BachecaUno';
import BachecaDue from './pages/BachecaDue';
import Profilo from './pages/Profilo';
import Mappa from './pages/Mappa';


const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bacheca" component={BachecaUno} options={{
        title: "Home",
        headerShown: false,
      }} />
      <Tab.Screen name="Settings" component={Profilo} options={{
        title: "Profilo",
        headerShown: false,
      }} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BachecaDue" component={BachecaDue} />
        <Stack.Screen name="Mappa" component={Mappa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}