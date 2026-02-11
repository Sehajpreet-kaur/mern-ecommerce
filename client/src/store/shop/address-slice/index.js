import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isLoading:false,
    addressList:[]
}

//add 4 slices
export const addNewAddress=createAsyncThunk("/addressess/addNewAddress",async(formData)=> //formData we will receive from frontend
    {
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add`,formData)

        return response.data
    })

export const fetchAllAddress=createAsyncThunk("/addressess/fetchAllAddress",async(userId)=> {
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`)

        return response.data
    })

export const editaAddress=createAsyncThunk("/addressess/editaAddress",async({userId,addressId,formData})=>{
        const response=await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`,formData)
        //formData will be updated data
        return response.data
    })

export const deleteAddress=createAsyncThunk("/addressess/deleteAddress",async({userId,addressId})=> {
        const response=await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`)

        return response.data
    })

const addressSlice= createSlice({
    name:"address",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addNewAddress.pending,(state)=>{
            state.isLoading=true
        }).addCase(addNewAddress.fulfilled,(state)=>{
            state.isLoading=false
        }).addCase(addNewAddress.rejected,(state)=>{
            state.isLoading=false
        }).addCase(fetchAllAddress.pending,(state)=>{
            state.isLoading=true
        }).addCase(fetchAllAddress.fulfilled,(state,action)=>{
            state.isLoading=false
            state.addressList=action.payload.data
        }).addCase(fetchAllAddress.rejected,(state)=>{
            state.isLoading=false
            state.addressList=[]
        })        
    }
})

export default addressSlice.reducer