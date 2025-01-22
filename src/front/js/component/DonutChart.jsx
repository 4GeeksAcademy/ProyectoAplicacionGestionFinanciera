import React, { useContext, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Context } from "../store/appContext";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart () {
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState([]);
  const [total, setTotal] = useState(0);
  const { store } = useContext(Context);

  // Datos de ejemplo (cuando no se obtienen de la API)
  const exampleData = [
    { category_name: "Ocio", amount: 200 },
    { category_name: "Transporte", amount: 150 },
    { category_name: "Comida", amount: 300 },
    { category_name: "Vivienda", amount: 450 },
    { category_name: "Otros", amount: 100 }
  ];

  useEffect(() => {
    const getFinanceData = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL || "http://localhost:3001/"}api/finances2/2`
        );
        const data = await exampleData;  
        // jugar con este (exampleData/response.json() )

        // Si no tenemos datos de la API, usamos los datos de ejemplo
        const finalData = data.length ? data : exampleData;

        // Procesar los datos para obtener categorías y valores
        const categoriesData = [...new Set(finalData.map(item => item.category_name))];
        const valuesData = categoriesData.map(category =>
          finalData
            .filter(item => item.category_name === category)
            .reduce((sum, item) => sum + item.amount, 0)
        );

        setCategories(categoriesData);
        setValues(valuesData);
        setTotal(valuesData.reduce((sum, val) => sum + val, 0)); 
      } catch (error) {
        console.log("Error getting finance data", error);
      }
    };

    getFinanceData();
  }, [store.userData.id]);

  const backgroundColors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#FF33A8"];

  const categoryIcons = {
    "Ocio": "fas fa-sun", 
    "Transporte": "fas fa-car", 
    "Comida": "fas fa-utensils", 
    "Vivienda": "fas fa-home", 
    "Otros": "fas fa-gift" 
  };

  const data = {
    labels: categories, 
    datasets: [
      {
        label: "Gastos",
        data: values, 
        backgroundColor: backgroundColors.slice(0, categories.length), 
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Card con la gráfica */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-3 mb-4 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title text-center">Distribución de Gastos</h5>
              {/* Gráfico */}
              <div className="d-flex justify-content-center">
                <Doughnut data={data} />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de categorías con iconos y euro */}
        <div className="col-12 col-md-6 mt-4 mt-md-0">
          <div className="card shadow-sm p-3 mb-4 bg-white rounded">
            <div className="card-body">
              <h5 className="card-title">Gastos por Categoría</h5>
              <ul className="list-unstyled">
                {categories.map((category, index) => (
                  <li key={index} className="d-flex align-items-center mb-2">
                    <i
                      className={`${categoryIcons[category]} mr-2`}
                      style={{ fontSize: "20px", color: backgroundColors[index] }}
                    ></i>
                    {category}: €{values[index]}
                  </li>
                ))}
              </ul>
              {/* Total de gastos */}
              <h6 className="text-right">Total de Gastos: €{total}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};