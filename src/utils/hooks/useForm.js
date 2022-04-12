import { useState } from "react";

export function useForm() {

  const [values, setValues] = useState({
    wallet:'',
    escrowAddress:'',
    tokenAddress:'',
    approvedAddress:'',
    tokenId:'',
    nftId:'',
    amount: 100,
    returnNftId:''
  });

  const handleChange = (event) => {
    console.log(event)
    event.preventDefault()

    const { name, value } = event.target
    console.log(name)

    setValues({
      ...values,
      [name]: value
    })
  }

  return {handleChange, values}
  
}