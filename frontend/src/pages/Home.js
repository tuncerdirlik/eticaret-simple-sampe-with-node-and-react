import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {

    const [products, setProducts] = useState([]);

    const getAll = async () => {
        var response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
    }

    const addBasket = async (productId, count, price) => {
        let user = JSON.parse(localStorage.getItem("user"));
        let basket = {
            productId: productId,
            userId: user._id,
            count: count,
            price: price
        }

        var response = await axios.post("http://localhost:5000/baskets", basket);
        alert(response.data.message);
    }

    useEffect(() => {
        getAll();
    }, [])

    return (
        <>
            <div className="container">
                <div className="row">
                    {
                        products.map((product, index) => {
                            return (
                                <div className="col-md-3 mt-2" key={index}>
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="w-100 text-center">
                                                {product.name}
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <img alt="test" style={{ width: "225px" }} src={'http://localhost:5000/' + product.imageUrl} />
                                            <h4 className="text-center alert alert-info">
                                                Adet: {product.stock}
                                            </h4>
                                            <h4 className="text-center text-danger">
                                                Fiyat: {product.price}
                                            </h4>
                                            <button className="btn btn-outline-success w-100" onClick={() => addBasket(product._id, 1, product.price)}>
                                                Sepete Ekle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Home;