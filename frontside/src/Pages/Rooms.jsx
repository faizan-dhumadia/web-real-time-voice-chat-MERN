import React, { useState ,useEffect} from 'react'
import AddRoomModal from '../Components/AddRoomModal';
import RoomCard from '../Components/RoomCard'
import { getAllRooms } from '../http';

const Rooms = () => {
    const [showModal, setShowModal] = useState(false)
    const [rooms, setRooms] = useState([])
    useEffect(() => {
        const fetchRooms = async ()=>{
            const {data} = await getAllRooms();
            setRooms(data)
            console.log("data:" ,data);
        }
        fetchRooms();
    }, [])
    function openModal() {
        setShowModal(true)
    }
    // const rooms = [
    //     {
    //         id: 1,
    //         topic: 'Which framework best for frontend ?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 3,
    //         topic: 'What’s new in machine learning?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 4,
    //         topic: 'Why people use stack overflow?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    //     {
    //         id: 5,
    //         topic: 'Artificial inteligence is the future?',
    //         speakers: [
    //             {
    //                 id: 1,
    //                 name: 'John Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //             {
    //                 id: 2,
    //                 name: 'Jane Doe',
    //                 avatar: '/images/monkey-avatar.png',
    //             },
    //         ],
    //         totalPeople: 40,
    //     },
    // ];
    return (
        <div className=''>
            <div className='flex items-center justify-between mx-5 my-0'>
                <div className='flex items-center justify-center'>
                    <span className='flex items-center justify-center font-bold text-xl mb-3 text-center'>All voice room</span>
                    {/* <div className='bg-neutral-800 ml-1 flex items-center py-0 px-2.5 rounded-2xl'>
                        <img src="/images/search-icon.png" alt="search" />
                        <input type="text" name="" id="" className=' bg-transparent outline-none p-2.5 w-full' />
                    </div> */}
                </div>
                <div>
                    <button onClick={openModal} className='flex items-center bg-sky-400 py-1.5 px-3.5 rounded-full hover:bg-sky-900'><img src="/images/add-room-icon.png" alt="add-room" />
                    <span className='font-bold text-base ml-2.5 hidden md:block'>Start a room</span>
                    </button>
                </div>
            </div>
            <div className='flex flex-wrap m-2 '>
                {rooms.map((room) =>(<RoomCard key={room.id} room={room} /> ))}
            </div>
            {showModal && <AddRoomModal onClose={()=> setShowModal(false)}/>}
        </div>
    )
}

export default Rooms
