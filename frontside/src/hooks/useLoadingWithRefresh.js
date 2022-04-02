import axios from "axios"
import { useDispatch } from 'react-redux'
import { useState, useEffect } from "react"
import { setAuth } from '../store/authSlice'

export function useLoadingWithRefresh() {
    const [loading, setloading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        (async() => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, { withCredentials: true })
                dispatch(setAuth(data))
                setloading(false)
            } catch (error) {
                console.log(error);
                setloading(false)

            }
        })();

    }, [])
    return { loading }
}