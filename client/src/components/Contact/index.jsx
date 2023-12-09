import './index.scss'
import {getUser} from '../../utils/getAuth'

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'

const Contact = ({listing}) => {
  const [user, setUser]=useState()
  const [message, setMessage]=useState()
  const [loading, setLoading]=useState(false)
  const [error, setError]= useState(false)
  useEffect(()=>{
    const fetchUser=async()=>{
      setLoading(true)
      setError(false)
      try {  
        if(listing?.userRef){
          const res=await getUser(listing?.userRef)
          
          setUser(res)
        }
      setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(true)
      }
    }
    fetchUser()
  },[listing?.userRef])

  const handleOnChange=(e)=>{
      setMessage(e.target.value)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="">Contact: <span className='font-semibold'>{user?.username}</span> for <span className='font-semibold'>{listing?.name.toLowerCase()}</span></p>
      <textarea name="contact" id="contact"  rows="2" value={message} onChange={handleOnChange}
      placeholder='Enter your message'
      className='w-full border p-3 rounded-lg'
      ></textarea>
      <Link to={`mailto:${listing?.email}?subject=Regarding ${listing?.name}&body=${message}`}
      className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
      
      >
        Send message
      </Link>
    </div>
  );
}

export default Contact;
