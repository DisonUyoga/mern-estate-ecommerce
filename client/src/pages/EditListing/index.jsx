import './index.scss'
import Helmet from '../../components/Helmet';
import {useState,useRef, useEffect} from 'react'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {app} from '../../firebase'
import { editListing, listingItem } from '../../utils/createListing';
import {toast} from 'react-toastify'
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'


const EditListing = () => {
  const [file, setFile]=useState([])
  const {currentUser}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const [formData, setFormData]=useState({
    imageUrls:[],
    name:'',
    description:"",
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
    userRef:currentUser._id

  })
  const [error, setError]=useState(false)
  const [loading, setLoading]=useState(false)
  const [uploading, setUploading]=useState(false)
  const {id}=useParams()
  const [imageError, setImageError]=useState(false)
  

 

  const handleFileUpload= (e)=>{
    if(file.length>0 && file.length + formData.imageUrls.length < 7){
      setUploading(true)
      setImageError(false)
      const promises=[]

      for(let i=0;i<file.length;i++){
        promises.push(storeImage(file[i]))
      }
      console.log(promises) 
      Promise.all(promises).then(urls=>{
        setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)})

        setImageError(false)
        setUploading(false)
      }).catch(_=>{
        setImageError("Image upload failed (2 mb max per image)")
        setUploading(false)
      })
    }else{
      setImageError("can only upload 6 images per listing")
      setUploading(false)
    }
  }

  const storeImage=async(file)=>{
    return new Promise((resolve,reject)=>{
      const storage=getStorage(app)
    const fileName= new Date().getTime() + file.name
    const storageRef= ref(storage, fileName)

    const uploadTask=uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',(snapshot)=>{
        const progress= snapshot.bytesTransferred/snapshot.totalBytes * 100

        console.log(progress);
    },
    (error)=>{
        reject(error)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(downloadURL=>resolve(downloadURL))
    }

    )
    })
  }


  useEffect(()=>{
    const fetchData= async()=>{
      const listing= await listingItem(id)
      if(!listing?.name) return setError(listing)
      setFormData(listing)
    }
    fetchData()
  },[id])
  const handleChange=(e)=>{
    const {id, value, checked, type}=e.target
    if(id==="sale" || id==="rent"){
      setFormData(prev=>{
        return {
          ...prev,
          type:id
        }
      })
    }
    if(id=="parking" || id==="furnished" || id==="offer"){
      setFormData(prev=>{
        return {
          ...prev,
          [id]:checked
        }
      })
    }
    if(type==='number' || type==="text" || type==="textarea"){
      setFormData(prev=>{
        return {
          ...prev,
          [id]: value
        } 
      })
    }
   
  }
console.log(formData);
  const handleSubmit=async(e)=>{
    e.preventDefault()
    
    if(formData.imageUrls.length<1) return setError("You must upload at least 1 image")
    if(+formData.regularPrice<+formData.discountPrice) return setError("discount price must be lower than regular price")
    setError(false)
    setLoading(true)
   try {
    const res= await editListing(formData, id)
    if(res?.name){
    setLoading(false)
    toast.success(`${res?.name} listing created successfully`)
    navigate(`/listing/${res._id}`)
    }
    if(!res?.name){
    setError(true)
    setLoading(false)
    toast.error(res)
    }
   } catch (error) {
    toast.error(error)
   }
   setFormData({
    imageUrls:[],
    name:'',
    description:"",
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
    userRef:currentUser._id

  })
  setFile([])
  }


const deleteImage=(index)=>{
setFormData(prev=>{
  return {
    ...prev,
    imageUrls: prev.imageUrls.filter(url=>url!==prev.imageUrls[index])
  }
})
}

  return <Helmet title="Listing">
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Update Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input type="text" id="name"
            placeholder='name'
              className='border p-3 rounded-lg'
              maxLength="62"
              
              required
              onChange={handleChange}
              value={formData.name}
            />

              <textarea type="text" id="description"
              placeholder="description"
              className='border p-3 rounded-lg'
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input type="text" id="address"
            placeholder="address"
              className='border p-3 rounded-lg'
              required
              onChange={handleChange}
              value={formData.address}

            />
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-2">
                <input type="checkbox" className="w-5" 
                  id="sale"
                  onChange={handleChange}
                  checked={formData.type==="sale"}
                />
               <span>Sale</span>
              </div>

              <div className="flex gap-2">
                <input type="checkbox" className="w-5" 
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type==="rent"}
                />
               <span>Rent</span>
              </div>

              <div className="flex gap-2">
                <input type="checkbox" className="w-5" 
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                />
               <span>Parking Spot</span>
              </div>

              <div className="flex gap-2">
                <input type="checkbox" className="w-5" 
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
               <span>Furnished</span>
              </div>

              <div className="flex gap-2">
                <input type="checkbox" className="w-5" 
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                />
               <span>Offer</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input type="number" 
                id="bedrooms"
                required
                max="10"
                min="1"
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg" />
                <p>Beds</p>
              </div>

              <div className="flex items-center gap-2">
                <input type="number" 
                id="bathrooms"
                required
                max="10"
                min="1"
                className="p-3 border border-gray-300 rounded-lg" 
                onChange={handleChange}
                value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>

              <div className="flex items-center gap-2">
                <input type="number" 
                id="regularPrice"
                required
                max="10000000000"
                min="0"
                className="p-3 border border-gray-300 rounded-lg" 
                onChange={handleChange}
                value={formData.regularPrice}
                />
               <div className="flex flex-col items-center">
               <p>Regular Price</p>
               <span className="text-sm">(Ksh / month)</span>
               </div>
              </div>

              {
                formData.offer && (<div className="flex items-center gap-2">
                <input type="number" 
                id="discountPrice"
                required
                max="1000000000"
                min="0"
                className="p-3 border border-gray-300 rounded-lg" 
                onChange={handleChange}
                value={formData.discountPrice}
                />
                <div className="flex flex-col items center">
               <p>Discounted Price</p>
               <span className="text-sm">(Ksh / month)</span>
               </div>
              </div>)
              }
            </div>
          </div>
        <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">Images:</p>
        <span className='font-normal text-gray-700 ml-2'>The first image will be the cover (max-6)</span>

        <div className="flex gap-4">
          <input type="file"
          onChange={(e)=>setFile(e.target.files)}
           className="border border-gray-300 rounded w-full p-3" 
            id="images"
            accept='/image/*'
            multiple
           />
           <button type="button" className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg uppercase disabled:opacity-80" onClick={handleFileUpload} disabled={uploading} >{uploading?"uploading...": "Upload"}</button>
        </div>
        <p className="text-red-700 text-center text-sm">{imageError && imageError}</p>
        {
          formData.imageUrls?.length>0 && formData.imageUrls.map((image, index)=>(
            <div key={index} className="flex justify-between items-center border p-3 rounded-lg">
            <img  src={image} alt="image"
              className="h-28 w-28 object-contain rounded-lg"
            />
            <button type="button" className="text-red-700 uppercase p-3 rounded-lg hover:opacity-75" onClick={()=>deleteImage(index)}>Delete</button>
            </div>
          ))
        }
        <button className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-85" disabled={loading || uploading}>{loading?"updating..." : "update listing"}</button>
        {error && <p className="text-red-700 text-center text-sm">{error}</p>}
        </div>
          
      </form>
    </main>
  </Helmet>
}

export default EditListing;

