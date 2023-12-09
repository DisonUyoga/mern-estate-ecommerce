import './index.scss'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase';
import {useEffect} from 'react';
import {googleLogin} from '../../utils/getAuth'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { signInSuccess} from '../../features/slices/userSlice';
const AOuth =() => {

  const dispatch=useDispatch()

  const navigate=useNavigate()
  const handleGoogleClick=async()=>{
    try {
      const provider=new GoogleAuthProvider()
      const auth=getAuth(app)

      const result=await signInWithPopup(auth, provider)

      const name=result.user.displayName
      const email=result.user.email

      const photo=result.user.photoURL

      const res=await googleLogin({
        name,
        email,
        photo
      })
      dispatch(signInSuccess(res))
      navigate("/")

      } catch (error) {
      console.log("could not sign in with google", error);
    }
  }
 
  return <>
    <button 
    type="button" className='bg-red-500 rounded-lg text-white p-3 uppercase  hover:opacity-85'
    onClick={handleGoogleClick}
    >
      Continue with google
    </button>
  </>
}

export default AOuth;
