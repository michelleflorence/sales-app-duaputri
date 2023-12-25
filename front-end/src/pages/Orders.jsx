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

const Orders = () => {
  const { currentColor } = useStateContext();
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        // Mengambil token dari local storage
        const token = localStorage.getItem("token");

        // Menyiapkan header Authorization dengan menggunakan token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get("http://localhost:5000/orders", {
          headers,
        }); // Replace 'your_api_endpoint' with the actual API endpoint
        setOrdersData(response.data);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />
      <Link to="/addorder">
        <button
          type="button"
          className="hover:drop-shadow-xl hover:bg-light-gray text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
          style={{ backgroundColor: currentColor }}
        >
          Add Orders
        </button>
      </Link>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="simple table">
          <TableHead style={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              {/* <TableCell align="center">Order ID</TableCell> */}
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Customer Phone</TableCell>
              <TableCell align="center">Order Number</TableCell>
              <TableCell align="center">Items</TableCell>
              <TableCell align="center">Total Price</TableCell>
              <TableCell align="center">Payment Type</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersData.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell align="center" component="th" scope="row">
                {order.id}
              </TableCell> */}
                <TableCell align="center">{order.customer.name}</TableCell>
                <TableCell align="center">{order.customer.phone}</TableCell>
                <TableCell align="center">{order.orderNumber}</TableCell>
                <TableCell align="center">
                  {order.order_details?.map((order_details, index) => (
                    <div key={index}>
                      {order_details.product?.productName}
                      {index < order.order_details.length - 1 && ","}{" "}
                      {/* Tambahkan koma jika bukan elemen terakhir */}
                    </div>
                  ))}
                </TableCell>
                <TableCell align="center">{order.totalPrice}</TableCell>
                <TableCell align="center">
                  {order.invoice.paymentType}
                </TableCell>
                <TableCell align="center">
                  {order.status === 0
                    ? "Created"
                    : order.status === 1
                    ? "Ongoing"
                    : "Finished"}
                </TableCell>
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="text-md p-3 hover:drop-shadow-md hover:bg-blue-500 dark:hover:bg-light-gray text-white bg-blue-700 rounded-full">
                      <FiEdit />
                    </button>
                    <button className="text-md p-3 hover:drop-shadow-md hover:bg-red-500 dark:hover:bg-light-gray text-white bg-red-700 rounded-full">
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

  // const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  // const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true };
  // const [ordersData, setOrdersData] = useState([]);

  // useEffect(() => {
  //   const fetchOrdersData = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/orders'); // Replace 'your_api_endpoint' with the actual API endpoint
  //       setOrdersData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching orders data:', error);
  //     }
  //   };

  //   fetchOrdersData();
  // }, [ordersData]);

  // return (
  //   <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
  //     <Header category="Page" title="Orders"/>
  //     <GridComponent
  //       editSettings={editOptions}
  //       id='gridComp'
  //       dataSource={ordersData}
  //       allowPaging={true}
  //       allowSorting={true}
  //       toolbar={toolbarOptions}
  //     >
  //       <ColumnsDirective>
  //         {ordersGrid.map((item, index) =>
  //           <ColumnDirective key={index} {...item} />
  //         )}
  //       </ColumnsDirective>
  //       <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Toolbar]}/>
  //     </GridComponent>
  //   </div>
  // )
};

export default Orders;
