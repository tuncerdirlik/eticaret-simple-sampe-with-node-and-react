import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Order = () => {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const getAll = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let response = await axios.get(`http://localhost:5000/orders/${user._id}`);

        setOrders(response.data);
    }

    useEffect(() => {
        getAll();
    }, [])

    return (
        <>
            <div className="container mt-4">
                <div className="card">
                    <div className="card-header">
                        <b>Siparişler</b>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ürün Resmi</th>
                                    <th>Ürün Adı</th>
                                    <th>Ürün Adedi</th>
                                    <th>Ürün Fiyatı</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img alt="test" style={{ width: "70px" }} src={'http://localhost:5000/' + order.products[0].imageUrl} />
                                        </td>
                                        <td>
                                            {order.products[0].name}
                                        </td>
                                        <td>{order.count}</td>
                                        <td>{order.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order;