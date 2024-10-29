import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({label,id,value,setState,className,...props}) => {
  return (
    <div className='flex flex-col mb-4 w-full'>
            <label htmlFor={id} className='text-sm font-semibold'>{label}</label>
            <input 
              type="text" 
              id={id} 
              className={twMerge("border-2 py-2 px-4 rounded-md mt-1 outline-none text-sm bg-gray-100 w-full",className)} 
              value={value} {...props}
              onChange={(e) => setState(e.target.value)} 
              required
            />
          </div>
  );
};

export default Input;