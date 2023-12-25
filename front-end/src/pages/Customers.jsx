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
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Customers = () => {
  const { currentColor } = useStateContext();
  const [customersData, setCustomersData] = useState([]);

  // Get all data customer
  const fetchCustomersData = async () => {
    try {
      // Mengambil token dari local storage
      const token = localStorage.getItem("token");

      // Menyiapkan header Authorization dengan menggunakan token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("http://localhost:5000/customers", {
        headers,
      });
      setCustomersData(response.data);
    } catch (error) {
      console.error("Error fetching customers data:", error);
    }
  };

  // Panggil fetchCustomersData dalam useEffect
  useEffect(() => {
    fetchCustomersData();
  }, []);

  // Delete data customer by UUID
  const handleDeleteCustomer = async (customerUUID) => {
    try {
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
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Kirim permintaan DELETE ke endpoint API untuk menghapus pelanggan
        const response = await axios.delete(
          `http://localhost:5000/customers/${customerUUID}`,
          {
            headers,
          }
        );

        if (response.status === 200) {
          // Tampilkan SweetAlert untuk informasi penghapusan berhasil
          Swal.fire({
            title: "Deleted!",
            text: `${response.data.msg}`,
            icon: "success",
          });

          // Perbarui data pelanggan setelah penghapusan berhasil
          fetchCustomersData();
        }
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Customers" />
      <Link to="/addcustomer">
        <button
          type="button"
          className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
          style={{ backgroundColor: currentColor }}
        >
          Add Customers
        </button>
      </Link>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Customer Email</TableCell>
              <TableCell align="center">Customer Phone</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersData.map((customer) => (
              <TableRow
                key={customer.uuid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{customer.name}</TableCell>
                <TableCell align="center">{customer.email}</TableCell>
                <TableCell align="center">{customer.phone}</TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <Link to={`/viewcustomer/${customer.uuid}`}>
                      <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-emerald-500 dark:hover:bg-light-gray text-white bg-emerald-700 rounded-full">
                        <FaEye />
                      </button>
                    </Link>
                    <Link to={`/editcustomer/${customer.uuid}`}>
                      <button className="text-md p-3 mr-2 hover:drop-shadow-md hover:bg-blue-500 dark:hover:bg-light-gray text-white bg-blue-700 rounded-full">
                        <FiEdit />
                      </button>
                    </Link>
                    <button
                      className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 dark:hover:bg-light-gray text-white bg-red-700 rounded-full"
                      onClick={() => handleDeleteCustomer(customer.uuid)}
                    >
                      <MdOutlineDeleteOutline />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
  // return (
  //   <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
  //     {/* Judul */}
  //     <Header category="Page" title="Customers"/>
  //     <GridComponent
  //       dataSource={customersData}
  //       allowPaging={true}
  //       allowSorting={true}
  //       toolbar={['Delete']}
  //       editSettings={{ allowDeleting: true, allowEditing: true }}
  //       width="auto"
  //     >
  //       <ColumnsDirective>
  //         {customersGrid.map((item, index) =>
  //           <ColumnDirective key={index} {...item} />
  //         )}
  //       </ColumnsDirective>
  //       <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]}/>
  //     </GridComponent>
  //   </div>
  // )
};

export default Customers;
