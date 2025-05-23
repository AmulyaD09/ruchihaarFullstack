import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const endpoint = currState === "Login" 
                ? "/api/user/login" 
                : "/api/user/register"
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}${endpoint}`, 
                data
            )

            if (response.data.success) {
                const token = response.data.token
                setToken(token)
                localStorage.setItem("token", token)
                await loadCartData({ token })
                setShowLogin(false)
                toast.success(`Welcome ${currState === "Sign Up" ? data.name : "back"}!`)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during login")
            console.error("Login error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name="name"
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />
                    <input
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : (currState === "Login" ? "Login" : "Create account")}
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>

                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup