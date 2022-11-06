import React from 'react';

const CheckoutWizard = ({ activeStep = 0 }) => {
	return (
		<div className="mb-4 flex flex-wrap">
			{['User Login', 'Shipping Adress', 'Payment Method', 'Place Order'].map(
				(step, index) => (
					<div
						key={step}
						className={`flex-1 border-b-2 mb-2 pb-2 text-center ${
							index <= activeStep
								? 'border-black text-black'
								: 'border-gray-400 text-gray-400'
						}`}
					>
						{step}
					</div>
				)
			)}
		</div>
	);
};

export default CheckoutWizard;
