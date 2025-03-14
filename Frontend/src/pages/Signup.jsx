import {Heading} from '../components/Heading'
import {Subheading} from '../components/Subheading'
import {Inputbox} from '../components/Inputbox'
import {Button} from '../components/Button'
import {BottomWarning} from '../components/BottomWarning'
import { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../config'
export function Signup(){
  const nav=useNavigate();
    const [fname,setFname]=useState("");
    const [lname,setLname]=useState("");
    const [mail,setMail]=useState("");
    const [pass,setPass]=useState("");
    return <div className="bg-slate-400 flex justify-center items-center h-screen font-sans">
        <div className="bg-white w-2/3 lg:w-1/5 lg:h-9/13 rounded-2xl py-5 px-4">
            <div className='flex flex-col justify-center items-center'>
                <Heading label="Sign up"/>
                <Subheading label="Enter your information to create an account"/>
            </div>
            <div className='py-2.5'>
            <Inputbox onwrite={(e)=>{
              setFname(e.target.value);
            }} label="First Name" placeholder="John" />
            <Inputbox onwrite={(e)=>{
              setLname(e.target.value);
            }} label="Last Name" placeholder="Doe" />
            <Inputbox onwrite={(e)=>{
              setMail(e.target.value);
            }} label="Email" placeholder="rishuraj@gmail.com" />
            <Inputbox onwrite={(e)=>{
              setPass(e.target.value);
            }} label="Password" placeholder="123456" />
            </div>
            <Button onclicking={
                async function() {
                    const res= await axios.post(`${BACKEND_URL}/api/v1/user/signup`,
                        {
                            email:mail,
                            firstName:fname,
                            lastName:lname,
                            password:pass
                        }
                    );
                    localStorage.setItem("token",res.data.token);
                    nav("/signin");
                }
                

            } label="Sign up"/>
            <BottomWarning label="Already have an account?" linktext="Sign in" link="/signin"/>
        </div>
        
    </div>
}