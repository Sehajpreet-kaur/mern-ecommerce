import {Navigate, useLocation } from "react-router-dom"


function CheckAuth({isAuthenticated, user, children,isLoading}){
    const location=useLocation()

    console.log(location.pathname,isAuthenticated,isLoading,"isLoading")

    if(isLoading){
        return null
    }

    if(location.pathname==="/"){
        if(!isAuthenticated){
            return <Navigate to ="/auth/login"/>
        }else{
            if(user?.role==="admin"){
                return <Navigate to ="/admin/dashboard"/>
            }else{
                return <Navigate to ="/shop/home"/>    //else user is a normal user
            }
        }
    }

   if (!isAuthenticated &&
    !(
        location.pathname.includes("/login") ||
        location.pathname.includes("/register")
    )){
         return <Navigate to ="/auth/login"/>  //if user is not authenticated and not in login or register page
    }
   
    if(isAuthenticated  && (location.pathname.includes('/login') || location.pathname.includes('/register'))){
        //now user will directed to shopping or admin view but need to check user role if it is normal user then shopping view or if admin then admin view -- for this use 'user' props
        if(user?.role==="admin"){
            return <Navigate to ="/admin/dashboard"/>
        }else{
            return <Navigate to ="/shop/home"/>    //else user is a normal user
        }
    }

    //if normal user is authenticated and try to access admin page , he should land to unauth page
    if(isAuthenticated && user?.role !=="admin" && location.pathname.includes('admin') ){
        return <Navigate to="/unauth-page"/>
    }
    //if user is authenticated and user is admin and try to access shopping page ,he should land to unauth page
    if(isAuthenticated && user?.role==="admin" && location.pathname.includes('shop')){
        return <Navigate to="/admin/dashboard" />
    }

    return <>{children}</>
}
export default CheckAuth