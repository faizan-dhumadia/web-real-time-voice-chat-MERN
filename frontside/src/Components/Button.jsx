import React from 'react'

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='bg-sky-700 px-2.5 py-3 flex rounded-xl items-center mx-0 my-auto ease-in-out duration-300 hover:bg-sky-900'>
            <span>{text}</span>
            <img src="/images/arrow-forward.png" alt="arrow" className='ml-2' />

        </button>
    )
}

export default Button
