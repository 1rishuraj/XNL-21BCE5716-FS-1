export function Inputbox({label,placeholder,onwrite}){
    return <div className="font-medium py-1.5 ">
        <div>{label}</div>
        <div>
        <input onChange={onwrite} className="border-2 border-slate-400 rounded w-full" type="text" placeholder={placeholder}/>
        </div>
    </div>
}