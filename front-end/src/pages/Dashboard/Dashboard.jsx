import React, { useEffect, useState } from "react";
import { CircleLoader, LineChart, StackedBarChart } from "../../components";
import totalEarningData from "../../data/dummy";
import { fetchData, getAuthHeaders } from "../../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState([]);
  const earningData = totalEarningData();
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data chart pesanan per hari
  const fetchChartOrdersData = async () => {
    const url =
      VITE_VERCEL_ENV === "production"
        ? `https://sales-app-server-zeta.vercel.app/orders/income-chart`
        : `http://localhost:5000/orders/income-chart`;
    try {
      const chartData = await fetchData(url, getAuthHeaders());
      setLineChartData(chartData);
    } catch (error) {
      console.log("Error fetching order chart data:", error.chartData);
    }
  };

  // Mengambil data income pesanan
  const getTotalIncome = async () => {
    const url =
      VITE_VERCEL_ENV === "production"
        ? `https://sales-app-server-zeta.vercel.app/orders/total-income`
        : `http://localhost:5000/orders/total-income`;
    try {
      const data = await fetchData(url, getAuthHeaders());
      setTotalIncome(data.totalIncome);
    } catch (error) {
      console.log("Error fetching income data:", error.totalIncome.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchChartOrdersData(), getTotalIncome()]);
      setIsLoading(false); // Set loading state to false after data is fetched
    };

    fetchData();
  }, []);

  return (
    <div className="mt-12">
      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <CircleLoader color="#4b8b3b" loading={isLoading} size={150} />
        </div>
      ) : (
        <>
          {/* Earnings */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <div className="flex m-3 flex-wrap justify-center gap-5 items-center">
              {earningData.map((item) => (
                <div
                  key={item.title}
                  className="bg-white dark:bg-gray-200 dark:text-gray-700 md:w-40 p-4 pt-9 rounded-2xl"
                >
                  <button
                    style={{
                      color: item.iconColor,
                      backgroundColor: item.iconBg,
                    }}
                    className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                    type="button"
                  >
                    {item.icon}
                  </button>

                  <p className="mt-3">
                    <span className="p-2 text-lg font-semibold">
                      {item.amount}
                    </span>
                  </p>

                  <p className="ml-2 text-sm text-gray-400 mt-1">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Updates */}
          <div className="flex gap-10 flex-wrap justify-center">
            <div className="bg-white dark:bg-gray-200 m-3 p-4 rounded-2xl md:w-780">
              <div className="flex justify-between">
                <p className="p-4 text-2xl font-bold">Revenue Updates</p>
              </div>

              <div className="mt-2 flex gap-5 flex-wrap justify-center">
                <div className="border-r-1 border-color m-4 pr-10">
                  <div>
                    <p>
                      <span className="text-xl font-semibold">
                        {`Rp. ${Number(totalIncome).toLocaleString("id-ID")}`}
                      </span>
                    </p>
                    <p className="text-gray-500 mt-1">Total Income</p>
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
