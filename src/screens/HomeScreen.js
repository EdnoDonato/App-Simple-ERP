import React from "react";
import {View, Text, TouchableOpacity, ScrollView,} from "react-native";
import {useState, useCallback, useLayoutEffect,} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {

  const [estoque, setEstoque] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("");

  // =========================
  // LOGOUT
  // =========================

  async function logout() {

    await AsyncStorage.removeItem(
      "usuarioLogado"
    );

    navigation.replace("Login");
  }

  // =========================
  // BOTÃO SAIR NO TOPO
  // =========================

  useLayoutEffect(() => {

    navigation.setOptions({

      headerRight: () => (

        <TouchableOpacity onPress={logout}>

          <Text
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: 20,
              marginRight: 30,
            }}
          >
            Sair
          </Text>

        </TouchableOpacity>
      ),
    });

  }, []);

  // =========================
  // CARREGAR DADOS
  // =========================

  useFocusEffect(

    useCallback(() => {

      async function carregarUsuario() {

        const usuarioSalvo =
          await AsyncStorage.getItem(
            "usuario"
          );

        if (usuarioSalvo) {

          const usuario =
            JSON.parse(usuarioSalvo);

          setNomeUsuario(usuario.nome);
        }
      }

      async function verificarEstoque() {

        const dados =
          await AsyncStorage.getItem(
            "estoque"
          );

        if (dados) {

          const lista =
            JSON.parse(dados);

          setEstoque(lista);

          const itensBaixos =
            lista.filter(
              item =>
                Number(item.quantidade)
                <=
                Number(item.minimo)
            );

          setAlertas(itensBaixos);
        }
      }

      carregarUsuario();

      verificarEstoque();

    }, [])
  );

  // =========================
  // ESTILOS
  // =========================

  const styles = {

    containerCards: {

      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent: "space-between",
    },

    card: {

      width: "49%",

      backgroundColor: "#000000",

      borderRadius: 18,

      paddingVertical: 25,

      paddingHorizontal: 10,

      marginBottom: 25,

      elevation: 5,

      alignItems: "center",

      justifyContent: "center",

      minHeight: 135,
    },

    cardText: {

      color: "#fff",

      fontSize: 20,

      fontWeight: "bold",

      textAlign: "center",
    },
  };

  // =========================
  // RENDER
  // =========================

  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >

      <View
        style={{
          paddingHorizontal: 15,
          paddingTop: 50,
          paddingBottom: 30,
        }}
      >

        {/* TÍTULO */}

        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            marginBottom: 35,
          }}
        >
          Bem-vindo(a) {nomeUsuario} 🤖
        </Text>

        {/* ALERTA ESTOQUE */}

        {alertas.length > 0 && (

          <View
            style={{
              backgroundColor: "#ffe5e5",
              padding: 15,
              borderRadius: 15,
              marginBottom: 25,
            }}
          >

            <Text
              style={{
                color: "red",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              ⚠️ Estoque baixo:
            </Text>

            {alertas.map(item => (

              <Text
                key={item.id}
                style={{
                  fontSize: 15,
                  marginBottom: 5,
                }}
              >
                • {item.material}
                {" "}
                (Qtd: {item.quantidade})
              </Text>

            ))}

          </View>
        )}

        {/* GRID DE BOTÕES */}

        <View style={styles.containerCards}>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Vendas")
            }
          >
            <Text style={styles.cardText}>
              💰 Nova Venda
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Produtos")
            }
          >
            <Text style={styles.cardText}>
              📝 Lista de Produtos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Compras")
            }
          >
            <Text style={styles.cardText}>
              💻 Registro de Material
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("SaidaMaterial")
            }
          >
            <Text style={styles.cardText}>
              ➖ Saída de Material
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Estoque")
            }
          >
            <Text style={styles.cardText}>
              📦 Consultar Estoque
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Dashboard")
            }
          >
            <Text style={styles.cardText}>
              📊 Análise de Despesas
            </Text>
          </TouchableOpacity>

        </View>

        {/* RODAPÉ */}

        <Text
          style={{
            textAlign: "center",
            marginTop: 40,
            color: "#000000",
            fontSize: 12,
          }}
        >
          Developed by Edno Donato
        </Text>

      </View>

    </ScrollView>
  );
}