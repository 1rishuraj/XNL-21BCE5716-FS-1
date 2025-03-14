import { useNavigate } from "react-router-dom"

export function BottomWarning({label,linktext,link}){
    const nav=useNavigate();
    return <div className="font-medium py-1.5 flex gap-1 flex-col lg:justify-center lg:flex-row">
        <div className="text-center lg:text-left">{label }</div>
        <h1 className="hover:cursor-pointer underline text-center lg:text-left" onClick={()=>{
            nav(link);
            // window.location.href=link;
        }}>{linktext}</h1>
    </div>
}