import { ClassAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from "react"

export const Submit: React.FC<{ disabled: boolean }> = 
({ disabled, children}) =>{
    return (
        <button type='submit' disabled={disabled} 
        className="shadow rounded p-1
        transition ease-in-out delay-150 bg-slate-500 hover:-translate-y-1 hover:scale-y-110 hover:bg-slate-800 duration-300 
        text-white">
            {children}
        </button>
    )
}

export const Button = 
    (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>) =>{
    return (
        <button type='button' {...props}
        className="shadow rounded p-1
        transition ease-in-out delay-150 bg-slate-500 hover:-translate-y-1 hover:scale-y-110 hover:bg-slate-800 duration-300 
        text-white">
            {props.children}
        </button>
    )
}

export const Input = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) =>{
    return (
        <input className="shadow-inner border-2 rounded p-1" {...props}/>
    )
}

// className="shadow 
// bg-gradient-to-r from-slate-900  hover:bg-gradient-to-l hover:text-black 
// text-white"