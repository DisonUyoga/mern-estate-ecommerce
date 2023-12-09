import './index.scss'
import Helmet from '../../components/Helmet'
import {Link, Form, useNavigate, useActionData, useNavigation} from 'react-router-dom'
import React from 'react';
import { signupUser } from '../../utils/getAuth';
import {toast} from 'react-toastify'
import OAuth from '../../components/OAuth'

export async function action({request}){
  const formData=await request.formData()
  const username=formData.get("username")
  const email =formData.get("email")
  const password=formData.get("password")
  try {
    const res=await signupUser({username, email,password})
    toast.success(res)
    return res
  } catch (error) {
    toast.error(error.message)
    return error.message
  }
}


const Signin = () => {
  const navigation=useNavigation()
  const navigate=useNavigate()
  const feedBack=useActionData()

  if(feedBack==="user created successfully"){
    navigate("/login")
  }
  
  return <Helmet title="Sign up">
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className="text 3xl text-center font-semibold my-7">Sign up</h1>
      <Form className="flex flex-col gap-4" method="post" replace>
        <input type="text"
        placeholder='Username'
        name="username"
        className='border p-3 rounded-lg'
        id='username'
         />
         
         <input type="text"
        placeholder='Email'
        name="email"
        className='border p-3 rounded-lg'
        id='email'
         />

        <input type="password"
        name="password"
        placeholder='password'
        className='border p-3 rounded-lg'
        id='password'
         />
         <button type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' disabled={navigation.state==="submitting"?true:false}>{navigation.state==="submitting"?"Loading..." : "Sign up"}</button>
         <OAuth/>
      </Form>
      <div className='flex mt-5 gap-2'>
        <p>Have an account?</p>
        <Link to="/login">
        <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {
        feedBack !== "user created successfully" && <div className="text-red-500 text-center">{feedBack}</div> 
      }
    </div>
  </Helmet>
}

export default Signin;
