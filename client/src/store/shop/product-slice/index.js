import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialState={
    isLoading:false,
    productList:[],
    productDetails:null
}

export const fetchAllFilteredProducts=createAsyncThunk('/products/fetchAllProducts', async ({filterParams,sortParams})=>{
    console.log(fetchAllFilteredProducts,"fetchALLFilteredProducts")

    //create query here
    const query=new URLSearchParams({
        ...filterParams,
        sortBy:sortParams
    })

    //ApI call
    const result= await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`)
        return result?.data
})

export const fetchProductDetails=createAsyncThunk('/products/fetchProductDetails', async (id)=>{

    //ApI call
    const result= await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`)
        return result?.data
})

const shoppingProductSlice =createSlice({
    name:'shoppingProducts',
    initialState,
    reducers:{
        setProductDetails:(state)=>{
            state.productDetails=null
            //bcz the details page is not closing if directly going to home page and after returning it stay opend, to close it , define reducers
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAllFilteredProducts.pending,(state,action)=>{
            state.isLoading=true
        }).addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
            console.log(action.payload.data,"action.payload.data")

            state.isLoading=false,
            state.productList=action.payload.data
        }).addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
            
            state.isLoading=false,
            state.productList=[]
        }).addCase(fetchProductDetails.pending,(state,action)=>{
            state.isLoading=true
        }).addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.productDetails=action.payload.data
        }).addCase(fetchProductDetails.rejected,(state,action)=>{
            
            state.isLoading=false,
            state.productDetails=null
        })
    }
})

export const {setProductDetails}=shoppingProductSlice.actions
export default shoppingProductSlice.reducer