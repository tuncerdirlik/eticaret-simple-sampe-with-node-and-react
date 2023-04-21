import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Basket = () => {

    const navigate = useNavigate();
    const [baskets, setBaskets] = useState([]);

    const getAll = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let response = await axios.get(`http://localhost:5000/baskets/${user._id}`);

        setBaskets(response.data);
        calculateTotalPrice();
    }

    const remove = async (id) => {
        if (window.confirm("ürün sepetten silinecektir, emin misiniz?")) {
            await axios.delete(`http://localhost:5000/baskets/${id}`);
            await getAll();
        }
    }

    const createOrder = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let model = {
            userId: user._id
        }

        var response = await axios.post("http://localhost:5000/orders", model)
            .then((response) => {
                if (response.status === 201) {
                    alert("sipariş oluşturuldu");
                    navigate("/orders");
                }
            });
        console.log(response);
    }

    const calculateTotalPrice = () => {
        let total = 0;
        baskets.forEach(item => {
            total += item.price;
        })

        return total;
    }

    useEffect(() => {
        getAll();
    }, [])

    return (
        <>
            <div className="container mt-4">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Sepet</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-8">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Ürün Resmi</th>
                                            <th>Ürün Adı</th>
                                            <th>Ürün Adedi</th>
                                            <th>Ürün Fiyatı</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {baskets.map((basket, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <img alt="test" style={{ width: "70px" }} src={'http://localhost:5000/' + basket.products[0].imageUrl} />
                                                </td>
                                                <td>
                                                    {basket.products[0].name}
                                                </td>
                                                <td>{basket.count}</td>
                                                <td>{basket.price}</td>
                                                <td>
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => remove(basket._id)}>
                                                        Sil
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header">
                                        <b>Sepet Toplamı</b>
                                    </div>
                                    <div className="card-body">
                                        <ul>
                                            <li>Toplam Ürün Sayısı : {baskets.length}</li>
                                            <li>Toplam Tutar : {calculateTotalPrice()}</li>
                                        </ul>
                                        <button className="btn btn-primary w-100" onClick={() => createOrder()}>Ödeme Yap</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Basket;