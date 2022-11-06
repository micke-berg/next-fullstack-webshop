import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

const Unautorized = () => {
	const router = useRouter();
	const { message } = router.query;

	return (
		<Layout title="Unautorized Page">
			<h1>Access Denied</h1>
			{message && <div className="mb-4 text-red-500">{message}</div>}
		</Layout>
	);
};

export default Unautorized;
