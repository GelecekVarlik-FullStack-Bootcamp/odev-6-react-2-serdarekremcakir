import React from 'react';
import './LoginRegister.css';
import  {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function LoginRegister() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordconfirm] = useState('');
    const [formName, setFormname] = useState('Login')

    const navigate = useNavigate();

    const LoginSubmit = (e) => {
    
        e.preventDefault();

        const user = {
            "username":name,
            "password":password
        }
  
        axios.post(`http://localhost:80/auth/login`, user,{withCredentials: true}).then(res => {

            navigate("/Main")
            

          }).catch((error) => alert("Incorrect username or password"),
          setName(''),setPassword('')
          )

    }
    const RegisterSubmit = (e) => {
    
        e.preventDefault();

        const user = {
            "username":name,
            "password":password,
            "passwordConfirm":passwordConfirm
        }
  
        axios.post(`http://localhost:80/auth/register`, user,{withCredentials: true}).then(res => {

            
            navigate("/Main")
        

          }).catch((error) => alert("Incorrect username or password"),
          setName(''),setPassword(''),setPasswordconfirm('')
          )

    }


    
    



  return (
    
    <div className="background">

    {formName === 'Login' ? <>
    <form className='loginform' onSubmit = {LoginSubmit}>
        <h3>Login Here</h3>

        <label className='loginlabel' htmlFor="username">Username</label>
        <input className='logininput' type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>

        <label className='loginlabel' htmlFor="password">Password</label>
        <input className='logininput' type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>

        <button className='loginbutton' type="submit">Log In</button>
        
    </form>
    <div className='signup'>
    <p onClick={() => setFormname("Register")}>Create Account</p>
    </div></>
    : 
    <form className='loginform' onSubmit = {RegisterSubmit}>
        <h3>Sign Up</h3>

        <label className='loginlabel' htmlFor="username">Username</label>
        <input className='logininput' type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>

        <label className='loginlabel' htmlFor="password">Password</label>
        <input className='logininput' type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}/>
        <input className='logininput' type="password" placeholder="passwordConfirm" value={passwordConfirm}
        onChange={(e) => setPasswordconfirm(e.target.value)}/>

        <button className='loginbutton' type="submit">Create Account</button>
        
    </form>
    }
    </div>
  )
}

export default LoginRegister