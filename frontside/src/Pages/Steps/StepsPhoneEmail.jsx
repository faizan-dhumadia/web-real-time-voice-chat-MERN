import React, { useState } from 'react'
import Phone from './Phone';
import Email from './Email';


const phoneEmailMaps = {
    phone: Phone,
    email: Email
}
const StepsPhoneEmail = ({ onNext }) => {
    const [type, setType] = useState('phone');
    const Component = phoneEmailMaps[type];
    return (
        <>
            <div className=' items-center justify-center  '>
                <div >
                    <div className='flex items-center justify-end md:w-[73%] w-[95%] '>
                        <button className={`flex items-center justify-center w-14 h-14  rounded-lg ${type === 'phone' ? 'bg-sky-700' : 'bg-gray-900'}`} onClick={() => { setType('phone') }}> <img src="/images/phone-white.png" alt="phone" /> </button>
                        <button className={`flex items-center justify-center w-14 h-14  rounded-lg ml-5 ${type === 'email' ? 'bg-sky-700' : 'bg-gray-900'}`} onClick={() => { setType('email') }}> <img src="/images/mail-white.png" alt="email" /> </button>
                    </div>
                    <Component onNext={onNext} />
                </div>
            </div>
        </>
    )
}

export default StepsPhoneEmail
