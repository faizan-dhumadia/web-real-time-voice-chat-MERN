import React from 'react'
import Card from '../../Components/Card'
import Button from '../../Components/Button'
import TextInput from '../../Components/TextInput'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setName } from '../../store/activateSlice'

const StepName = ({ onNext }) => {
    const dispatch = useDispatch()
    const { name } = useSelector((state) => state.activate)
    const [fullname, setFullname] = useState(name)
    function nextStep() {
        if (!fullname) {
            return
        }
        dispatch(setName(fullname))
        onNext()
    }
    return (
        <div className='flex items-center justify-center mt-24 text-center'>
            <Card title="What's your full name" icon="goggle-emoji">
                <TextInput value={fullname} onChange={(e) => setFullname(e.target.value)} />

                <div>
                    <p className='w-3/4 my-0 mx-auto mt-5 text-current'>
                        People use real name at Let's Talk
                    </p>
                </div>
                <div className='mt-3.5'>
                    <Button text="Next" onClick={nextStep} />
                </div>
            </Card>

        </div>
    )
}

export default StepName
