import { useState } from "react";
import Layout from "./Layout";


function StepOne({depositNft, handleChange, values, active, setModalOpen, moveToNextStep}) {


    return(
        <Layout setModalOpen={setModalOpen} active={active} title="Deposit NFT">
        <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
        <input className='bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full' placeholder='Please enter the token Id' onChange={handleChange} value={values.nftId} name="nftId" type="text"></input>

            <button
            onClick={depositNft}
            data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Deposit NFT</button>
        
        </div>
        </Layout>

	) 
  }

  export default StepOne