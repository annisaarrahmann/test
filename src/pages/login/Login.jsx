import React, { useState } from 'react'
import { login } from '../../lib/pocketbase';
import { useNavigate } from 'react-router-dom';

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
    <>
      <h2>Log In As Existing User</h2>
      <div className='grid gap-6 mt-4 text-base'>
        <input className='text-input' type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} required />
        <input className='text-input text-base' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
      </div>
        <button className='bg-green-500 text-white py-2 px-4 rounded-md text-base mt-6' onClick={handleSubmit}>
          <div className='flex'>
            <span class='material-symbols-outlined -ml-2'>login</span>
            <p className='text-base ml-2'>Continue</p>
          </div>
        </button>
    </>
  )
}
