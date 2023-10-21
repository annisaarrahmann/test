import React, { useState } from 'react'
import { login } from '../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';
import "./login.scss"

export default function Login() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate=useNavigate()
  const handleSubmit = () => {
    if (!username ||!password) {
      window.alert('Invalid login credentials')
      return;
    }
    login(username,password)
    navigate('/')
  }
  return (
    <div className='login'>
        <img src="https://pindad-enjiniring.com/wp-content/uploads/2022/02/PEI-pindad-new1.png" alt="" className="icons" />
      <h2>Log In As Existing User</h2>
      <div className='input'>
        <input className='text-input' type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
        <input className='text-input text-base' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
      </div>
        <button className='loginContinue' onClick={handleSubmit}>
          <div className='flex'>
            <span class='info'>Login</span>
            <p className='continue'>Continue</p>
          </div>
        </button>
    </div>
  )
}
