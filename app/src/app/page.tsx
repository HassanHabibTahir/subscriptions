"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();
  const userId =  localStorage.getItem("user");
  useEffect(() => {
    console.log("userId: " + userId);
    if(userId){
      push("/subscription")
    }else{

      push('/signup');
    }

  },[push,userId]);
  return (
<div></div>
  );
}
