import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Orders,
  Officers,
  Customers,
  Products,
  Login,
  AddProduct,
  AddOrder,
  AddCustomer,
  AddOfficer,
  ViewOfficer,
  EditOfficer,
  EditProduct,
  ViewProduct,
  ViewOrder,
} from "./pages";
import Master from "./layout/Master";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./pages/PageNotFound";
import { PrivateRoute } from "./components";
import { ActivityLog } from "./log";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<PrivateRoute redirectPath="/" />}>
          <Route
            index
            element={
              <Master>
                <Dashboard />
              </Master>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={<PrivateRoute redirectPath="/dashboard" />}
        >
          <Route
            index
            element={
              <Master>
                <Dashboard />
              </Master>
            }
          />
        </Route>

        {/* Pages */}
        <Route path="/orders" element={<PrivateRoute redirectPath="/orders" />}>
          <Route
            index
            element={
              <Master>
                <Orders />
              </Master>
            }
          />
        </Route>
        <Route
          path="/addorder"
          element={<PrivateRoute redirectPath="/addorder" />}
        >
          <Route
            index
            element={
              <Master>
                <AddOrder />
              </Master>
            }
          />
        </Route>
        <Route
          path="/vieworder/:uuid"
          element={
            <Master>
              <ViewOrder />
            </Master>
          }
        />

        <Route
          path="/products"
          element={<PrivateRoute redirectPath="/products" />}
        >
          <Route
            index
            element={
              <Master>
                <Products />
              </Master>
            }
          />
        </Route>
        <Route
          path="/addproduct"
          element={<PrivateRoute redirectPath="/addproduct" />}
        >
          <Route
            index
            element={
              <Master>
                <AddProduct />
              </Master>
            }
          />
        </Route>
        <Route
          path="/editproduct/:uuid"
          element={
            <Master>
              <EditProduct />
            </Master>
          }
        />
        <Route
          path="/viewproduct/:uuid"
          element={
            <Master>
              <ViewProduct />
            </Master>
          }
        />

        <Route
          path="/officers"
          element={<PrivateRoute redirectPath="/officers" />}
        >
          <Route
            index
            element={
              <Master>
                <Officers />
              </Master>
            }
          />
        </Route>
        <Route
          path="/addofficer"
          element={<PrivateRoute redirectPath="/addofficer" />}
        >
          <Route
            index
            element={
              <Master>
                <AddOfficer />
              </Master>
            }
          />
        </Route>
        <Route
          path="/editofficer/:uuid"
          element={
            <Master>
              <EditOfficer />
            </Master>
          }
        />
        <Route
          path="/viewofficer/:uuid"
          element={
            <Master>
              <ViewOfficer />
            </Master>
          }
        />

        <Route
          path="/customers"
          element={<PrivateRoute redirectPath="/customers" />}
        >
          <Route
            index
            element={
              <Master>
                <Customers />
              </Master>
            }
          />
        </Route>
        <Route
          path="/addcustomer"
          element={<PrivateRoute redirectPath="/addcustomer" />}
        >
          <Route
            index
            element={
              <Master>
                <AddCustomer />
              </Master>
            }
          />
        </Route>

        {/* Logs */}
        <Route
          path="/activitylog"
          element={<PrivateRoute redirectPath="/activitylog" />}
        >
          <Route
            index
            element={
              <Master>
                <ActivityLog />
              </Master>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
