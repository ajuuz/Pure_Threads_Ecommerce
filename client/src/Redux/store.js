import { configureStore } from "@reduxjs/toolkit";
import AdminReducer from './adminSlice.js'
import UserReducer from './userSlice.js'



export const store = configureStore({
    reducer:{
        user:UserReducer,
        admin:AdminReducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
    }),
})