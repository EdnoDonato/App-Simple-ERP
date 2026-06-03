import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EstoqueScreen() {

  const [estoque, setEstoque] = useState([]);

  // ================================
  // CARREGAR ESTOQUE
  // ================================
  useEffect(() => {

    async function carregarEstoque() {

      const dados =
        await AsyncStorage.getItem("estoque");

      if (dados) {
        setEstoque(JSON.parse(dados));
      }
    }

    carregarEstoque();

  }, []);

  // ================================
  // EXCLUIR ITEM
  // ================================
  async function excluirItem(id) {

    const novaLista =
      estoque.filter(item => item.id !== id);

    setEstoque(novaLista);

    await AsyncStorage.setItem(
      "estoque",
      JSON.stringify(novaLista)
    );
  }

  return (

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >

      <View style={{ padding: 20 }}>

        {/* TÍTULO */}
        <Text
          style={{
            fontSize: 45,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          📦 Estoque
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: "gray",
            marginBottom: 30,
          }}
        >
          Controle de matéria-prima
        </Text>

        {/* LISTA */}
        <FlatList
          data={estoque}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}

          renderItem={({ item }) => {

            const estoqueBaixo =
              Number(item.quantidade)
              <=
              Number(item.minimo);

            return (

              <View
                style={{
                  backgroundColor:
                    estoqueBaixo
                      ? "#ffe5e5"
                      : "#fff",

                  padding: 20,
                  borderRadius: 20,
                  marginBottom: 20,

                  elevation: 5,
                }}
              >

                {/* NOME */}
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  📦 {item.material}
                </Text>

                {/* QUANTIDADE */}
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                  }}
                >
                  🔢 Quantidade: {item.quantidade}
                </Text>

                {/* MÍNIMO */}
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                  }}
                >
                  ⚠️ Mínimo: {item.minimo}
                </Text>

                {/* VALIDADE */}
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 5,
                  }}
                >
                  ⏳ Validade: {item.validade}
                </Text>

                {/* DATA */}
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 15,
                  }}
                >
                  📅 Cadastro: {item.data}
                </Text>

                {/* ALERTA */}
                {estoqueBaixo && (

                  <Text
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: 24,
                      marginBottom: 15,
                    }}
                  >
                    ESTOQUE BAIXO
                  </Text>
                )}

                {/* BOTÃO EXCLUIR */}
                <TouchableOpacity

                  onPress={() => excluirItem(item.id)}

                  style={{
                    backgroundColor: "red",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >

                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    EXCLUIR
                  </Text>

                </TouchableOpacity>

              </View>
            );
          }}
        />

      </View>

    </ScrollView>
  );
}