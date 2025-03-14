import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "./Button"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
export function User({ iduser }) {
    const [user, setUser] = useState([])
    const [filter, setFilter] = useState("")
    useEffect(() => {
        const fetchuser = async () => {
            const res = await axios.get(`${BACKEND_URL}/api/v1/user/bulk?filter=` + filter);
            setUser(res.data.user);
        }
        fetchuser();
    }, [filter])
    return <div>
        <div className=" flex flex-col font-medium text-xl px-10 ">
            <div >Users</div>

            <input onChange={(e) => {
                setFilter(e.target.value)
            }} className="border-2 my-2 rounded border-slate-400 lg:w-1/3 p-1.5" type="text" placeholder="Search users..." />
            <div>
                {user.map((u, index) =>
                    u.id != iduser ? <Userbar key={index} user={u} /> : null
                )}
            </div>
        </div>
    </div>
}

function Userbar({ user }) {
    const [curr, setCurr] = useState("INR")
    const nav = useNavigate();
    return <div className="p-1.5 flex flex-col gap-2 lg:flex lg:flex-row justify-between lg:items-center">
        <div className="flex items-center">
            <button className="border-2  rounded-full bg-slate-200 font-medium size-12 ">{user.firstName[0]}</button>
            <div className="font-medium text-xl pl-1.5 flex gap-2"> <div>{user.firstName}</div><div>{user.lastName}</div> </div>
        </div>
        <div className="flex gap-3 items-center justify-between lg:">


            <Currency curr={curr} onChange={(e) => {
                setCurr(e.target.value)
            }} />

            <Button onclicking={
                () => {
                    nav(`/send?id=${user.id}&name=${user.firstName}&curr=${curr}`)
                }
            } label="Send" />
            
        </div>
        <hr className="block lg:hidden h-px my-1 bg-gray-200 border-0 "/>

    </div>
}
function Currency({ onChange, curr }) {
    return <div>
        <form className="max-w-sm mx-auto">
            <select value={curr} onChange={onChange} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block lg:w-full p-2.5 ">
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
            </select>
        </form>
    </div>
}