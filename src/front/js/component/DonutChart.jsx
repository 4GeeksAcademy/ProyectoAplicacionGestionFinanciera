import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/DonutChart.css";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart() {
  const [types, setTypes] = useState([]);
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  });

  useEffect(() => {
    const getFinanceData = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL || "http://localhost:3001/"}api/get_finances_all/${user.id}`
        );
        const data = await response.json();

        // Filtrar datos nulos o vacíos
        const filteredData = data.filter(item => item.type !== null && item.type !== "");

        // Agrupar por tipo de finanza y calcular los totales
        const groupedData = filteredData.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + item.amount;
          return acc;
        }, {});

        // Crear arrays separados para categorías y valores
        const types = Object.keys(groupedData);
        const amounts = Object.values(groupedData);

        // Actualizar estados
        setTypes(types);
        setValues(amounts);
        setTotal(amounts.reduce((sum, val) => sum + val, 0));
      } catch (error) {
        console.log("Error getting finance data", error);
      }
    };

    getFinanceData();
  }, [user.id]);

  const backgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(102, 255, 153, 0.2)"];

  const borderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(102, 255, 153, 1)"
  ];

  const typeIcons = {
    "Ocio": "fas fa-sun",
    "Transporte": "fas fa-car",
    "Comida": "fas fa-utensils",
    "Vivienda": "fas fa-home",
    "Otros": "fas fa-gift"
  };

  const data = {
    labels: types,
    datasets: [
      {
        label: "Gastos",
        data: values,
        backgroundColor: backgroundColors.slice(0, types.length),
        borderColor: borderColors.slice(0, types.length),
        borderWidth: 1,
      },
    ],
  };

  /* const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = context.label;
            const value = context.raw;
            return `${category}: €${value}`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#ffffff",
        backgroundColor: "#ff0",
        hoverBorderColor: "#fff",
        hoverBorderWidth: 3,
        backgroundColor: backgroundColors.slice(0, categories.length),
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  }; */

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Card con la gráfica */}
        <div className="expense-distribution col-12 col-md-6">
          <div className="card expense-distribution-card shadow-sm p-3 mb-4 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title text-center">Expense Distribution</h5>
              {/* Gráfico */}
              <div className="d-flex justify-content-center">
                <Doughnut data={data} />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de tipos con iconos y euro */}
        <div className="expenses-by-type col-12 col-md-6 mt-4 mt-md-0">
          <div className="card expenses-by-type-card  shadow-sm p-3 mb-4 pb-4 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title">Expenses By Type</h5>
              <ul className="list-unstyled">
                {types.map((type, index) => (
                  <li key={index} className="d-flex align-items-center mb-2">
                    <i
                      className={`${typeIcons[type]} mr-2`}
                      style={{ fontSize: "20px", color: borderColors[index] }}
                    ></i>
                    {type}: {values[index]} $
                  </li>
                ))}
              </ul>
              {/* Total de gastos */}
              <h6 className="text-right">Total Expenses: {total} $</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};