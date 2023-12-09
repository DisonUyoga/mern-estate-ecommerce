import axios from 'axios'

export async function createListing(data){
  const URL="/api/listing/create"

  try{
    const res=await axios.post(URL, data)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}

export async function deleteListing(id){
  const URL=`/api/listing/delete/${id}`

  try{
    const res=await axios.delete(URL)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}

export async function editListing(data, id){
  const URL=`/api/listing/edit/${id}`

  try{
    const res=await axios.post(URL, data)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}
export async function listingItem(id){
  const URL=`/api/listing/get/${id}`

  try{
    const res=await axios.get(URL)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}

export async function searchListings(searchQuery){
  const URL=`/api/listing/get/?${searchQuery}`

  try{
    const res=await axios.get(URL)

    return res.data
  }catch(error){
    return error.response.data.message
  }
}
