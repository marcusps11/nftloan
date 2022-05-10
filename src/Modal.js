import { useEffect, useState } from "react";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";

function Modal({
  approveEscrowForDeposit,
  depositNft,
  active,
  setModalOpen,
  values,
  handleChange,
  currentStep
}) {

//   const moveBackAStep = (e) => {
// 	  e.preventDefault()
//     if (currentStep !== 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };


  const moveToNextStep = () => {

  }

 
  const renderStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            approveEscrowForDeposit={approveEscrowForDeposit}
            handleChange={handleChange}
            values={values}
			active={active}
			setModalOpen={setModalOpen}
			moveToNextStep={moveToNextStep}
          />
        );
      case 2:
        return     <StepTwo
		depositNft={depositNft}
		handleChange={handleChange}
		values={values}
		active={active}
		setModalOpen={setModalOpen}

	  />
      case 3:
        return <h1>Helsdsdo</h1>;
      case 4:
        return <h1>Helsdsdo</h1>;

      default:
        return <h1>Hello</h1>;
    }
  };

  return (
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full ${
        active ? "" : "hidden"
      }`}
    >

      {renderStep(currentStep)}
    </div>
  );
}

export default Modal;
