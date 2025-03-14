import {Heading} from '../components/Heading'
import {Subheading} from '../components/Subheading'
import {Inputbox} from '../components/Inputbox'
import {Button} from '../components/Button'
import {BottomWarning} from '../components/BottomWarning'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../config'

export function Signin(){
    const [mail,setMail]=useState("");
    const [pass,setPass]=useState("");
    const nav=useNavigate()
    return <div className="bg-slate-400 flex justify-center items-center h-screen">
        <div className="bg-white w-2/3 lg:w-1/5 rounded-2xl py-5 px-4">
            <div className='flex flex-col justify-center items-center'>
                <Heading label="Sign in"/>
                <Subheading label="Enter your credentials to access your account"/>
            </div>
            <div className='py-2.5'>
            <Inputbox onwrite={(e)=>{
              setMail(e.target.value);
            }} label="Email" placeholder="rishuraj@gmail.com" />
            <Inputbox onwrite={(e)=>{
              setPass(e.target.value);
            }} label="Password" placeholder="123456" />
            </div>
            <Button onclicking={
                async function() {
                    const res= await axios.post(`${BACKEND_URL}/api/v1/user/signin`,
                        {
                            email:mail,
                            password:pass
                        }
                    );
                    localStorage.setItem("token",res.data.token);
                    nav("/dashboard");
                }
                

            } label="Sign in"/>
            <BottomWarning label="Don't have an account?" linktext="Sign up" link="/signup"/>
        </div>
        
    </div>
}