import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const register = async (e) => {
        e.preventDefault();

        let model = {
            email: email,
            name: name,
            password: password
        }

        try {

            const response = await axios.post("http://localhost:5000/auth/register", model);

            localStorage.setItem("token", response.data.token);
            const { password, ...userWithoutPassword } = response.data.user;
            localStorage.setItem("user", JSON.stringify(userWithoutPassword));

            navigate("/");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center" style={{ marginTop: "70px" }}>
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">
                            <h3>Kayıt Sayfası</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={register}>
                                <div className="form-group">
                                    <label htmlFor="email">Mail Adresi</label>
                                    <input type="email" id="email" name="email" className="form-control" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Kullanıcı Adı</label>
                                    <input type="text" id="name" name="name" className="form-control" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="password">Şifre</label>
                                    <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group mt-2">
                                    <button className="btn btn-success w-100">Kayıt Ol</button>
                                    <Link to="/login" className="mt-2" style={{ float: "right" }}>Giriş Sayfasına Git</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Register;