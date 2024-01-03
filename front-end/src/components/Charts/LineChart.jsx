import React, { useState } from "react";
import ChartJS from "chart.js/auto";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const LineChart = ({ data, title, label, height, width }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <div className="chart-container">
      <Line
        data={{
          labels: data.map((v) => v.x),
          datasets: [
            {
              label,
              data: data.map((v) => v.y),
              backgroundColor: ["#beb9db"],
              fill: false,
              tension: 0.4,
              pointRadius: 5,
              borderColor: "#114250",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            animation: {
              duration: 1000, // durasi animasi dalam milidetik
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
                lineHeight: 1.5,
              }, // Ubah sesuai kebutuhan
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
        height={height}
        width={width}
      />
    </div>
  );
};

export default LineChart;
