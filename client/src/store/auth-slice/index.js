import { createAsyncThunk, createSlice } from "@reduxjs/toolkit" ;
import axios from "axios";

const initialState={
    isAuthenticated:false,
    isLoading:false,
    user:null,
    token:localStorage.getItem('token')
}

export const registerUser= createAsyncThunk('/auth/register',

    async(formData) =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,formData)  //formData which we will receive
        return response.data
    }
)

export const loginUser= createAsyncThunk('/auth/login',

    async(formData) =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData)  //formData which we will receive

        console.log("FULL RESPONSE:", response.data)

        return response.data
    }
)

export const logoutUser= createAsyncThunk('/auth/logout',

    async() =>{    // formData is what we get from auth/register
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`)  //no need of formData 
        return response.data
    }
)

// export const checkAuth= createAsyncThunk('/auth/checkauth',

//     async() =>{   
//         const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,{
//             withCredentials:true,
//             headers:{
//                 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
//             }
//         })  //formData which we will receive
//         return response.data
//     }
// )

export const checkAuth= createAsyncThunk('/auth/checkauth',

    async(token) =>{   
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,{
            headers:{
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            }
        })  //formData which we will receive
        return response.data
    }
)

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{},
        resetTokenAndCredentials:(state)=>{
            state.isAuthenticated=false,
            state.user=null;
            state.token=null
        }
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
            console.log(action.payload,"action")
            console.log(action.payload.token,"token")
            state.isLoading=false,
            state.user=action.payload.success ? action.payload.user : null,
            state.isAuthenticated=action.payload.success ? true: false

            // state.token=action.payload.token
            // localStorage.setItem('token', action.payload.token)
            if(action.payload.success && action.payload.token){
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            }

        }).addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false,
            state.user=null,
            state.isAuthenticated=false
            state.token=null
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
            localStorage.removeItem('token')
        })
    }
})
// resetTokenAndCredentials
export const {setUser,resetTokenAndCredentials}= authSlice.actions
export default authSlice.reducer