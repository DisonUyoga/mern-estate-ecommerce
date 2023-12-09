
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    error:null,
    loading:false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart(state){
      state.loading=true
    },
    signInSuccess(state,action){
     state.currentUser=action.payload
     state.loading=false
     state.error=null
     
    },
    signInFailure(state,action){
      state.error=action.payload
      state.loading=false
    }, 
    updateStart(state){
      state.loading=true

    },
    updateSuccess(state,action){
      state.currentUser=action.payload
      state.loading=false
      state.error=null
    },
    updateFailure(state, action){
      state.error=action.payload
      state.loading=false
    },
    deleteUserStart(state){
      state.loading=TextTrackCueList
    },
    deleteUserSuccess(state,action){
      state.currentUser=null,
      state.loading=false
      state.error=null
    },
    deleteUserFailure(state,action){
      state.error=action.payload
      state.loading=false

    },
    signoutUserStart(state){
      state.loading=TextTrackCueList
    },
    signoutUserSuccess(state,action){
      state.currentUser=null,
      state.loading=false
      state.error=null
    },
    signoutUserFailure(state,action){
      state.error=action.payload
      state.loading=false

    }
  }
});

export const signInError=state=>state.user.error
export const signInLoading=state=>state.user.loading
export const getCurrentUser=state=>state.user.currentUser
export const {
  signInSuccess,
  signInStart,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure
} = userSlice.actions

export default userSlice.reducer