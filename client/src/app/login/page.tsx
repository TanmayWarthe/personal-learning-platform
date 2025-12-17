"use client";

import { useState } from "react";



export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 
    function HandleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(email , password)
    }
    return (
    <div className="vh-screen flex justify-center items-center max-w-5xl mx-auto px-6 py-8 md:-8">

        <form onSubmit={HandleSubmit}>

        <div className="email">
            <h3>Email : </h3>
            <input 
            className="border rounded-md mt-2.5 mb-4"
            type="email" 
            onChange={ (e)=>{setEmail(e.target.value)}}
            name="email"  />
        </div>
        <div className="password">
            <h3>Password : </h3>
            <input 
            className="border rounded-md mt-2.5 mb-4"
            type="password"
            onChange={ (e)=>{setPassword(e.target.value)}}
            name="password" />
        </div>
        <div className="btn">
            <input 
            className="border rounded-2xl mt-5 pt-1.5 pl-5 pr-5 pb-1.5 "
            type="submit" 
            value="Login"
            />
        </div>

        </form>
     
    </div>
  );
}
