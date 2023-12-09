import Listing from '../models/listing.js'
import { errorHandler } from '../utils/error.js'

export const createListing=async(req,res,next)=>{
  try {
    const listing= await Listing.create(req.body)
    return res.status(201).json(listing)
  } catch (error) {
    next(error)
  }

}

export const getListing= async(req, res, next)=>{

  if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only view your own listing"))
  try {
    const listings=await Listing.find({userRef:req.params.id})
    res.status(200).json(listings)
  } catch (error) {
    next(error)
  }
}

export const deleteListing= async(req, res,next)=>{
 const listing = await Listing.findById(req.params.id)
 if(!listing){
  return next(401,"Listing not found")
 }
 if(req.user.id !==listing.userRef.toString()){
  return next(errorHandler(401, "you can only delete your own listings!!!"))
 }

 try {
  await Listing.findByIdAndDelete(req.params.id)
  res.status(200).json("listing successfully deleted")
 } catch (error) {
  next(error)
 }
}

export const editListing=async(req, res, next)=>{

  const listingCheck=await Listing.findById(req.params.id)
  if(!listingCheck) return next(errorHandler(404, "Listing not found"))
  if(req.user.id !== listingCheck.userRef) return next(errorHandler(401, "You can only edit your own listing"))

  try {
    const listing=await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true})

    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const listingList=async(req,res,next)=>{
  try {
    const listing= await Listing.findById(req.params.id)
    if(!listing) return next(errorHandler(401, "Listing not found"))
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}

export const getListings= async(req,res, next)=>{
  try {
    const limit= parseInt(req.query.limit) || 9

  const startIndex= parseInt(req.query.startIndex) || 0
  let offer= req.query.offer 
 
  if(offer===undefined || offer === "false" ){
    offer= {$in:[false, true]}
  }
  let furnished= req.query.furnished
  if(furnished===undefined || furnished=== "false"){
    furnished={$in:[false, true]}
  }
  let parking=req.query.parking
  if(parking===undefined || parking==="false" ){
    parking={$in:[false,true]}
  }
  let type=req.query.type
  if(type===undefined || type==="all"){
    type={$in:["rent", "sale"]}
  }
  const searchTerm=req.query.searchTerm || ''

  const sort= req.query.sort || 'createdAt'
  const order= req.query.order || "desc"
  const listings= await Listing.find({
    name:{$regex:searchTerm, $options: "i"},
    offer,
    type,
    parking,
    furnished
  }).sort({
    [sort]: order
  }).limit(limit).skip(startIndex)

  return res.status(200).json(listings)

  } catch (error) {
    next(error)
  }
}