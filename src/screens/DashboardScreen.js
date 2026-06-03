import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  PieChart,
} from "react-native-chart-kit";

export default function DashboardScreen() {

  const [totalVendas, setTotalVendas] = useState(0);

  const [totalCompras, setTotalCompras] = useState(0);

  const [filtro, setFiltro] = useState("MES");

  // ================================
  // CARREGAR DADOS
  // ================================

  useEffect(() => {

  migrarDadosAntigos();

  carregarDados();

}, [filtro]);

  // ================================
  // FILTRO POR DATA
  // ================================

  function dataDentroFiltro(timestamp) {

  if (!timestamp) return false;

  const hoje = new Date();

  const dataItem =
    new Date(timestamp);

  // HOJE
  if (filtro === "HOJE") {

    return (
      dataItem.getDate() === hoje.getDate()
      &&
      dataItem.getMonth() === hoje.getMonth()
      &&
      dataItem.getFullYear() === hoje.getFullYear()
    );
  }

  // SEMANA
  if (filtro === "SEMANA") {

    const diff =
      hoje - dataItem;

    const seteDias =
      7 * 24 * 60 * 60 * 1000;

    return diff <= seteDias;
  }

  // MÊS
  if (filtro === "MES") {

    return (
      dataItem.getMonth() === hoje.getMonth()
      &&
      dataItem.getFullYear() === hoje.getFullYear()
    );
  }

  // ANO
  if (filtro === "ANO") {

    return (
      dataItem.getFullYear() === hoje.getFullYear()
    );
  }

  return true;
}

  // ================================
  // CARREGAR DADOS
  // ================================


  async function migrarDadosAntigos() {

  // ======================
  // VENDAS
  // ======================

  const vendasSalvas =
    await AsyncStorage.getItem("vendas");

  if (vendasSalvas) {

    const vendas =
      JSON.parse(vendasSalvas);

    const vendasAtualizadas =
      vendas.map((item) => ({

        ...item,

        timestamp:
          item.timestamp || Date.now(),
      }));

    await AsyncStorage.setItem(
      "vendas",
      JSON.stringify(vendasAtualizadas)
    );
  }

  // ======================
  // COMPRAS
  // ======================

  const comprasSalvas =
    await AsyncStorage.getItem("compras");

  if (comprasSalvas) {

    const compras =
      JSON.parse(comprasSalvas);

    const comprasAtualizadas =
      compras.map((item) => ({

        ...item,

        timestamp:
          item.timestamp || Date.now(),
      }));

    await AsyncStorage.setItem(
      "compras",
      JSON.stringify(comprasAtualizadas)
    );
  }
}

  async function carregarDados() {

    const vendasSalvas =
      await AsyncStorage.getItem("vendas");

    const comprasSalvas =
      await AsyncStorage.getItem("compras");

    let totalVenda = 0;

    let totalCompra = 0;

    // =====================
    // VENDAS
    // =====================

    if (vendasSalvas) {

      const vendas =
        JSON.parse(vendasSalvas);

      const vendasFiltradas =
        vendas.filter(item =>
          dataDentroFiltro(item.timestamp)
        );

      vendasFiltradas.forEach(item => {

        totalVenda +=
          Number(item.valor);

      });
    }

    // =====================
    // COMPRAS
    // =====================

    if (comprasSalvas) {

      const compras =
        JSON.parse(comprasSalvas);

      const comprasFiltradas =
        compras.filter(item =>
          dataDentroFiltro(item.timestamp)
        );

      comprasFiltradas.forEach(item => {

        totalCompra +=
          Number(item.valor);

      });
    }

    setTotalVendas(totalVenda);

    setTotalCompras(totalCompra);
  }

  // ================================
  // RESULTADO
  // ================================

  const lucro =
    totalVendas - totalCompras;

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
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 40,
          }}
        >
          📊 Controle Financeiro
        </Text>

        {/* FILTROS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 25 }}
        >

          {["HOJE", "SEMANA", "MES", "ANO"].map(item => (

            <TouchableOpacity

              key={item}

              onPress={() => setFiltro(item)}

              style={{
                backgroundColor:
                  filtro === item
                    ? "#000000"
                    : "#ddd",

                paddingVertical: 10,

                paddingHorizontal: 20,

                borderRadius: 20,

                marginRight: 10,
              }}
            >

              <Text
                style={{
                  color:
                    filtro === item
                      ? "#fff"
                      : "#000",

                  fontWeight: "bold",
                }}
              >
                {item}
              </Text>

            </TouchableOpacity>

          ))}

        </ScrollView>

        {/* CARD VENDAS */}

        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 20,
            marginBottom: 15,
            elevation: 5,
          }}
        >

          <Text
            style={{
              fontSize: 20,
              color: "gray",
            }}
          >
            💰 Total de Vendas
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "green",
              marginTop: 10,
            }}
          >
            R$ {totalVendas
              .toFixed(2)
              .replace(".", ",")}
          </Text>

        </View>

        {/* CARD COMPRAS */}

        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 20,
            marginBottom: 15,
            elevation: 5,
          }}
        >

          <Text
            style={{
              fontSize: 20,
              color: "gray",
            }}
          >
            🛒 Gastos Com Material
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#ff9800",
              marginTop: 10,
            }}
          >
            R$ {totalCompras
              .toFixed(2)
              .replace(".", ",")}
          </Text>

        </View>

        {/* CARD RESULTADO */}

        <View
          style={{
            backgroundColor:
              lucro >= 0
                ? "#e8f5e9"
                : "#ffe5e5",

            padding: 20,

            borderRadius: 20,

            marginBottom: 30,

            elevation: 5,
          }}
        >

          <Text
            style={{
              fontSize: 20,
              color: "gray",
            }}
          >
            📈 Resultado Financeiro
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",

              color:
                lucro >= 0
                  ? "green"
                  : "red",

              marginTop: 10,
            }}
          >
            R$ {lucro
              .toFixed(2)
              .replace(".", ",")}
          </Text>

        </View>

        {/* GRÁFICO */}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          📊 Vendas X Compras
        </Text>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            paddingVertical: 20,
            elevation: 5,
            marginBottom: 30,
          }}
        >

          <PieChart

            data={[

              {
                name: "Vendas",
                population: totalVendas,
                color: "#056408",
                legendFontColor: "#000",
                legendFontSize: 15,
              },

              {
                name: "Compras",
                population: totalCompras,
                color: "#e61313",
                legendFontColor: "#000",
                legendFontSize: 15,
              },

            ]}

            width={
              Dimensions.get("window").width - 20
            }

            height={220}

            chartConfig={{

              backgroundColor: "#fff",

              backgroundGradientFrom: "#fff",

              backgroundGradientTo: "#fff",

              color: (opacity = 1) =>
                `rgba(0, 0, 0, ${opacity})`,
            }}

            accessor={"population"}

            backgroundColor={"transparent"}

            paddingLeft={"15"}

            absolute

          />

        </View>

      </View>

    </ScrollView>
  );
}