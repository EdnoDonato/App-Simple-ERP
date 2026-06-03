import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import VendasScreen from "./src/screens/VendasScreen";
import ComprasScreen from "./src/screens/ComprasScreen";
import EstoqueScreen from "./src/screens/EstoqueScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
import NovoUsuarioScreen from "./src/screens/NovoUsuarioScreen";
import ProdutosScreen from "./src/screens/ProdutosScreen";
import SaidaMaterialScreen from "./src/screens/SaidaMaterialScreen";

const Stack = createNativeStackNavigator();

export default function App() {

  const [logado, setLogado] = useState(null);

  useEffect(() => {
  async function verificarLogin() {
    const status = await AsyncStorage.getItem("usuarioLogado");
    setLogado(status === "true");
  }

  verificarLogin();
  }, []);

  if (logado === null) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={logado ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false }}  />
        <Stack.Screen name="CadastroUsuario" component={NovoUsuarioScreen} options={{headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{title: "Simple ERP",headerShadowVisible: false,}} />
        <Stack.Screen name="Vendas" component={VendasScreen} options={{title: "Voltar", headerShown: true }} />
        <Stack.Screen name="Compras" component={ComprasScreen} options={{title: "Voltar", headerShown: true }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{title: "Voltar", headerShown: true }} />
        <Stack.Screen name="Estoque" component={EstoqueScreen} options={{title: "Voltar", headerShown: true }} />
        <Stack.Screen name="Produtos" component={ProdutosScreen} options={{title: "Voltar",headerShown: true }} />
        <Stack.Screen name="SaidaMaterial" component={SaidaMaterialScreen} options={{title: "Voltar",headerShown: true}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}