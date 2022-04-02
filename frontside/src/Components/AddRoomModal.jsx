import React, { useState } from 'react'
import TextInput from './TextInput'
import { createRoom as create } from '../http/'
import { useNavigate } from "react-router-dom";

const AddRoomModal = ({ onClose }) => {

    let navigate = useNavigate();
    const [roomType, setRoomType] = useState('open')
    const [topic, setTopic] = useState('')

    async function createRoom() {
        try {
            if (!topic) return
            const { data } = await create({ topic, roomType })
            navigate(`/room/${data.id}`)
            console.log("RoomCreate:", data);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-black/[.6] flex justify-center items-center'>
            <div className=' min-w-[90%]  max-w-[50%] md:max-w-[45%] md:min-w-[35%] bg-zinc-700 rounded-3xl  relative '>
                <button className='absolute top-2 right-2 ' onClick={onClose}><img src="/images/close.png" alt="close    " /></button>
                <div className='p-7 border-b-4 border-gray-900'>
                    <h3 className='mb-1 text-xl font-bold text-center'>Enter the topic to discussed</h3>
                    <TextInput fullwidth="true" value={topic} onChange={(e) => setTopic(e.target.value)} />
                    <h2 className='my-2 text-lg text-center'>Room Types</h2>
                    <div className='grid grid-cols-2 gap-2'>
                        <div onClick={() => setRoomType('open')} className={`flex flex-col items-center  p-3 rounded-xl cursor-pointer ${roomType === 'open' ? 'bg-zinc-800' : ''}`}>
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        {/* <div onClick={() => setRoomType('social')} className={`flex flex-col items-center  p-3 rounded-xl cursor-pointer ${roomType === 'social' ? 'bg-zinc-800' : ''}`}>
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div> */}
                        <div onClick={() => setRoomType('private')} className={`flex flex-col items-center  p-3 rounded-xl cursor-pointer ${roomType === 'private' ? 'bg-zinc-800' : ''}`}>
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className='p-7 text-center'>
                    <h2 className='mb-5 font-bold text-xl'>
                        Start a room, open to everyone
                    </h2>
                    <button onClick={createRoom} className='bg-green-600 flex items-center justify-center py-2 px-2 rounded-3xl my-0 mx-auto w-52 hover:bg-green-700'><img src="/images/celebration.png" alt="celebration" /><span className='ml-1 font-bold'>
                        Let's Go
                    </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddRoomModal
