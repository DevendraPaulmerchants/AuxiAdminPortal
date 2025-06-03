import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import style from "./LogIn.module.css";
import style1 from "../MerchantManagement/Merchants.module.css";
import { useContextData } from '../Context/Context';
import { APIPATH } from '../apiPath/apipath';

function LogIn({ handleLogIn }) {
    const { setUserType, setToken } = useContextData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);
    const [isloading, setIsLoading] = useState(false);

    const newUser = {
        email: email,
        password: password,
    }

    const handleLogInData = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/auth/login`, {
            headers: {
                'Authorization': "",
                'Content-Type': "application/json"
            },
            method: "POST",
            body: JSON.stringify(newUser),
            mode:'cors',
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
    return <>
        <div className={style.login_parent}>
            <div className={style.login_container}>
                <div>
                    <h2 className={style.welcome_massage_h2}>Welcome</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleLogInData(); }}>
                    <div className={style.label_and_input_field}>
                        <label>Email:</label>
                        <input type='email' placeholder='Enter user email' required minLength={5} maxLength={50}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={style.label_and_input_field}>
                        <label>Password: </label>
                        <div className={style.login_password_and_icon}>
                            <input type={showPass ? 'text' : 'password'} placeholder='Enter Password' required minLength={8} maxLength={12}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <span onClick={() => setShowPass(!showPass)}>{showPass ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                    </div>
                    <br />
                    <div className={style.signup_button}>
                        {isloading ? <div className={style1.loader_container}><div className={style1.loader_item}>
                            <img src='/gold-coin.png' alt='Gold loading...' />
                        </div></div> :
                            <button>LogIn</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    </>
}

export default LogIn;