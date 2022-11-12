import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import { useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

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
				orders: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
}

const AdminOrderScreen = () => {
	const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
		loading: true,
		orders: [],
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/admin/orders');
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
				toast.error(getError(err));
			}
		};
		fetchData();
	}, []);

	console.log('orders', orders);

	return (
		<Layout title="Admin Dachboard">
			<div className="grid md:grid-cols-4 gap-5">
				<div>
					<ul>
						<li>
							<Link className="hover-link" href="/admin/dashboard">
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/admin/orders" className="hover-link font-normal">
								Orders
							</Link>
						</li>
						<li>
							<Link className="hover-link" href="/admin/products">
								Products
							</Link>
						</li>
						<li>
							<Link className="hover-link" href="/admin/users">
								Users
							</Link>
						</li>
					</ul>
				</div>
				<div className="overflow-x-auto md:col-span-3">
					<h1 className="mb-4 text-xl">Admin Orders</h1>
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div className="alert-error">{error}</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full">
								<thead className="border-b">
									<tr>
										<th className="text-left pl-0">ID</th>
										<th className="text-left p-5">USER</th>
										<th className="text-left p-5">DATE</th>
										<th className="text-left p-5">TOTAL</th>
										<th className="text-left p-5">PAID</th>
										<th className="text-left p-5">DELIVERED</th>
										<th className="text-left p-5">ACTION</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => (
										<tr key={order._id} className="p-5">
											<td>{order._id.substring(20, 24)}</td>
											<td className="p-5">
												{order.user ? order.user.name : 'DELETED USER'}
											</td>
											<td className="p-5">
												{order.createdAt.substring(0, 10)}
											</td>
											<td className="p-5">${order.totalPrice}</td>
											<td className="p-5">
												{order.isPaid
													? `$ ${order.paidAt.substring(0, 10)}`
													: 'Not paid'}
											</td>
											<td className="p-5">
												{' '}
												{order.isDelivered
													? `${order.deliveredAt.substring(0, 10)}`
													: 'Not delivered'}
											</td>
											<td className="p-5">
												<Link
													className="pl-0 text-blue-600"
													href={`/order/${order._id}`}
												>
													Details
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

AdminOrderScreen.auth = { adminOnly: true };
export default AdminOrderScreen;
