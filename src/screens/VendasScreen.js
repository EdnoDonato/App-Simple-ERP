import React, { useState, useEffect } from "react";
import {View, Text, TextInput, FlatList, TouchableOpacity, Linking, ScrollView, Alert,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function VendasScreen() {

  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [itensVenda, setItensVenda] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // =====================
  // CARREGAR DADOS
  // =====================

  useEffect(() => {

    async function carregarDados() {

      const dadosVendas =
        await AsyncStorage.getItem("vendas");

      if (dadosVendas) {

        setVendas(
          JSON.parse(dadosVendas)
        );
      }

      const dadosProdutos =
        await AsyncStorage.getItem("produtos");

      if (dadosProdutos) {

        setProdutos(
          JSON.parse(dadosProdutos)
        );
      }
    }

    carregarDados();

  }, []);

  // =====================
  // SALVAR AUTOMÁTICO
  // =====================

  useEffect(() => {

    AsyncStorage.setItem(
      "vendas",
      JSON.stringify(vendas)
    );

  }, [vendas]);

  // =====================
  // ADICIONAR ITEM
  // =====================

  function adicionarItemVenda() {

    if (!produto || !quantidade) {

      Alert.alert(
        "Erro",
        "Selecione produto e quantidade"
      );

      return;
    }

    const novoItem = {

      produto: produto.nome,

      quantidade: Number(quantidade),

      valorUnitario:
        Number(produto.valor),

      subtotal:
        Number(produto.valor)
        *
        Number(quantidade),
    };

    setItensVenda((anterior) => [

      ...anterior,
      novoItem,

    ]);

    setProduto(null);

    setQuantidade("");
  }

  // =====================
  // SALVAR VENDA
  // =====================

  function salvarVenda() {

    if (
      !cliente ||
      itensVenda.length === 0
    ) {

      Alert.alert(
        "Erro",
        "Preencha cliente e itens"
      );

      return;
    }

    const total =
      itensVenda.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      );

    const novaVenda = {

      id:
        editandoId ||
        Date.now().toString(),

      cliente,

      itens: itensVenda,

      valor: total,

      data:
        new Date().toLocaleString("pt-BR"),

        timestamp:
        Date.now(),
    };

    let lista = [];

    // EDITAR
    if (editandoId) {

      lista =
        vendas.map((item) =>

          item.id === editandoId
            ? novaVenda
            : item
        );

    } else {

      // NOVA VENDA NO TOPO
      lista = [
        novaVenda,
        ...vendas,
      ];
    }

    setVendas(lista);

    limparCampos();
  }

  // =====================
  // EDITAR
  // =====================

  function editarVenda(item) {

    setCliente(item.cliente);

    setItensVenda(
      item.itens || []
    );

    setEditandoId(item.id);
  }

  // =====================
  // EXCLUIR
  // =====================

  function excluirVenda(id) {

    const lista =
      vendas.filter(
        item => item.id !== id
      );

    setVendas(lista);
  }

  // =====================
  // LIMPAR
  // =====================

  function limparCampos() {

    setCliente("");

    setProduto(null);

    setQuantidade("");

    setItensVenda([]);

    setEditandoId(null);
  }

  // =====================
  // WHATSAPP
  // =====================

  function enviarComprovante(item) {

    const itensTexto =
      item.itens
        .map((produto) =>

          `📦 ${produto.produto}
🔢 Quantidade: ${produto.quantidade}
💰 R$ ${produto.subtotal
  .toFixed(2)
  .replace(".", ",")}`

        )
        .join("\n\n");

    const mensagem =

`🧾 *Comprovante de Venda*

👤 Cliente:
${item.cliente}

${itensTexto}

💰 *Valor Total:*
R$ ${Number(item.valor)
  .toFixed(2)
  .replace(".", ",")}

📅 Data:
${item.data}

Obrigada pela preferência ❤️`;

    const url =
      `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url);
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
            marginBottom: 20,
          }}
        >
          💰 Registrar Venda
        </Text>

        {/* CLIENTE */}

        <TextInput

          placeholder="Cliente"

          placeholderTextColor="#000000"

          value={cliente}

          onChangeText={setCliente}

          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        />

        {/* PICKER */}

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
          }}
        >

          <Picker

            selectedValue={produto}

            onValueChange={(item) =>
              setProduto(item)
            }

            dropdownIconColor="#000"

            style={{
              color: "#000",
              backgroundColor: "#fff",
            }}
          >

            <Picker.Item
              label="Selecione o Produto"
              value={null}
              color="#000000"
            />

            {produtos.map((item) => (

              <Picker.Item

                key={item.id}

                label={`${item.nome} - R$ ${Number(item.valor)
                  .toFixed(2)
                  .replace(".", ",")}`}

                value={item}

                color="#000"
              />

            ))}

          </Picker>

        </View>

        {/* QUANTIDADE */}

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

        {/* BOTÃO ADD ITEM */}

        <TouchableOpacity

          onPress={adicionarItemVenda}

          style={{
            backgroundColor: "#374151",
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
            ADICIONAR ITEM
          </Text>

        </TouchableOpacity>

        {/* ITENS DA VENDA */}

        {itensVenda.map((item, index) => (

          <View

            key={index}

            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 8,
              marginBottom: 5,
            }}
          >

            <Text>
              📦 {item.produto}
            </Text>

            <Text>
              🔢 {item.quantidade}
            </Text>

            <Text>
              💰 R${" "}

              {item.subtotal
                .toFixed(2)
                .replace(".", ",")}
            </Text>

          </View>

        ))}

        {/* BOTÃO SALVAR */}

        <TouchableOpacity

          onPress={salvarVenda}

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
              ? "ATUALIZAR VENDA"
              : "FECHAR VENDA"}

          </Text>

        </TouchableOpacity>

        {/* LISTA */}

        <FlatList

          data={vendas}

          scrollEnabled={false}

          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (

            <View
              style={{
                backgroundColor: "#fff",
                padding: 15,
                marginBottom: 15,
                borderRadius: 15,
                elevation: 3,
              }}
            >

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                👤 {item.cliente}
              </Text>

              {item.itens?.map((prod, index) => (

                <Text key={index}>
                  📦 {prod.produto} x{prod.quantidade}
                </Text>

              ))}

              <Text>
                📅 {item.data}
              </Text>

              <Text
                style={{
                  color: "green",
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                💰 R${" "}

                {item.valor
                  .toFixed(2)
                  .replace(".", ",")}
              </Text>

              {/* BOTÕES */}

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 10,
                }}
              >

                <TouchableOpacity

                  onPress={() =>
                    editarVenda(item)
                  }

                  style={{
                    backgroundColor: "#2196F3",
                    padding: 12,
                    borderRadius: 8,
                    flex: 1,
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

                  onPress={() => {

                    Alert.alert(
                      "Excluir venda",
                      "Deseja excluir?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: () => {
                            excluirVenda(item.id);
                          }
                        }
                      ]
                    );
                  }}

                  style={{
                    backgroundColor: "red",
                    padding: 12,
                    borderRadius: 8,
                    flex: 1,
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

              {/* WHATSAPP */}

              <TouchableOpacity

                onPress={() =>
                  enviarComprovante(item)
                }

                style={{
                  backgroundColor: "#25D366",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 8,
                }}
              >

                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  📲 ENVIAR WHATSAPP
                </Text>

              </TouchableOpacity>

            </View>

          )}
        />

      </View>

    </ScrollView>
  );
}