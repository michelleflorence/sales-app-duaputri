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
              backgroundColor: [
                "rgba(75,192,192,1)",
                "&quot;#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              fill: false,
              tension: 0.4,
              pointRadius: 5,
              borderColor: "#114250",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: title,
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
