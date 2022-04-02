import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../http'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../store/authSlice'


const Navebar = () => {
    const dispatch = useDispatch()
    const { isAuth, user } = useSelector((state) => state.auth)
    async function logoutUser() {
        try {

            const { data } = await logout()
            dispatch(setAuth(data))
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <nav className='p-5 flex items-center justify-between'>
            <Link to='/' className='font-bold text-2xl flex items-center'>

                <img src="/images/logo.png" alt="logo" />
                <span className='ml-2.5' >Let's Talk</span>
            </Link>
            {isAuth && (<div className='flex items-center'>
                <h3 className='md:block hidden'>
                    {user?.name}
                </h3> 
                
                <Link to='/'>
                    <img src={user.avatar ? user.avatar :'images/monkey-avatar.png'} alt="avatar" className='rounded-full object-cover border-4 border-sky-700 my-0 mx-5 mr-3.5 w-10 h-10' /></Link>
                <button onClick={logoutUser} className=''><img src="/images/logout.png" alt="logout" /></button>
            </div>
            )}

        </nav>
    )
}

export default Navebar
