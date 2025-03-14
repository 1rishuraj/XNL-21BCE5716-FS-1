import {Heading} from '../components/Heading'
import {Inputbox} from '../components/Inputbox'
import {Button} from '../components/Button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
export function Send(){
    const [load,setLoad]=useState(false);
    const [money,setMoney]=useState(0.0);
    const [naam,setNaam]=useState("");
    const [to,setTo]=useState(0)
    const [curr,setCurr]=useState("INR")
    const [rate,setRate]=useState(1.0)
    const nav=useNavigate()
    useEffect(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        setNaam(searchParams.get('name')); 
        setTo(Number(searchParams.get('id')));
        const currency=searchParams.get('curr')||"INR";
        setCurr(currency)
        if(currency!="INR"){
            const fetchExchangeRate = async () => {
                try {
                    const res = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=cb00a8c433bbc3e5f6074d9e1948f43e`);
                    
                    if (res.data.rates["INR"]) {
                        var newRate = parseFloat(res.data.rates["INR"]); 
                        if(currency=="USD"){
                        var eur2usd=parseFloat(res.data.rates["USD"]);
                        var temp=parseFloat(newRate/eur2usd);
                        newRate =temp;
                        }
                        setRate(newRate);
                        console.log(`Exchange Rate for ${currency}:`, newRate);
                    }
                    else {
                        console.warn(`Exchange rate for ${currency} not found.`);
                    }
                    
                } catch (error) {
                    console.error("Error fetching exchange rate:", error);
                }
            };
            fetchExchangeRate(); // Call the function
        }
        
        
    },[])
    
    return <div className="bg-slate-200 flex justify-center items-center h-screen">
        <div className="bg-white w-2/3 lg:w-1/5 h-9/19 rounded-2xl py-5 px-4">
            <div className='flex flex-col justify-center items-center'>
                <Heading label="Send Money"/>
            </div>
            <div className='py-3'>
            <Friendbar name={naam}/>
            <Inputbox onwrite={(e)=>{
              const final=Number(e.target.value)*rate;
              console.log(final)
              setMoney(final);

            }} label={`Amount (in ${curr})`} placeholder="Enter amount" />
            </div>
            <Button onclicking={
                
                    async function() {
                        setLoad(true);
                        try{
                        const res= await axios.post(`${BACKEND_URL}/api/v1/account/transfer`,
                            {
                                amount:money,
                                to:to
                            },
                            {
                                headers:{
                                    Authorization: "Bearer "+localStorage.getItem("token")
                                },
                            },
                        ); 
                        setLoad(false)
                        toast(res.data.message);
                        nav("/dashboard");
                        console.log(res.data)   
                        }catch(e){
                            setLoad(false)
                            toast.error(e.response.data.message);
                        }
                }
                  
            } label={load?"Sending...":"Initiate Transfer"}/>
        </div>
    </div>
}
function Friendbar({name}){
    return <div className="pt-10 flex justify-between items-center">
    <div className="flex items-center">
    <button className="border-2  rounded-full bg-slate-200 font-medium size-12 ">{name[0]}</button>
    <div className="font-medium text-xl pl-1.5 "> <div>{name}</div> 
    </div>
    </div>
</div>
}