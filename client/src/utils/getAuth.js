import axios from 'axios'

export async function signupUser(cred){
  console.log(cred);
  const URL="/api/user/signup"
  try {
    const res=await axios.post(URL,cred)
    return res.data
  } catch (error) {
    return error.response?.data.message
  }
}

export async function loginUser(cred){
  const URL='/api/user/login'
 
  try {
    const res=await axios.post(URL, cred)
    console.log(res.data);
    return res.data
  } catch (error) {
    
    return error.response?.data.message
  }
}

export async function googleLogin(cred){
  const URL='/api/user/google'
 
  try {
    const res=await axios.post(URL, cred)
   
    return res.data
  } catch (error) {
   
    return error.response?.data.message
  }
}

export async function updateUser(cred, id){
  const URL=`/api/user/update/${id}`
 console.log(URL)
 console.log(cred)
  try {
    const res=await axios.post(URL, cred)
   
    return res.data
  } catch (error) {
   
    return error.response?.data.message
  }
}


export async function deleteUser( id){
  const URL=`/api/user/delete/${id}`
 try {
    const res=await axios.delete(URL) 
    return res.data
  } catch (error) {
   
    return error.response?.data.message
  }
}

export async function signOut(){
  const URL='/api/user/signout'
 
  try {
    const res=await axios.get(URL)
    console.log(res.data);
    return res.data
  } catch (error) {
    
    return error.response?.data.message
  }
}

export async function getListing(id){
  const URL=`/api/user/listing/${id}`

  try{
    const res=await axios.get(URL)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}

export async function getUser(id){
  const URL=`/api/user/${id}`

  try{
    const res=await axios.get(URL)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}

