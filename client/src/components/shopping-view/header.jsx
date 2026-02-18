import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Sheet,SheetContent,SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { shoppingViewHeaderMenuItems } from "@/configure"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, } from "@/components/ui/avatar"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { logoutUser,resetTokenAndCredentials } from "@/store/auth-slice"
import UserCartWrapper from "./cart-wrapper"
import { useEffect, useState } from "react"
import { fetchCartItems } from "@/store/shop/cart-slice"
import { Label } from "../ui/label"

function MenuItems(){

    const navigate=useNavigate()
    const location=useLocation()
    const [searchParams,setSearchParams]=useSearchParams()

    function handleNavigate(getCurrentMenuItem){    
        sessionStorage.removeItem('filters') //remove previous selected filters
        const currentFilter= getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id!== 'products' && getCurrentMenuItem.id!== 'search'
        ? {
            category:[getCurrentMenuItem.id]
        }:null 
        // if it is not home then it must be a category

        sessionStorage.setItem('filters',JSON.stringify(currentFilter))

        //to navigate to filters while on diff pages
        location.pathname.includes('listing')  && currentFilter!==null ?
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) :
        navigate(getCurrentMenuItem.path) 
        // path we have given in configure file
    }

    return <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map(menuItem => 
            <Label onClick={()=>handleNavigate(menuItem)} className="text-sm font-medium cursor-pointer"  key={menuItem.id} to={menuItem.path}>{menuItem.label}</Label>)
        }
    </nav>
}

function HeaderRightContent(){
    const {user}=useSelector((state)=> state.auth)
    const {cartItems}=useSelector(state=> state.shopCart)
    const [openCartSheet,setOpenCartSheet]=useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()

    function handleLogout(){
        dispatch(logoutUser())
        dispatch(resetTokenAndCredentials())
        localStorage.clear()
        navigate('/auth/login')
    }

    useEffect(()=>{
        dispatch(fetchCartItems(user?.id))
    },[dispatch])

    return <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
            
            <Button onClick={()=> setOpenCartSheet(true)} className="relative" variant='outline' size="icon">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm">{cartItems?.items.length || '0'}</span>
            <span className="sr-only">User cart</span>
        </Button>
        <SheetContent>
            <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length>0 ? cartItems.items :[]} />
            {/* bcz we're having cartItms.items not cartItms */}
        </SheetContent>
        </Sheet>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="bg-black" >
                    <AvatarFallback className="bg-black text-white font-extrabold">
                        {user?.username[0].toUpperCase()}
                        {/* since we dont have any image right now so use avatarfallback nd render some dummy data first */}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 bg-white">
                <DropdownMenuLabel onClick={handleLogout}>
                    Logged in as {user?.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>{
                     navigate('/shop/account');
                    }}>
                    <UserCog className="mr-2 h-4 w-4"/>
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/>
                    Logout
                </DropdownMenuItem>
                
            </DropdownMenuContent>
        </DropdownMenu>

    </div>
}

function ShoppingHeader(){

    const {isAuthenticated}=useSelector((state)=> state.auth)

    return(
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/shop/home" className="flex items-center gap-2">
                    <HousePlug className="h-6 w-6" />
                    <span className="font-bold">Ecommerce</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild >
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toogle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs bg-white text-black">
                    {/* render menu  items for small devices here */}
                        <MenuItems />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                {/* render menu items for large devices here */}
                <div className="hidden lg:block">
                    <MenuItems />
                </div>
                {/* chk if user is authenticated then only show right content {<div>} else null nd chk this using isAuthenticated in the store using state */}
                {
                    //bcz we get this page only if we are authenticated
                    // isAuthenticated? <div>
                    //     <HeaderRightContent />
                    // </div> :null
                        <div className="hidden lg:block">
                            <HeaderRightContent />
                        </div>

                }
            </div>
        </header>
    )
}
export default ShoppingHeader