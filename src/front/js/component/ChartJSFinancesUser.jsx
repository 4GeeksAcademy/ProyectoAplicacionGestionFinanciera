// src/components/BarChart.js
import React from 'react';
import { Line } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, Filler, PointElement } from "chart.js";

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement
);

export function ChartJSFinancesUser() {
  const [chartData, setChartData] = useState({ labels: [], incomes: [], expenses: [] });
  const { store } = useContext(Context);

  useEffect(() => {
    const getFinance = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL || "http://localhost:3001/"}api/finances2/2`
        );
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();

        // Agrupamos datos por fecha
        const groupedData = data.reduce((acc, item) => {
          const formattedDate = new Date(item.date).toISOString().split("T")[0];

          if (!acc[formattedDate]) {
            acc[formattedDate] = { incomes: 0, expenses: 0 };
          }

          if (item.id_category === 1) {
            acc[formattedDate].expenses += item.amount;
          } else if (item.id_category === 2) {
            acc[formattedDate].incomes += item.amount;
          }

          return acc;
        }, {});

        // fechas en orden cronológico
        const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));

        // Convertimos el objeto agrupado en arrays para el gráfico
        const labels = sortedDates.map((date) =>
          new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
        const incomes = sortedDates.map((date) => groupedData[date].incomes);
        const expenses = sortedDates.map((date) => groupedData[date].expenses);

        setChartData({ labels, incomes, expenses });
      } catch (err) {
        console.error("Error fetching finances:", err);
        setError(err.message || "Hubo un error al obtener los datos financieros.");
      }
    };

    getFinance();
  }, [store.userData.id]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Gastos",
        data: chartData.expenses,
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Color con transparencia
        borderColor: "rgba(255, 99, 132, 1)", // Color del borde
        borderWidth: 1,
        fill: true, // Esto asegura que el área debajo de la línea esté rellena
      },
      {
        label: "Ingresos",
        data: chartData.incomes,
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Color con transparencia
        borderColor: "rgba(54, 162, 235, 1)", // Color del borde
        borderWidth: 1,
        fill: true, // Esto asegura que el área debajo de la línea esté rellena
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      filler: {
        propagate: false,
      },
      title: {
        display: true,
        text: "Ingresos y Gastos Diarios",
      },
    },
    pointBackgroundColor: "#fff",
    radius: 10,
    interaction: {
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4, // Aquí se aplica el suavizado de la línea (0 para sin suavizado)
      },
    },
  };

  return <Line data={data} options={options} />;
}
