import { useState } from "react";


function Modal({approveEscrowForDeposit, handleChange, values, active, setModalOpen}) {

    return(
			<div id="defaultModal" tabindex="-1" aria-hidden="true" className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full ${active ? '': 'hidden'}`}>
				<div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
							<h3 className="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
								Please Approve the The NFT for ESCROW
							</h3>
							<button onClick={setModalOpen} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
							</button>
						</div>
						<div className="p-6 space-y-6">
						<input className='bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full' placeholder='Address to Approve' onChange={handleChange} value={values.approvedAddress} name="approvedAddress" type="text"></input>
					<input className='bg-white rounded-md border border-gray-200 p-3 focus:outline-none w-full' placeholder='Token Id' onChange={handleChange} value={values.tokenId} name="tokenId" type="text"></input>
						</div>
						<div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
							<button
							onClick={approveEscrowForDeposit}
							data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Approve</button>
						
						</div>
					</div>
				</div>
			</div>
	) 
  }

  export default Modal