export function Appbar(){
    return <div className="lg:flex justify-between items-center py-4 px-10 border-1 border-slate-400 rounded shadow-xl">
        <div className="font-extrabold text-3xl text-center lg:text-left">Payments App</div>
        <div className="hidden lg:block font-extrabold text-3xl ">
            Hello, User
            <button className="border-2 rounded-full bg-slate-200 font-medium size-12 ml-5">U</button>
        </div>
    </div>
}