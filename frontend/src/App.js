import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Order from "./pages/Order";
import Basket from "./pages/Basket";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route path="products" element={<Product />}></Route>
            <Route path="orders" element={<Order />}></Route>
            <Route path="baskets" element={<Basket />}></Route>
          </Route>

          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
