'use client'

import { Inter } from "next/font/google";
import { twMerge } from 'tailwind-merge';

const inter = Inter({ subsets: ['latin'] });

function Input({ label, placeHolder, type = 'text', value, defaultValue, disabled, onChange, hasError, hasSuccess, className, classDiv, ...props }) {
    return (
        <div className={`flex max-lg:flex-col 2xl:flex-col w-full justify-between items-center ${label ? 'gap-2 ' : ''} ${disabled && 'opacity-60'} ` + classDiv}>
            {
                label && (
                    <label className={
                        hasError ? 'text-vermelho' : 
                        hasSuccess ? 'text-green-600' : 'text-cinza_texto font-medium dark:text-white w-full'
                    }>{label}</label>
                )
            }
            <input
                disabled={disabled}
                type={type} 
                placeholder={placeHolder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                className={twMerge( 'w-full appearance-none bg-cinza_medio dark:bg-noturno_medio_claro  px-4 py-3 rounded-[10px] border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[15px] font-medium placeholder:text-cinza dark:text-white placeholder:text-[15px] placeholder:font-medium', inter.className,
                    hasError ? 'border-vermelho text-vermelho placeholder:text-vermelho' : 
                    hasSuccess ? 'border-green-600 text-green-600 placeholder:text-green-600' :
                    'border-cinza dark:border-none', className    )}
                {...props}
            />
        </div>
    );
}

export default Input;
