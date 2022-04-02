import React from 'react'

const Card = ({title, icon,children}) => {
    return (
        <div className='min-w-[80%]  max-w-[85%] md:max-w-[45%] md:min-w-[35%] p-7 rounded-2xl m-2  bg-slate-800 flex flex-col justify-center items-center'>
            <div className='flex items-center justify-center mb-7'>
                {icon && <img src={`/images/${icon}.png`} alt="logo"/>}
                {title && <h1 className='text-2xl font-bold ml-2 text-center'>{title}</h1>}
            </div>
            {children}
            
        </div>
    )
}

export default Card
