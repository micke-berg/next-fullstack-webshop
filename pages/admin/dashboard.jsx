import axios from 'axios';
import Link from 'next/link';
import React, { useReducer } from 'react';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Bar } from 'react-chartjs-2';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
	},
};

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {
				...state,
				loading: true,
				error: '',
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				summary: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return {
				...state,
				loading: false,
				error: action.payload,
			};
	}
}

const AdminDashboardSceen = () => {
	const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
		loading: true,
		summary: { salesData: [] },
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/admin/summary');
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, []);

	const data = {
		labels: summary.salesData.map((x) => x._id),
		datasets: [
			{
				label: 'Sales',
				backgroundColor: 'rgba(162, 222, 208, 1',
				data: summary.salesData.map((x) => x.totalSales),
			},
		],
	};

	return (
		<Layout title="Admin dashboard" background="bg-neutral-100">
			<div className="grid md:grid-cols-4 gap-5">
				<div>
					<ul>
						<li>
							<Link href="/admin/dashboard" className="font-bold">
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/admin/orders" className="font-bold">
								Orders
							</Link>
						</li>
						<li>
							<Link href="/admin/products" className="font-bold">
								Products
							</Link>
						</li>
						<li>
							<Link href="/admin/users" className="font-bold">
								Users
							</Link>
						</li>
					</ul>
				</div>
				<div className="md:col-span-3">
					<h1 className="mb-4 text-xl">Admin Dashboard</h1>
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div className="alert-error">{error}</div>
					) : (
						<div>
							<div className="grid gird-cols-1 md:grid-cols-4 gap-5 mb-5">
								<div className="p-5 bg-white">
									<p className="text-3xl">$ {summary.ordersPrice}</p>
									<p>Sales</p>
									<Link className="text-blue-600" href="/admin/orders">
										View sales
									</Link>
								</div>
								<div className="p-5 bg-white">
									<p className="text-3xl">$ {summary.ordersCount}</p>
									<p>Orders</p>
									<Link className="text-blue-600" href="/admin/orders">
										View orders
									</Link>
								</div>
								<div className="p-5 bg-white">
									<p className="text-3xl">$ {summary.productsCount}</p>
									<p>Products</p>
									<Link className="text-blue-600" href="/admin/products">
										View products
									</Link>
								</div>
								<div className="p-5 bg-white">
									<p className="text-3xl">$ {summary.usersCount}</p>
									<p>Users</p>
									<Link className="text-blue-600" href="/admin/users">
										View users
									</Link>
								</div>
							</div>
							<h2 className="text-xl">Sales Report</h2>
							<Bar
								options={{
									legend: { display: true, position: 'right' },
								}}
								data={data}
							/>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

AdminDashboardSceen.auth = { adminOnly: true };
export default AdminDashboardSceen;