import CommonForm from "@/components/common/form"
import { registerFormControls } from "@/configure"
import { registerUser } from "@/store/auth-slice"
import {toast} from "sonner"
import { useState } from "react"
import { useDispatch } from "react-redux"
import {Link, useNavigate} from "react-router-dom"

const initialState={
    username:'',
    email:'',
    password:''
}

function AuthRegister(){
    const [formData ,setFormData]=useState(initialState)

    const dispatch=useDispatch();
    const navigate=useNavigate();
    

    function onSubmit(event){
        event.preventDefault(); // it will refersh the page

        dispatch(registerUser(formData)).unwrap()
        .then((data)=>{
            if(data.success){
                toast.success(data.message)
                navigate('/auth/login')
            }
            else{
                toast.error(data.message);
            }
         })   //dispatch the function and then go to login page
    } 

    console.log(formData)

    return (<div className="mx-auto  max-w-md space-y-6">
            <div className="text-center w-full">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p className="mt-2">Already have an account 
                 <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>Login</Link>
                </p>
            </div>
            <CommonForm 
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}/>

            
    </div>)
}

export default AuthRegister