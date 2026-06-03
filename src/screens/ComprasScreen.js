import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ComprasScreen() {

  const [material, setMaterial] = useState("");

  const [quantidade, setQuantidade] = useState("");

  const [valor, setValor] = useState("");

  const [validade, setValidade] = useState("");

  const [compras, setCompras] = useState([]);

  const [editandoId, setEditandoId] = useState(null);

  const [quantidadeOriginal, setQuantidadeOriginal] = useState(0);

  const [minimo, setMinimo] = useState("");

  // =========================
  // CARREGAR DADOS
  // =========================

  useEffect(() => {

    async function carregarCompras() {

      const dados =
        await AsyncStorage.getItem("compras");

      if (dados) {
        setCompras(JSON.parse(dados));
      }
    }

    carregarCompras();

  }, []);

  // =========================
  // SALVAR AUTOMATICAMENTE
  // =========================

  useEffect(() => {

    AsyncStorage.setItem(
      "compras",
      JSON.stringify(compras)
    );

  }, [compras]);

  // =========================
  // ADICIONAR OU EDITAR
  // =========================

  async function adicionarCompra() {

    if (
      !material ||
      !quantidade ||
      !valor ||
      !minimo
    ) {
      return;
    }

    // =====================
    // EDITAR
    // =====================

    if (editandoId) {

      const listaAtualizada =
        compras.map(item => {

          if (item.id === editandoId) {

            return {

              ...item,

              material,

              quantidade,

              valor,

              validade,

              minimo,
            };
          }

          return item;
        });

      setCompras(listaAtualizada);

      await AsyncStorage.setItem(
        "compras",
        JSON.stringify(listaAtualizada)
      );

      // =========================
      // ATUALIZAR ESTOQUE
      // =========================

      const estoqueSalvo =
        await AsyncStorage.getItem("estoque");

      let estoque = estoqueSalvo
        ? JSON.parse(estoqueSalvo)
        : [];

      const itemEstoque = estoque.find(
        item => item.material === material
      );

      if (itemEstoque) {

        // REMOVE QUANTIDADE ANTIGA
        itemEstoque.quantidade =
          Number(itemEstoque.quantidade)
          -
          Number(quantidadeOriginal);

        // ADICIONA NOVA
        itemEstoque.quantidade =
          Number(itemEstoque.quantidade)
          +
          Number(quantidade);

        // EVITAR NEGATIVO
        if (itemEstoque.quantidade < 0) {
          itemEstoque.quantidade = 0;
        }

        // ATUALIZA MÍNIMO
        itemEstoque.minimo =
          Number(minimo);

        // ATUALIZA VALIDADE
        itemEstoque.validade =
          validade || "N/A";
      }

      await AsyncStorage.setItem(
        "estoque",
        JSON.stringify(estoque)
      );

      setEditandoId(null);

      setQuantidadeOriginal(0);

    } else {

      // =====================
      // NOVA COMPRA
      // =====================

      const novaCompra = {

        id: Date.now().toString(),

        material,

        quantidade,

        valor,

        validade,

        minimo,

        data:
          new Date().toLocaleString("pt-BR"),
          
          timestamp:
          Date.now(),
      };

      const novaLista = [
        ...compras,
        novaCompra
      ];

      setCompras(novaLista);

      // =====================
      // ATUALIZAR ESTOQUE
      // =====================

      const estoqueSalvo =
        await AsyncStorage.getItem("estoque");

      let estoque = estoqueSalvo
        ? JSON.parse(estoqueSalvo)
        : [];

      const itemExistente =
        estoque.find(
          item =>
            item.material === material
        );

      if (itemExistente) {

        itemExistente.quantidade =

          Number(itemExistente.quantidade)
          +
          Number(quantidade);

        itemExistente.minimo =
          Number(minimo);

        itemExistente.validade =
          validade || "N/A";

      } else {

        estoque.push({

          id: Date.now().toString(),

          material,

          quantidade:
            Number(quantidade),

          minimo:
            Number(minimo),

          validade:
            validade || "N/A",

          data:
            new Date().toLocaleString("pt-BR"),
        });
      }

      await AsyncStorage.setItem(
        "estoque",
        JSON.stringify(estoque)
      );
    }

    // =====================
    // LIMPAR CAMPOS
    // =====================

    setMaterial("");

    setQuantidade("");

    setMinimo("");

    setValor("");

    setValidade("");

    setEditandoId(null);

    setQuantidadeOriginal(0);
  }

  // =========================
  // EDITAR
  // =========================

  function editarCompra(item) {

    setMaterial(item.material);

    setQuantidade(
      String(item.quantidade)
    );

    setQuantidadeOriginal(
      Number(item.quantidade)
    );

    setValor(
      String(item.valor)
    );

    setValidade(item.validade);

    setMinimo(
      String(item.minimo || 1)
    );

    setEditandoId(item.id);
  }

  // =========================
  // EXCLUIR
  // =========================

  async function excluirCompra(id) {

    const compra =
      compras.find(item => item.id === id);

    // =========================
    // REMOVER DO ESTOQUE
    // =========================

    const estoqueSalvo =
      await AsyncStorage.getItem("estoque");

    let estoque = estoqueSalvo
      ? JSON.parse(estoqueSalvo)
      : [];

    const itemEstoque = estoque.find(
      item =>
        item.material === compra.material
    );

    if (itemEstoque) {

      itemEstoque.quantidade =
        Number(itemEstoque.quantidade)
        -
        Number(compra.quantidade);

      // EVITAR NEGATIVO
      if (itemEstoque.quantidade < 0) {
        itemEstoque.quantidade = 0;
      }
    }

    await AsyncStorage.setItem(
      "estoque",
      JSON.stringify(estoque)
    );

    // =========================
    // REMOVER COMPRA
    // =========================

    const novaLista =
      compras.filter(
        item => item.id !== id
      );

    setCompras(novaLista);

    await AsyncStorage.setItem(
      "compras",
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
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          🛒 Compras
        </Text>

        <Text
          style={{
            color: "#666",
            marginBottom: 20,
          }}
        >
          Registro de compra de novos materiais.
        </Text>

        {/* INPUTS */}

        <TextInput
          placeholder="Nome do material"

          placeholderTextColor="#000000"

          value={material}

          onChangeText={setMaterial}

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Quantidade"

          placeholderTextColor="#000000"

          value={quantidade}

          onChangeText={setQuantidade}

          keyboardType="numeric"

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Quantidade mínima"

          placeholderTextColor="#000000"

          value={minimo}

          onChangeText={setMinimo}

          keyboardType="numeric"

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        />

        <TextInput
          placeholder="Valor da compra"

          placeholderTextColor="#000000"

          value={valor}

          onChangeText={setValor}

          keyboardType="numeric"

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Validade ou N/A"

          placeholderTextColor="#000000"

          value={validade}

          onChangeText={setValidade}

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />

        {/* BOTÃO */}

        <TouchableOpacity
        
                  onPress={adicionarCompra}
        
                  style={{
                    backgroundColor: "#000000",
                    padding: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
        
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
        
                    {editandoId
                      ? "ATUALIZAR COMPRA"
                      : "SALVAR COMPRA"}
        
                  </Text>
        
                </TouchableOpacity>

        {/* LISTA */}

        <FlatList

          style={{ marginTop: 20 }}

          data={compras}

          scrollEnabled={false}

          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (

            <View
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 15,
                marginBottom: 15,
                elevation: 4,
              }}
            >

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                📦 {item.material}
              </Text>

              <Text>
                🔢 Quantidade:
                {" "}
                {item.quantidade}
              </Text>

              <Text>
                📅 Compra:
                {" "}
                {item.data}
              </Text>

              <Text>
                ⏳ Validade:
                {" "}
                {item.validade || "N/A"}
              </Text>

              <Text
                style={{
                  color: "green",
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                💰 R$
                {" "}
                {Number(item.valor)
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>

              {/* BOTÕES */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >

                <TouchableOpacity

                  onPress={() =>
                    editarCompra(item)
                  }

                  style={{
                    backgroundColor: "#2196F3",
                    padding: 12,
                    borderRadius: 10,
                    width: "48%",
                    alignItems: "center",
                  }}
                >

                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    EDITAR
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity

                  onPress={() =>
                    excluirCompra(item.id)
                  }

                  style={{
                    backgroundColor: "red",
                    padding: 12,
                    borderRadius: 10,
                    width: "48%",
                    alignItems: "center",
                  }}
                >

                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    EXCLUIR
                  </Text>

                </TouchableOpacity>

              </View>

            </View>
          )}
        />

      </View>
    </ScrollView>
  );
}