import React, { useState } from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'
import TextInput from '../../Components/TextInput'
import { useSelector,useDispatch } from 'react-redux'
import { verifyOtp } from '../../http'
import { setAuth } from '../../store/authSlice'

const StepOtp = ({ onNext }) => {
    const [otp, setOtp] = useState('')
    const { phone, hash } = useSelector((state) => state.auth.otp)

    const dispatch = useDispatch()
    async function submit() {
        if(!phone || !otp || !hash) return;
        try {
            const { data } = await verifyOtp({ otp, phone, hash })
            console.log(data);
            dispatch(setAuth(data))
            // onNext()
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='flex items-center justify-center mt-24 text-center'>
            <Card title="Enter the code we just texted you" icon="lock-emoji">
                <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />

                <div className='mt-3.5'>
                    <Button text="Next" onClick={submit} />
                </div>
                <div>
                    <p className='w-3/4 my-0 mx-auto mt-5 text-current'>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </div>
            </Card>

        </div>
    )
}

export default StepOtp
