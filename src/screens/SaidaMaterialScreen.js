import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Picker } from "@react-native-picker/picker";

export default function SaidaMaterialScreen() {

  const [estoque, setEstoque] = useState([]);

  const [material, setMaterial] = useState("");

  const [quantidade, setQuantidade] = useState("");

  const [motivo, setMotivo] = useState("");

  const [movimentacoes, setMovimentacoes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    const estoqueSalvo =
      await AsyncStorage.getItem("estoque");

    if (estoqueSalvo) {
      setEstoque(JSON.parse(estoqueSalvo));
    }

    const movimentacoesSalvas =
      await AsyncStorage.getItem("saidaMateriais");

    if (movimentacoesSalvas) {
      setMovimentacoes(
        JSON.parse(movimentacoesSalvas)
      );
    }
  }

  async function registrarSaida() {

    if (
      !material ||
      !quantidade ||
      !motivo
    ) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );
      return;
    }

    let estoqueAtualizado = [...estoque];

    const item = estoqueAtualizado.find(
      item => item.material === material
    );

    if (!item) {
      Alert.alert(
        "Erro",
        "Material não encontrado"
      );
      return;
    }

    // VALIDAR QUANTIDADE
    if (
      Number(quantidade) >
      Number(item.quantidade)
    ) {
      Alert.alert(
        "Erro",
        "Quantidade indisponível no estoque"
      );
      return;
    }

    // BAIXAR ESTOQUE
    item.quantidade =
      Number(item.quantidade) -
      Number(quantidade);

    // SALVAR ESTOQUE
    await AsyncStorage.setItem(
      "estoque",
      JSON.stringify(estoqueAtualizado)
    );

    setEstoque(estoqueAtualizado);

    // REGISTRAR MOVIMENTAÇÃO
    const novaMovimentacao = {

      id: Date.now().toString(),

      material,

      quantidade,

      motivo,

      data: new Date().toLocaleString("pt-BR"),
    };

    const novaLista = [
      ...movimentacoes,
      novaMovimentacao,
    ];

    setMovimentacoes(novaLista);

    await AsyncStorage.setItem(
      "saidaMateriais",
      JSON.stringify(novaLista)
    );

    // LIMPAR CAMPOS
    setMaterial("");
    setQuantidade("");
    setMotivo("");

    Alert.alert(
      "Sucesso",
      "Saída registrada"
    );
  }

  return (

    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
      }}
    >

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 5,
        }}
      >
        ➖ Saída de Material
      </Text>

      <Text
        style={{
          color: "#666",
          marginBottom: 20,
        }}
      >
        Controle de uso da matéria-prima
      </Text>

      {/* MATERIAL */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: "#ddd",
          overflow: "hidden",
        }}
          >

 <View
  style={{
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    overflow: "hidden",
  }}
>

  <Picker

    selectedValue={material}

    onValueChange={(itemValue) =>
      setMaterial(itemValue)
    }

    dropdownIconColor="#000"

    style={{
      height: 55,
      width: "100%",
      color: "#000",
      backgroundColor: "#fff",
    }}
  >

    <Picker.Item
      label="Selecione o material"
      value=""
      color="#000000"
    />

    {estoque.map((item) => (

      <Picker.Item

        key={item.id}

        label={`${item.material} (${item.quantidade})`}

        value={item.material}

        color="#000"
      />

    ))}

  </Picker>

</View>

      </View>

      {/* QUANTIDADE */}
      <TextInput
        placeholder="Quantidade utilizada"

        placeholderTextColor="#000000"

        value={quantidade}

        onChangeText={setQuantidade}

        keyboardType="numeric"

        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      {/* MOTIVO */}
      <TextInput
        placeholder="Motivo (produção, perda, teste...)"

        placeholderTextColor="#000000"

        value={motivo}

        onChangeText={setMotivo}

        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      {/* BOTÃO */}
      <TouchableOpacity

        onPress={registrarSaida}

        style={{
          backgroundColor: "#000000",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >

        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          REGISTRAR SAÍDA
        </Text>

      </TouchableOpacity>

      {/* HISTÓRICO */}
      <FlatList

        style={{ marginTop: 20 }}

        data={movimentacoes}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              📦 {item.material}
            </Text>

            <Text>
              ➖ Quantidade: {item.quantidade}
            </Text>

            <Text>
              📝 Motivo: {item.motivo}
            </Text>

            <Text>
              📅 {item.data}
            </Text>

          </View>

        )}
      />

    </View>
  );
}