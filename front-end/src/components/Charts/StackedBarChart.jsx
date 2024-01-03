import React, { useEffect, useState } from "react";
import ChartJS from "chart.js/auto";
import { Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const StackedBarChart = ({ title, width, height }) => {
  ChartJS.register(Title, Tooltip, Legend);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const paymentChart = await axios.get(
          "http://localhost:5000/orders/payment-chart",
          { headers }
        );

        // Extracting data from the API paymentChart
        const data = paymentChart.data;
        console.log(data);

        // Transforming data to match the Chart.js format for stacked bar chart
        const transformedData = {
          labels: data.map((item) => item.x),
          datasets: [
            {
              label: "QRIS",
              data: data.map((item) => (item.x === "QRIS" ? item.y : 0)),
              backgroundColor: "#fd7f6f",
              hoverBackgroundColor: "#ff9980",
              borderWidth: 0,
              barPercentage: 0.8,
              categoryPercentage: 0.8,
            },
            {
              label: "Transfer",
              data: data.map((item) => (item.x === "Transfer" ? item.y : 0)),
              backgroundColor: "#7eb0d5",
              hoverBackgroundColor: "#aacce6",
              borderWidth: 0,
              barPercentage: 0.8,
              categoryPercentage: 0.8,
            },
            {
              label: "Cash",
              data: data.map((item) => (item.x === "Cash" ? item.y : 0)),
              backgroundColor: "rgba(75,192,192,1)",
              hoverBackgroundColor: "rgba(100,215,215,1)",
              borderWidth: 0,
              barPercentage: 0.8,
              categoryPercentage: 0.8,
            },
          ],
        };

        setChartData(transformedData);
      } catch (error) {
        console.log("Error fetching data:", error.paymentChart.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure useEffect runs only once

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            animation: {
              duration: 1000, // durasi animasi dalam milidetik
            },
            tooltip: {
              enabled: true,
            },
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: title,
              font: {
                size: 14,
                family: "Open Sans, sans-serif",
                weight: 700,
                lineHeight: 3,
              }, // Ubah sesuai kebutuhan
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
        width={width}
        height={height}
      />
    </div>
  );
};

export default StackedBarChart;
