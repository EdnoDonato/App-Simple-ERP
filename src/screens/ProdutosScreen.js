import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProdutosScreen() {

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [produtos, setProdutos] = useState([]);

  // CONTROLE DE EDIÇÃO
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {

    const dados =
      await AsyncStorage.getItem("produtos");

    if (dados) {
      setProdutos(JSON.parse(dados));
    }
  }

  // FORMATAR VALOR
  function formatarValor(valorDigitado) {

    return valorDigitado.replace(",", ".");
  }

  // SALVAR OU EDITAR
  async function salvarProduto() {

    if (!nome || !valor) {

      Alert.alert(
        "Erro",
        "Preencha nome e valor"
      );

      return;
    }

    const valorFormatado =
      Number(formatarValor(valor));

    // EDITAR
    if (editandoId) {

      const listaAtualizada =
        produtos.map(item => {

          if (item.id === editandoId) {

            return {
              ...item,
              nome,
              valor: valorFormatado,
            };
          }

          return item;
        });

      setProdutos(listaAtualizada);

      await AsyncStorage.setItem(
        "produtos",
        JSON.stringify(listaAtualizada)
      );

      Alert.alert(
        "Sucesso",
        "Produto atualizado"
      );

      setEditandoId(null);

    } else {

      // NOVO PRODUTO
      const novoProduto = {

        id: Date.now().toString(),

        nome,

        valor: valorFormatado,
      };

      const novaLista = [
        ...produtos,
        novoProduto
      ];

      setProdutos(novaLista);

      await AsyncStorage.setItem(
        "produtos",
        JSON.stringify(novaLista)
      );

      Alert.alert(
        "Sucesso",
        "Produto cadastrado"
      );
    }

    limparCampos();
  }

  // EDITAR PRODUTO
  function editarProduto(item) {

    setNome(item.nome);

    setValor(
      String(item.valor).replace(".", ",")
    );

    setEditandoId(item.id);
  }

  // EXCLUIR
  async function excluirProduto(id) {

    Alert.alert(
      "Excluir",
      "Deseja realmente excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Excluir",

          onPress: async () => {

            const novaLista =
              produtos.filter(
                item => item.id !== id
              );

            setProdutos(novaLista);

            await AsyncStorage.setItem(
              "produtos",
              JSON.stringify(novaLista)
            );
          },
        },
      ]
    );
  }

  // LIMPAR
  function limparCampos() {

    setNome("");

    setValor("");

    setEditandoId(null);
  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        📦 Cadastro de Produtos
      </Text>

      <TextInput
        placeholder="Nome do produto"
        placeholderTextColor="#666"

        value={nome}

        onChangeText={setNome}

        style={styles.input}
      />

      <TextInput
        placeholder="Valor unitário"
        placeholderTextColor="#666"

        value={valor}

        onChangeText={setValor}

        keyboardType="numeric"

        style={styles.input}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={salvarProduto}
      >

        <Text style={styles.botaoTexto}>

          {editandoId
            ? "ATUALIZAR PRODUTO"
            : "SALVAR PRODUTO"}

        </Text>

      </TouchableOpacity>

      <FlatList
        data={produtos}

        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.nome}>
              {item.nome}
            </Text>

            <Text>
              {item.descricao}
            </Text>

            <Text style={styles.valor}>

              💰 R$ {Number(item.valor)
                .toFixed(2)
                .replace(".", ",")}

            </Text>

            {/* BOTÕES */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
              }}
            >

              <TouchableOpacity
                style={styles.editar}

                onPress={() =>
                  editarProduto(item)
                }
              >

                <Text style={{ color: "#fff" }}>
                  EDITAR
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.excluir}

                onPress={() =>
                  excluirProduto(item.id)
                }
              >

                <Text style={{ color: "#fff" }}>
                  EXCLUIR
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  botao: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },

  valor: {
    marginTop: 10,
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },

  editar: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },

  excluir: {
    flex: 1,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

});