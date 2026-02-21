import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isLoading:false,
    reviews:[]
}

export const addReview=createAsyncThunk("/order/addReview",async(formData)=>{
    try{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/review/add`,formData)

        return response.data
    }
    catch(e){
        return rejectWithValue(e.response.data)
    }

    
})

export const getReviews=createAsyncThunk("/order/getReviews",async(id)=>{

    const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/review/${id}`)

    return response.data
})

const reviewSlice=createSlice({
    name:'reviewSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addReview.fulfilled, (state, action) => {
            state.isLoading = false
        }).addCase(addReview.rejected, (state, action) => {
            state.isLoading = false
        }).addCase(getReviews.pending,(state)=>{
            state.isLoading=true
        }).addCase(getReviews.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.reviews=action.payload.data
        }).addCase(getReviews.rejected,(state)=>{
            state.isLoading=true
            state.reviews=[]
        })
    }
})

export default reviewSlice.reducer