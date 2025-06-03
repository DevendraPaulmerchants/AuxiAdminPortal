import style from "./NewLogIn.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { useContextData } from "../Context/Context";
import { useState } from "react";
import { APIPATH } from "../apiPath/apipath";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";


const NewLogIn = ({ handleLogIn }) => {
    const { setUserType, setToken } = useContextData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const newUser = {
        email: email,
        password: password,
    }

    const handleLogInData = (e) => {
        e.preventDefault()
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/auth/login`, {
            headers: {
                'Authorization': "",
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify(newUser),
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setToken(data?.data?.access?.token);
                if (data.statusCode === 401) {
                    alert(data.message);
                    return;
                }
                handleLogIn();
            })
            .catch((err) => {
                console.error(err);
                alert(err);
                return;
            })
            .finally(() => {
                setIsLoading(false)
            })

    }

    return (
        <div className={style.login_container}>
            <div className={style.login_left_side}>
                <img src="./LogInLeftImage.png" alt="Logo" />
            </div>
            <div className={style.login_rigth_side}>
                <div className={style.form_conatainer}>
                    <h1>Welcome to AuXiVault! </h1>
                    <p>Please Log-in to your account</p>
                    <form onSubmit={(e) => { handleLogInData(e) }}>
                    <div  className={style.label_and_input_field}>
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                        <div  className={style.label_and_input_field}>
                            <input
                                type= {!showPass ? "password": 'text'}
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <span onClick={() => setShowPass(!showPass)}>{showPass ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                        {/* {IsPass && ( */}
                        <div className={style.remember_me_and_forgot_password}>
                            <p className={style.remember_me}>
                                <input type="checkbox" />
                                <span>Remember Me</span>
                            </p>
                            <p className={style.forgot_password} onClick={() => navigate("/forgot-password")}>
                                Forgot Password?
                            </p>
                        </div>
                        {/* )} */}
                        <button type="submit" disabled={isloading}>
                            {isloading ? <div className={style1.loader_container}><div className={style1.loader_item}>
                                <img src='/gold-coin.png' alt='Gold loading...' />
                            </div></div> : "Log In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewLogIn;
