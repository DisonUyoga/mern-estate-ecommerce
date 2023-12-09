import './index.scss'
import Helmet from '../../components/Helmet'
import {Link, Form, useNavigate, useActionData, useNavigation} from 'react-router-dom'
import {useEffect} from 'react';
import {loginUser } from '../../utils/getAuth';
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../../features/slices/userSlice';
import OAuth from '../../components/OAuth'

export async function action({request}){
  const formData=await request.formData()
  
  const email =formData.get("email")
  const password=formData.get("password")
  try {
    const res=await loginUser({email,password})
    if(res?.username){
      toast.success(`${res.username} your logged in`)
    }else{
      toast.error(res)
    }
    return res
  } catch (error) {
    toast.error(error.message)
    return error.message
  }
}


const Login = () => {
  const navigation=useNavigation()
  const navigate=useNavigate()
  const feedBack=useActionData()
  const dispatch= useDispatch()

 useEffect(()=>{
  if(feedBack?.username){
    dispatch(signInSuccess(feedBack))
    console.log("user created successfully");
    navigate("/")
  }else{
    dispatch(signInFailure(feedBack))
  }
 },[dispatch, navigate, feedBack])
  
  return <Helmet title="Sign up">
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className="text 3xl text-center font-semibold my-7">Login</h1>
      <Form className="flex flex-col gap-4" method="post" replace>
        
         
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
         <button type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' disabled={navigation.state==="submitting"?true:false}>{navigation.state==="submitting"?"Loading..." : "Login"}</button>
         <OAuth/>
      </Form>
      <div className='flex mt-5 gap-2'>
        <p>Don't have an account?</p>
        <Link to="/signin">
        <span className="text-blue-700">Login</span>
        </Link>
      </div>
      {
        !feedBack?.username && <div className="text-red-500 text-center">{feedBack}</div> 
      }
    </div>
  </Helmet>
}

export default Login;

