import { useEffect, useState } from "react"
import axios from "axios"
import { Balance } from "../components/Balance";
import { Appbar } from "../components/Appbar";
import { User } from "../components/User";
import { BACKEND_URL } from '../config'

export function Dashboard(){
    const [balance, setBal] = useState(0.0); // Initialize as a formatted string
    const [ID,setID]=useState(0);
    useEffect( ()=>{
         // Fetch data immediately on first mount
        const fetchData = async () => {
            try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/account/balance`, {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            setBal(parseFloat(res.data.acc.balance).toFixed(2));
            setID(res.data.acc.userId);
            } catch (error) {
            console.error("Error fetching data:", error);
            }
        };
        fetchData();
        const intervalId = setInterval(async()=>{
            console.log(1)
            const res=await axios.get(`${BACKEND_URL}/api/v1/account/balance`,{
                headers:{
                    Authorization: "Bearer "+localStorage.getItem("token")
                }
            });
            setBal(parseFloat(res.data.acc.balance).toFixed(2));
            setID(res.data.acc.userId);
        }, 5000);
        return () => clearInterval(intervalId);
    },[])

   return <div>
    <Appbar/>
    <Balance value={balance}/>
    <User iduser={ID}/>
   </div>
}