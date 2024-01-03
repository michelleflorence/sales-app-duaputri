import React, { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Stacked, LineChart, StackedBarChart } from "../components";
import { earningData, SparklineAreaData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const [lineChartData, setLineChartData] = useState([]);

  const fetchChartOrdersData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const chartData = await axios.get(
        `http://localhost:5000/orders/income-chart`,
        {
          headers,
        }
      );
      // console.log(chartData.data);
      setLineChartData(chartData.data);
    } catch (error) {
      console.log("Error fetching order chart data:", error.chartData.message);
    }
  };

  useEffect(() => {
    fetchChartOrdersData();
  }, []);

  return (
    <div className="mt-12">
      {/* Earnings */}
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="flex m-3 flex-wrap justify-center gap-2 items-center">
          {earningData.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-200 dark:text-gray-700 md:w-56 p-4 pt-9 rounded-2xl"
            >
              <button
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                type="button"
              >
                {item.icon}
              </button>

              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>

                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>

              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Updates */}
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:bg-gray-200 m-3 p-4 rounded-2xl md:w-780">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
          </div>

          <div className="mt-6 flex gap-5 flex-wrap justify-center">
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">$93,438</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Income</p>
              </div>

              <div className="mt-10 ml-auto mr-auto">
                <LineChart
                  data={lineChartData}
                  label="Income"
                  title="Income Per Day"
                  height={200}
                  width={300}
                />
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="mt-4 ml-auto mr-auto">
              <StackedBarChart
                title="Revenue Breakdown by Payment Method"
                height={320}
                width={300}
              />
              {/* <Stacked width="320px" height="360px" /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
