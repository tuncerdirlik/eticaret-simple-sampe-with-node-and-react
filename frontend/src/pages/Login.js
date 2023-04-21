import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        let model = {
            email: email,
            password: password
        }

        console.log(model);

        try {

            let response = await axios.post("http://localhost:5000/auth/login", model);

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
                            <h3>Giriş Sayfası</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={login}>
                                <div className="form-group">
                                    <label htmlFor="email">Mail Adresi</label>
                                    <input type="email" id="email" name="email" className="form-control" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="password">Şifre</label>
                                    <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group mt-2">
                                    <button className="btn btn-primary w-100">Giriş Yap</button>
                                    <Link to="/register" className="mt-2" style={{ float: "right" }}>Kayıt Sayfasına Git</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Login;