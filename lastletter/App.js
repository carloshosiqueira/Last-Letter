import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './components/login'
import LastLetter from './components/lastletter'

  const Stack = createNativeStackNavigator();

  export default function App() {
    return (
      <NavigationContainer>
        
        <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'Bem vindo'}} />
  
          <Stack.Screen
          name="LastLetter"
          component={LastLetter}
          options={{title: 'Última Letra'}} />
  
        </Stack.Navigator>
  
      </NavigationContainer>
    );
}