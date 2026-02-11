import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const initialState={
    isLoading:false,
    productList:[]
}

export const addNewProduct=createAsyncThunk('/products/addnewProduct', async (formData)=>{
    //ApI call
    const result= await axios.post('${import.meta.env.VITE_API_URL}/api/admin/products/add',formData,
       { headers : { 
            'Content-Type': 'application/json'
            }
        })
        return result?.data
})

export const fetchAllProducts=createAsyncThunk('/products/fetchAllProducts', async (formData)=>{
    //ApI call
    const result= await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`)
        return result?.data
})

export const editProduct=createAsyncThunk('/products/editProduct', async ({id,formData})=>{
    //ApI call
    const result= await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,formData,
       { headers : { 
            'Content-Type': 'application/json'
            }
        })
        return result?.data
})

export const deleteProduct=createAsyncThunk('/products/deleteProduct', async (id)=>{
    //ApI call
    const result= await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
       { headers : { 
            'Content-Type': 'application/json'
            }
        })
        return result?.data
})

const adminProductsSlice= createSlice({
    name:'adminProductSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //here we need cases for fetching products
        builder.addCase(fetchAllProducts.pending, (state)=>{
            state.isLoading=true
        }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
            console.log(action.payload.data)
            state.isLoading=false
            state.productList=action.payload.data
        }).addCase(fetchAllProducts.rejected,(state,action)=>{
        
            state.isLoading=false
            state.productList=[]
        })
    }
})

export default adminProductsSlice.reducer