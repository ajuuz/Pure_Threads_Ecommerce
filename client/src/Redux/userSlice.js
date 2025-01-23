import { createSlice } from "@reduxjs/toolkit";
const initialState={
    user:localStorage.getItem('userInfo')
    ?JSON.parse(localStorage.getItem('userInfo'))
    :null,
    isFirstLogin:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        UserLogin:(state,action)=>{
            state.user=action.payload;
            localStorage.setItem('userInfo',JSON.stringify(state.user))
        },
        UserLogout:(state,action)=>{
            state.user=null,
            localStorage.removeItem('userInfo')
        },
        UserFirstLogin:(state,action)=>{
            state.isFirstLogin=action.payload;
        }
    }
})

export const {UserLogin,UserLogout,UserFirstLogin} = userSlice.actions
export default userSlice.reducer;