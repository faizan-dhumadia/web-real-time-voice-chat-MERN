import React from 'react'
import Card from '../../Components/Card'
import Button from '../../Components/Button'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setAvatar } from '../../store/activateSlice'
import { activate } from '../../http'
import { setAuth } from '../../store/authSlice'
import Loader from '../../Components/Loader'
import { useEffect } from 'react'


const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch()
    const { name, avatar } = useSelector((state) => state.activate)
    const [image, setImage] = useState('/images/monkey-avatar.png')
    const [loading, setLoading] = useState(false)
    const [unMounted, setUnMounted] = useState(false)
    function captureImage(e) {
        console.log(e);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            console.log(reader.result);
            setImage(reader.result)
            dispatch(setAvatar(reader.result))
        }
    }
    async function submit() {
        if(!name || ! avatar) return;
        setLoading(true)
        try {
            const { data } = await activate({ name, avatar })
            if(data.auth){
                if(!unMounted){
                dispatch(setAuth(data))}
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        return () => {
            setUnMounted(true)
        }
    }, [])
    return loading ? <Loader message="Activation in Progress"/>: (
        <div className='flex items-center justify-center mt-24'>
            <Card title={`Okay, ${name}!`} icon="monkey-emoji">
                <p className='text-inherit align-center mb-5'>How's this photo?</p>
                <div className='w-28 h-28 border-4 border-sky-700 rounded-full flex items-center justify-center overflow-hidden'>
                    <img src={image} alt="avatar image" className='h-full w-full object-cover' />
                </div>
                <div>
                    <label htmlFor="avatarInput" className='text-sky-700 my-7 mx-0 inline-block cursor-pointer'>Choose a different photo</label>
                    <input type="file" className='hidden' id="avatarInput" onChange={captureImage} />
                </div>

                <div className='mt-3.5'>
                    <Button text="Next" onClick={submit} />
                </div>
            </Card>

        </div>)
}

export default StepAvatar
