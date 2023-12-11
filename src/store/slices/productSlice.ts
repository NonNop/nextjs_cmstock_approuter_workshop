import { ProductData } from "@/src/app/models/product.model";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as serverService from "@/src/services/serverService"

interface ProductState {
    products: ProductData[]
}

const initialState: ProductState = {
    products: [],
}

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (keyword?: string) => {
        const response = await serverService.getProducts(keyword)
        return response
    }
)

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload
        })
    },
})

export default productSlice.reducer
// export const productSelector = (state: RootState) => state.producrReducer