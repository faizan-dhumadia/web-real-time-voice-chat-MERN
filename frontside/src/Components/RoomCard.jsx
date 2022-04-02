import React from 'react'

import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {

    let navigate = useNavigate();
    return (
        <div onClick={() => { navigate(`/room/${room.id}`) }} className='bg-neutral-800 p-5 rounded-xl cursor-pointer m-2 w-full md:min-w-[20%] md:max-w-[23%] flex-wrap overflow-hidden '>
            <h3>
                {room.topic}
            </h3>
            <div className={`flex items-center relative mx-5 my-0 ${room.speakers.length === 1 ? 'flex-initial' : ''}`}>
                <div >
                    {room.speakers.map((speaker) => (
                        <img key={speaker.id} src={speaker.avatar} alt="speaker avatar"
                            className={`w-10 h-10 rounded-full object-cover border-2 absolute`}
                        />
                    ))}
                </div>
                <div className='ml-20'>
                    {room.speakers.map((speaker) => (
                        <div key={speaker.id} >
                            <span className='pb-1 inline-block mr-1'>{speaker.name}</span>
                            <img src="/images/chat-bubble.png" alt="Chart-bubble" className='inline' />
                        </div>
                        // <img src={speaker.avatar} alt="speaker avatar" />
                    ))}

                </div>
            </div>
            <div className='text-right mr-1 font-bold'>
                <span>{room.totalPeople}</span>
                <img src="/images/user-icon.png" alt="User icon" className='inline ml-2' />
            </div>
        </div>
    )
}

export default RoomCard
