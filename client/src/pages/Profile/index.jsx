import './index.scss'
import {useRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, Link} from 'react-router-dom'
import Helmet from '../../components/Helmet'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, list} from 'firebase/storage'
import {app} from '../../firebase'
import { deleteUser, updateUser, signOut,getListing } from '../../utils/getAuth';
import {deleteListing} from '../../utils/createListing'

import {updateSuccess, updateFailure, updateStart, deleteUserStart, deleteUserFailure,
deleteUserSuccess,
signoutUserStart,
signoutUserSuccess,
signoutUserFailure} from '../../features/slices/userSlice'
import {toast} from 'react-toastify'

const Profile = () => {
  const fileRef=useRef()
  const [listingLoading, setLoading]=useState(false)
  const [listingError, setError]=useState()

  const [file, setFile]=useState(undefined)
  const [perc,setPerc]=useState(0)
  const {currentUser, loading, error}=useSelector(state=>state.user)
  const [fileUploadError, setFileUploadError]=useState(false)
  const [formData, setFormData]=useState({})
  const [listings, setListings]=useState([])
  
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const[deleteLoading, setDeleteLoading]=useState(false)
    const [deleteError, setDeleteError]= useState(false)

  
  
  // firebase storage
  // allow read;
  //     allow write: if request.resource.size < 2*1024*1024 && 
  //     request.resource.contentType.matches('image/.*');
  

  useEffect(()=>{
    if(file){
     handleFileUpload(file)
    }
  },[file])
  

  const handleFileUpload=async(file)=>{
    const storage=getStorage(app)
    const fileName=new Date().getTime()+ file?.name
    const storageRef=ref(storage, fileName)
    const uploadTask=uploadBytesResumable(storageRef, file)
    

    uploadTask.on("state_changed",(snapshot)=>{
      const progress=snapshot.bytesTransferred/snapshot.totalBytes * 100

      setPerc(Math.round(progress))
      
    },
    ()=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>setFormData({...formData,avatar:downloadURL})
      )
    }
    );

    const res=await updateUser(formData, currentUser._id)
    if(!res?.username){
      dispatch(updateFailure(res))
      toast.error(res)
    }
    if(res?.username){
      dispatch(updateSuccess(res))
      toast.success("profile update successful")
    }
    
  }
  
  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]:e.target.value })
  }

  const handleSubmit= async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateStart())
      const res=await updateUser(formData, currentUser._id)
      if(!res?.username){
        dispatch(updateFailure(res))
        
      }

      if(res?.username){
        dispatch(updateSuccess(res))
        toast.success("update successful")
        navigate("/login")
      }
       
    } catch (error) {
      dispatch(updateFailure(error.message))
    }


  }
  const deleteAccount=async ()=>{
    dispatch(deleteUserStart())
    const res=await deleteUser(currentUser._id)
    if(res==="User has been deleted"){
      dispatch(deleteUserSuccess())
       toast.success("user deleted")
       navigate("/signin")
    }else{
      dispatch(deleteUserFailure())
      toast.error(res)
    }
  }
  const signOutUser=async()=>{
    dispatch(signoutUserStart())
    const res= await signOut()
    if(res==="user has been logged out"){
      dispatch(signoutUserSuccess())
      toast.success("user logged out")
    }else{
      dispatch(signoutUserFailure())
      toast.error(res)
    }
  }
  const handleShowListing= async()=>{
    setLoading(true)
    setError(false)
    try {
      const res = await getListing(currentUser._id)
      if(res?.length>0){
        setLoading(false)
        setListings(res)
        console.log(res)
      }
      else{
        setError(true)
        setLoading(false)
        toast.error(res)
      }
    } catch (error) {
      setError(true)
      setLoading(false)
      toast.error(error)
    }

  }
  const deleteUserListing= async(id)=>{
    setDeleteLoading(true)
    setDeleteError(false)
    try {
      const res =await deleteListing(id)

      if(res ==="listing successfully deleted"){
        toast.success(res)
       setListings(prev=>prev.filter(item=>item._id!==id))
       setDeleteLoading(false)
       setDeleteError(false)
      }else{
        toast.error(res)
        setDeleteLoading(false)
       setDeleteError(res)
      }
    } catch (error) {
      setDeleteLoading(false)
       setDeleteError(error)
      toast.error(error)
    }
  }
  return <Helmet title="profile">
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()}  src={formData?.avatar ||currentUser?.avatar} alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer  mt-2 self-center"
        />
        <p className="text-sm self-center">
          {
            fileUploadError? 
            (<span className='text-red-700'>Error image upload(image must be less than 2mb)</span>): 

            Number(perc)>0 &&  Number(perc) < 100? (<span className="text-slate-700">{`uploading... ${Number(perc)}`}</span>) : Number(perc)===100? (<span className="text-green-700">image successfully uploaded</span>):""
          
          }
        </p>
        <input type="text" 
        defaultValue={currentUser?.username}
        placeholder="username"
        id="username"
        className='border p-3 rounded-lg' 
        onChange={handleChange}
        />

        <input type="email" 
        defaultValue={currentUser?.email}
        placeholder="email"
        id="email"
        className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input type="password" placeholder="password"
        id="password"
        className='border p-3 rounded-lg' 
        onChange={handleChange}
        />
        <button className='p-3 bg-slate-700 text-white rounded-lg hover:opacity-85 disabled:opacity-80 uppercase' disabled={loading}>{loading? "loading...": "update"}</button>
        <Link to="/create-listing" className='bg-green-700 text-white text-center rounded-lg hover:opacity-95 uppercase p-3'>create Listing</Link>
      </form>
      <div className='flex justify-between items-center mt-5'>
        <span className='text-red-500 cursor-pointer' onClick={deleteAccount}>Delete Account</span>

        <span className='text-red-500 cursor-pointer'
        onClick={signOutUser}
        >{loading?"loading...":"Sign out"}</span>
      </div>
      <p className='text-red-700 text-center'>{error? error:""}</p>
      <button onClick={handleShowListing} className="text-green-700 w-full">{listingLoading?"loading...": (listings && listings.length>0?"":"Show Listing")}</button>
      {listingError ? <p className="text-red-700 text-center text-sm">Error showing listings</p>:""}

      {
        listings && 
        <div className='flex flex-col gap-4'>
        {listings && listings.length>0 && <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>}
        {listings && listings.length>0 && listings?.map(listing=>(
         <div key={listing._id}  className="flex justify-between p-3 border rounded-lg items-center gap-4">
           <Link to={`/listing/${listing._id}`} className="">
            <img src={listing.imageUrls} alt="listing image" className="h-20 w-20 object-contain rounded-lg"/>
          </Link >
          <Link className="font-semibold hover:underline  text-slate-700 truncate flex-1" to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
          </Link>

          <div className="flex flex-col items-center">
            <button className='text-red-700 uppercase' onClick={()=>deleteUserListing(listing._id)}>{deleteLoading?"deleting...": "Delete"}</button>
            <Link to={`/edit/${listing._id}`}>
            <button className='text-green-700 uppercase'>Edit</button>
            </Link>
          </div>
          <p className="text-red-500 text-sm text-center">{deleteError && deleteError}</p>
         </div>
          )
          
          ) }
          </div>
      }
    </div>
    </Helmet>;
}

export default Profile;
