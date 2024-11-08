import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Header } from "../components";

const ViewCustomer = () => {
  const [customerData, setCustomerData] = useState([]);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/customers/${uuid}`,
          { headers }
        );

        // Inisialisasi customerData dengan data dari server
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    // Memanggil fungsi fetchCustomerData saat komponen dimuat
    fetchCustomerData();
  }, [uuid]);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="View Customer" />
      {/* Card */}
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Customer Name
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {customerData.name}
                    </p>
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Customer Phone
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {customerData.phone}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <Link to="/customers">
              <button
                type="button"
                className="mt-4 ml-4 hover:drop-shadow-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
              >
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
