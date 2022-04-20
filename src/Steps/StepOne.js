import { useState } from "react";
import Layout from "./Layout";


function StepOne({approveEscrowForDeposit, handleChange, values, active, setModalOpen, moveToNextStep}) {

    const onSubmit = () => {
        approveEscrowForDeposit()
        moveToNextStep()
    }

    return(
        <Layout title="Please Approve NFT for Escrow" setModalOpen={setModalOpen} active={active} >

						<div className="p-6 space-y-6">
						<input className='bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full' placeholder='Address to Approve' onChange={handleChange} value={values.approvedAddress} name="approvedAddress" type="text"></input>
					<input className='bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full' placeholder='Token Id' onChange={handleChange} value={values.tokenId} name="tokenId" type="text"></input>
						</div>
						<div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
							<button
							onClick={onSubmit}
							data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Approve</button>
						
						</div>
            </Layout>
	) 
  }

  export default StepOne