import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {View, Text,TextInput,Alert,TouchableOpacity,Image,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // =========================
  // LOGIN
  // =========================

  async function fazerLogin() {

    const usuarioSalvo =
      await AsyncStorage.getItem("usuario");

    if (!usuarioSalvo) {

      Alert.alert(
        "Erro",
        "Usuário não cadastrado"
      );

      return;
    }

    const usuario =
      JSON.parse(usuarioSalvo);

    if (
      email.trim() === usuario.email
      &&
      senha.trim() === usuario.senha
    ) {

      await AsyncStorage.setItem(
        "usuarioLogado",
        "true"
      );

      navigation.replace("Home");

    } else {

      Alert.alert(
        "Erro",
        "Email ou senha inválidos"
      );
    }
  }

  // =========================
  // RECUPERAR SENHA
  // =========================

  async function recuperarSenha() {

    if (!email) {

      Alert.alert(
        "Atenção",
        "Digite seu email primeiro"
      );

      return;
    }

    const usuarioSalvo =
      await AsyncStorage.getItem("usuario");

    if (!usuarioSalvo) {

      Alert.alert(
        "Erro",
        "Nenhum usuário cadastrado"
      );

      return;
    }

    const usuario =
      JSON.parse(usuarioSalvo);

    if (email.trim() === usuario.email) {

      Alert.alert(
        "Recuperação de Senha",
        `Sua senha é: ${usuario.senha}`
      );

    } else {

      Alert.alert(
        "Erro",
        "Email não encontrado"
      );
    }
  }

  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "rgb(194, 196, 199)",
      }}
    >

      <View
        style={{
          backgroundColor: "#feffff",
          padding: 25,
          borderRadius: 20,
          elevation: 5,
        }}
      >

        {/* LOGO */}

        <Image
          source={require("../../assets/ImagemLogin.png")}

          style={{
            width: 120,
            height: 120,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        {/* TÍTULO */}

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Entrar
        </Text>

        {/* EMAIL */}

        <TextInput
          placeholder="E-mail"

          placeholderTextColor="#000000"

          value={email}

          onChangeText={setEmail}

          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 15,
            padding: 12,
            borderRadius: 10,
          }}
        />

        {/* SENHA */}

        <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              marginBottom: 20,
              paddingHorizontal: 10,
            }}
          >

            <TextInput
              placeholder="Senha"

              placeholderTextColor="#000000"

              value={senha}

              onChangeText={setSenha}

              secureTextEntry={!mostrarSenha}

              style={{
                flex: 1,
                padding: 10,
                color: "#000",
              }}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarSenha(!mostrarSenha)
              }
            >

              <Ionicons
                name={
                  mostrarSenha
                    ? "eye-off"
                    : "eye"
                }

                size={24}

                color="#000000"
              />

            </TouchableOpacity>

        </View>

        {/* ESQUECI SENHA */}

        <TouchableOpacity
          onPress={recuperarSenha}
        >

          <Text
            style={{
              color: "#000000",
              marginBottom: 20,
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            Esqueci minha senha
          </Text>

        </TouchableOpacity>

        {/* BOTÃO LOGIN */}

        <TouchableOpacity

          onPress={fazerLogin}

          style={{
            backgroundColor: "#070707",
            padding: 15,
            alignItems: "center",
            marginBottom: 20,
            borderRadius: 12,
          }}
        >

          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Entrar
          </Text>

        </TouchableOpacity>

        {/* DIVISÃO */}

        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          OU
        </Text>

        {/* CADASTRO */}

        <Text
          style={{
            fontSize: 16,
            marginBottom: 10,
            textAlign: "center",
            color: "#000000",
          }}
        >
          Ainda não possui conta?
        </Text>

        <TouchableOpacity

          onPress={() =>
            navigation.navigate(
              "CadastroUsuario"
            )
          }

          style={{
            backgroundColor: "#575a5c",
            padding: 15,
            alignItems: "center",
            borderRadius: 12,
          }}
        >

          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Cadastrar
          </Text>

        </TouchableOpacity>

      </View>
    </View>
  );
}