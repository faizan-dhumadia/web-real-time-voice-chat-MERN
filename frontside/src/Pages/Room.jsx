import React, { useState, useEffect } from 'react'
import { useWebRTC } from '../hooks/useWebRTC'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getRoom } from '../http'

const Room = () => {
    const { id: roomId } = useParams()
    const [room, setRoom] = useState(null)
    const [isMute, setIsMute] = useState(true)
    const user = useSelector(state => state.auth.user);
    const { client, provideRef, handleMute } = useWebRTC(roomId, user);
    const navigate = useNavigate();
    const handleManualLeave = () => {
        navigate('/rooms')
    }

    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            setRoom((prev) => data)
        }
        fetchRoom();
    }, [roomId])
    useEffect(() => {
        console.log(isMute);
        handleMute(isMute, user.id)
    }, [isMute])

    const handleMuteClick = (clientId) => {
        console.log(clientId);
        if (clientId !== user.id) {
            return;
        }
        setIsMute((prev) => !prev)
    }
    return (
        <div className=''>
            <div className="m-3 ml-7">
                <button onClick={handleManualLeave} className='flex items-center justify-center '>
                    <img src="/images/arrow-left.png" className='mr-2' alt="" />
                    <span className='border-b-2 border-blue-700'>All voice rooms</span>
                </button>
            </div>
            <div className='mt-3 pt-5 pl-3 bg-gray-800 rounded-t-3xl min-h-screen'>
                <div className='flex justify-between'>
                    <h1 className='font-bold text-xl pl-3 '>
                        {room?.topic}
                    </h1>
                    <div className='flex justify-center items-center'>
                        <button className='bg-gray-700 rounded-2xl px-3 py-1'><img src="/images/palm.png" alt="" /></button>
                        <button onClick={handleManualLeave} className='flex items-center justify-center mx-3 bg-gray-700 rounded-2xl px-3 py-1 '><img src="/images/win.png" alt="" className='mr-2' /><span>
                            Leave <span className='hidden md:inline-block'> Quietly</span></span></button>
                    </div>
                </div>
                <div className='flex  items-start gap-5 mt-5'>
                    {client.map((client) => {
                        return (
                            <div key={client.id} className='flex flex-wrap items-center flex-col '>
                                <div className="w-20 h-20 rounded-full border-4 border-yellow-600 relative font-bold mt-2">
                                    <img
                                        className='w-full h-full border-[50%] rounded-full'
                                        src={client.avatar}
                                        alt=''
                                    />
                                    <audio
                                        ref={(instance) => provideRef(instance, client.id)}
                                        // controls
                                        autoPlay />
                                    <button
                                        className='absolute bottom-0 right-0 w-7 h-7 box-content rounded-xl p-1 '
                                        onClick={() => handleMuteClick(client.id)}>
                                        {client.muted ?
                                            (<img src="/images/mic-mute.png" alt="" />) :
                                            (<img src="/images/mic.png" alt="" />)}
                                    </button>
                                </div>
                                <h4 className='my-2'>{client.name}</h4>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Room
