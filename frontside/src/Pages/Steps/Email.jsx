import React,{useState} from 'react'
import Card from '../../Components/Card'
import Button from '../../Components/Button'
import TextInput from '../../Components/TextInput'


const Email = ({onNext}) => {
    const [email, setEmail] = useState('')
    return (
        <div className='flex items-center justify-center mt-2'>
            <Card title="Enter your Email id" icon="email-emoji">
                <TextInput value={email} onChange={(e)=>setEmail(e.target.value)} />
                
                <div className='mt-3.5'>
                    <Button text="Next" onClick={onNext} />
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

export default Email
