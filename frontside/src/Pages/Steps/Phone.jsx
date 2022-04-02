import React, { useState } from 'react'
import Card from '../../Components/Card'
import Button from '../../Components/Button'
import TextInput from '../../Components/TextInput'
import { sendOtp } from '../../http'
import { useDispatch } from 'react-redux'
import { setOtp } from '../../store/authSlice'
const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();
    async function submit() {
        if (!phoneNumber) return;
        const { data } = await sendOtp({ phone: phoneNumber });
        dispatch(setOtp({ phone: data.phone, hash: data.hash }))


        console.log(data);
        onNext()
    }

    return (
        <div className='flex items-center justify-center mt-2'>
            <Card title="Enter your phone Number" icon="phone">
                <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                <div className='mt-3.5'>
                    <Button text="Next" onClick={submit} />
                </div>
                <div>
                    <p className='w-3/4 my-0 mx-auto mt-5 text-current text-center'>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </div>

            </Card>

        </div>
    )
}

export default Phone
