import React from 'react'

const TextInput = (props) => {
    return (
        <div>
            <input style={{width: props.fullwidth === 'true'?'100%':''}} className='bg-zinc-800 px-5 py-2 w-48 rounded-md outline-none' type="text" {...props} />
        </div>
    )
}

export default TextInput
