import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useStateContext } from "../contexts/ContextProvider";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CircleLoader from "../components/CircleLoader";
import { deleteData, fetchData, getAuthHeaders } from "../helpers/helpers";
const { VITE_VERCEL_ENV } = import.meta.env;

const Officers = () => {
  const { currentColor } = useStateContext();
  const [officersData, setOfficersData] = useState([]);
  const [loginOfficerData, setLoginOfficerData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch officers data
  const fetchOfficersData = async () => {
    setIsLoading(true);
    const url =
      VITE_VERCEL_ENV === "production"
        ? "https://sales-app-server-zeta.vercel.app/officers"
        : "http://localhost:5000/officers";
    try {
      const data = await fetchData(url, getAuthHeaders());
      setOfficersData(data);
    } catch (error) {
      console.error("Error fetching officers data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logged-in officer data
  const fetchLoginOfficerData = async () => {
    const url =
      VITE_VERCEL_ENV === "production"
        ? "https://sales-app-server-zeta.vercel.app/me"
        : "http://localhost:5000/me";

    try {
      const data = await fetchData(url, getAuthHeaders());
      setLoginOfficerData(data);
    } catch (error) {
      console.error("Error fetching login officer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete officer by UUID
  const handleDeleteOfficer = async (officerUUID) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const url =
        VITE_VERCEL_ENV === "production"
          ? `https://sales-app-server-zeta.vercel.app/officers/${officerUUID}`
          : `http://localhost:5000/officers/${officerUUID}`;

      try {
        const response = await deleteData(url, getAuthHeaders());
        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: `${response.data.msg}`,
            icon: "success",
          });
          fetchOfficersData(); // Refresh the officer list after delete
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Error deleting officer");
      }
    }
  };

  // Call the functions when the component mounts
  useEffect(() => {
    fetchOfficersData();
    fetchLoginOfficerData();
  }, []);

  // Filter out `superadmin` roles if the logged-in user is `superadmin`
  const filteredData = officersData.filter((officer) => {
    if (loginOfficerData.roles === "superadmin") {
      return officer.roles !== "superadmin";
    }
    return true;
  });

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-gray-200">
      <Header category="Page" title="Officers" />
      <Link to="/addofficer">
        <button
          type="button"
          className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
          style={{ backgroundColor: currentColor }}
        >
          Add Officer
        </button>
      </Link>
      <TableContainer component={Paper}>
        {isLoading ? (
          <CircleLoader />
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#F5F5F5" }}>
              <TableRow>
                <TableCell align="center">Officer Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Roles</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((officer) => (
                  <TableRow
                    key={officer.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{officer.name}</TableCell>
                    <TableCell align="center">{officer.email}</TableCell>
                    <TableCell align="center">{officer.roles}</TableCell>
                    <TableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/viewofficer/${officer.uuid}`}>
                          <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-emerald-500 text-white bg-emerald-700 rounded-full">
                            <FaEye />
                          </button>
                        </Link>
                        <Link to={`/editofficer/${officer.uuid}`}>
                          <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-blue-500 text-white bg-blue-700 rounded-full">
                            <FiEdit />
                          </button>
                        </Link>
                        <button
                          className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 text-white bg-red-700 rounded-full"
                          onClick={() => handleDeleteOfficer(officer.uuid)}
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default Officers;
