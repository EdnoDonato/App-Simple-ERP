import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Alert,StyleSheet,ScrollView,} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NovoUsuarioScreen({ navigation }) {

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  async function cadastrar() {

    if (!nome || !email || !senha) {

      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );

      return;
    }

    const usuario = {
      nome,
      email,
      senha,
    };

    await AsyncStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    Alert.alert(
      "Sucesso",
      "Usuário cadastrado!"
    );

    navigation.navigate("Login");
  }

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
      }}
    >

      <View style={styles.card}>

        {/* TÍTULO */}
        <Text style={styles.titulo}>
          👤 Novo Usuário
        </Text>

        <Text style={styles.subtitulo}>
          Cadastre um novo acesso ao sistema
        </Text>

        {/* NOME */}
        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#666"

          value={nome}

          onChangeText={setNome}

          style={styles.input}
        />

        {/* EMAIL */}
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#666"

          value={email}

          onChangeText={setEmail}

          keyboardType="email-address"

          autoCapitalize="none"

          style={styles.input}
        />

        {/* SENHA */}
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#666"

          value={senha}

          onChangeText={setSenha}

          secureTextEntry

          style={styles.input}
        />

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.botao}
          onPress={cadastrar}
        >

          <Text style={styles.botaoTexto}>
            CADASTRAR
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    elevation: 5,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },

  subtitulo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  botao: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

});