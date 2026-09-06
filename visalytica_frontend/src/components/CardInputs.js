function CardInputs({ children }) {
    return ( 
        <div className='h-full w-full flex flex-col justify-between bg-cinza_claro rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-cinza'>
            {children}
        </div>
     );
}

export default CardInputs;