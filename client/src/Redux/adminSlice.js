import { createSlice } from "@reduxjs/toolkit";

const initialState={
    admin:localStorage.getItem('adminInfo')
    ?JSON.parse(localStorage.getItem('adminInfo'))
    :null
}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        AdminLogin:(state,action)=>{
            state.admin=action.payload;
            localStorage.setItem('adminInfo',JSON.stringify(state.admin))
        },
        AdminLogout:(state,action)=>{
            state.admin=null,
            localStorage.removeItem('adminInfo')
        }
    }
})

export const {AdminLogin,AdminLogout} = adminSlice.actions;
export default adminSlice.reducer;