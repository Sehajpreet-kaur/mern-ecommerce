import { createAsyncThunk, createSlice } from "@reduxjs/toolkit" ;
import axios from "axios";

const initialState={
    isAuthenticated:false,
    isLoading:true,
    user:null
}

export const registerUser= createAsyncThunk('/auth/register',

    async(formData) =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData,{
            withCredentials:true
        })  //formData which we will receive
        return response.data
    }
)

export const loginUser= createAsyncThunk('/auth/login',

    async(formData) =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData,{
            withCredentials:true
        })  //formData which we will receive
        return response.data
    }
)

export const logoutUser= createAsyncThunk('/auth/logout',

    async() =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{},{
            withCredentials:true
        })  //no need of formData 
        return response.data
    }
)

export const checkAuth= createAsyncThunk('/auth/checkauth',

    async(formData) =>{    // formData is what we get from auth/register
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,{
            withCredentials:true,
            headers:{
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Expires: '0'
            }
        })  //formData which we will receive
        return response.data
    }
)

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{ }
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state)=>{
            state.isLoading=true
        }).addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated=false
        }).addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated=false
        }).addCase(loginUser.pending,(state)=>{
            state.isLoading=true
        }).addCase(loginUser.fulfilled,(state,action)=>{
            console.log(action)
            state.isLoading=false,
            state.user=action.payload.success ? action.payload.user : null,
            state.isAuthenticated=action.payload.success ? true: false
        }).addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated=false
        }).addCase(checkAuth.pending,(state)=>{
            state.isLoading=true
        }).addCase(checkAuth.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.user=action.payload.success ? action.payload.user : null,
            state.isAuthenticated=action.payload.success ? true: false
        }).addCase(checkAuth.rejected,(state,action)=>{
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated=false
        }).addCase(logoutUser.fulfilled,(state,action)=>{
            console.log(action)
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated= false
        })
    }
})

export const {setUser}= authSlice.actions
export default authSlice.reducer