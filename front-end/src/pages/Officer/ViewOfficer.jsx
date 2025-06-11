import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Button, Header } from "../../components";
const { VITE_VERCEL_ENV } = import.meta.env;

const ViewOfficer = () => {
  const [officerData, setOfficerData] = useState([]);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          VITE_VERCEL_ENV === "production"
            ? `https://sales-app-server-zeta.vercel.app/officers/${uuid}`
            : `http://localhost:5000/officers/${uuid}`,
          { headers }
        );

        // Inisialisasi officerData dengan data dari server
        setOfficerData(response.data);
      } catch (error) {
        console.error("Error fetching officer data:", error);
      }
    };

    // Memanggil fungsi fetchOfficerData saat komponen dimuat
    fetchOfficerData();
  }, [uuid]);

  return (
    <div className="pt-[60px] md:pt-0">
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
        <Header category="Page" title="View Officer" />
        {/* Card */}
        <div className="flex items-center justify-center h-full">
          <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-base font-bold text-gray-900 truncate">
                        Officer Name
                      </p>
                      <p className="text-base text-gray-600 truncate">
                        {officerData.name}
                      </p>
                    </div>
                  </div>
                </li>
                {/* <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-base font-bold text-gray-900 truncate">
                      Officer Email
                    </p>
                    <p className="text-base text-gray-600 truncate">
                      {officerData.email}
                    </p>
                  </div>
                </div>
              </li> */}
                <li className="py-3 sm:py-4">
                  <div className="flex items-center ">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-base font-bold text-gray-900 truncate">
                        Officer Roles
                      </p>
                      <p className="text-base text-gray-600 truncate">
                        {officerData.roles}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <Link to="/officers">
                <Button
                  type="button"
                  bgColor="rgb(209 213 219)"
                  borderRadius="10px"
                >
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOfficer;
