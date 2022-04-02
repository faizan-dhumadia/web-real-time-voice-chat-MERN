import React from 'react'
import Button from '../Components/Button'
import Card from '../Components/Card'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigation = useNavigate();
    function startRegister() {
        navigation('/authenticate');
    }
    return (
        <div className='flex items-center justify-center text-center mt-24'>
            <Card title="Welcome to Let's Talk!" icon="logo">
                <p className='text-xl text-center mb-7 text-slate-200'>
                    {/* We’re working hard to get Codershouse ready for everyone!
                    While we wrap up the finishing youches, we’re adding people
                    gradually to make sure nothing breaks */}
                </p>
                <div>
                    <Button onClick={startRegister} text="Let's Talk" />
                </div>
                <div className='mt-5'>
                    <span>
                        Have an invite text?
                    </span>
                </div>
            </Card>

        </div>
    )
}

export default Home
