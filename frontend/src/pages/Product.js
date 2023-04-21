import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Product = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        async function fetchData() {
            await getAll();
        }
        fetchData();
    }, []);

    const getAll = async () => {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
    }

    const removeProduct = async (id) => {

        if (window.confirm("ürün silinecektir, emin misiniz?")) {
            let model = { id: id };
            const response = await axios.delete("http://localhost:5000/products", { data: model });

            alert(response.data.message);
            await getAll();
        }
    }

    const addProduct = async (e) => {
        e.preventDefault();

        var fileInput = document.getElementById('image');

        const formData = new FormData();
        formData.append("name", name);
        formData.append("categoryName", categoryName);
        formData.append("stock", stock);
        formData.append("price", price);
        formData.append("image", fileInput.files[0], fileInput.files[0].name);

        var response = await axios.post("http://localhost:5000/products", formData);
        alert(response.data.message);

        setName("");
        setCategoryName("");
        setStock("");
        setPrice("");
        fileInput.value = null;

        document.getElementById("addModalClose").click();

        await getAll();
    }


    const checkIsAdmin = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (!user.isAdmin) {
            navigate("/");
        }
    }

    checkIsAdmin();

    return (
        <>
            <div className="container mt-4">
                <div className="card">
                    <div className="card-header">
                        <h1>Ürün Listesi</h1>
                    </div>
                    <div className="card-body">
                        <div className="form-group">

                            <div>
                                <button className="btn btn-outline-primary mb-3" data-bs-toggle="modal" data-bs-target="#addModal">Ekle</button>
                            </div>

                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Resim</th>
                                        <th>Ürün Adı</th>
                                        <th>Kategori Adı</th>
                                        <th>Adet</th>
                                        <th>Fiyatı</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index + 1}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                <img alt="test" style={{ width: "70px" }} src={'http://localhost:5000/' + product.imageUrl} />
                                            </td>
                                            <td>
                                                {product.name}
                                            </td>
                                            <td>
                                                {product.categoryName}
                                            </td>
                                            <td>
                                                {product.stock}
                                            </td>
                                            <td>
                                                {product.price}
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => removeProduct(product._id)}>Sil</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addModalLabel">Yeni Ürün Ekle</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="addModalClose"></button>
                        </div>
                        <form onSubmit={addProduct}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="name">Ürün Adı</label>
                                    <input className="form-control" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Kategori Adı</label>
                                    <select className="form-control" id="categoryName" name="categoryName" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
                                        <option value="">Seçiniz</option>
                                        <option value="Sebze">Sebze</option>
                                        <option value="Meyve">Meyve</option>
                                        <option value="Teknoloji">Teknoloji</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Stok Adedi</label>
                                    <input className="form-control" id="stock" name="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Fiyat</label>
                                    <input className="form-control" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name"></label>
                                    <input className="form-control" type="file" id="image" name="image" />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                                <button type="submit" className="btn btn-primary">Ürün Ekle</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Product;