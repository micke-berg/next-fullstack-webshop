import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
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
				products: action.payload,
				error: '',
			};
		case 'FETCH_FAIL':
			return {
				...state,
				error: action.payload,
			};
		default:
			return state;
	}
}

const AdminproductsScreen = () => {
	const [{ loading, error, products }, dispatch] = useReducer(reducer, {
		loading: true,
		products: [],
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/admin/products');
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, []);

	return (
		<Layout title="Admin products">
			<div className="grid md:grid-cols-4 gap-5">
				<div>
					<ul>
						<li>
							<Link className="hover-link" href="/admin/dashboard">
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/admin/orders" className="hover-link">
								Orders
							</Link>
						</li>
						<li>
							<Link className="hover-link font-normal" href="/admin/products">
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
					<h1 className="mb-4 text-xl">Products</h1>
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div className="alert-error">{error}</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="border-b">
									<tr>
										<th className="text-left pl-0">ID</th>
										<th className="text-left p-5">NAME</th>
										<th className="text-left p-5">PRICE</th>
										<th className="text-left p-5">CATEGORY</th>
										<th className="text-left p-5">BRAND</th>
										<th className="text-left p-5">COUNT</th>
										<th className="text-left p-5">RATING</th>
										<th className="text-left p-5">ACTIONS</th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr key={product._id} className="border-b">
											<td className="p-5">{product._id.substring(20, 24)}</td>
											<td className="p-5">{product.name}</td>
											<td className="p-5">{product.price}</td>
											<td className="p-5">{product.category}</td>
											<td className="p-5">{product.brand}</td>
											<td className="p-5">{product.countInStock}</td>
											<td className="p-5">{product.rating}</td>
											<td className="p-5">
												<Link
													href={`/admin/product/${product._id}`}
													className="text-blue-600"
												>
													Edit
												</Link>
												&nbsp; &nbsp;
												<button className="font-normal">Delete</button>
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

AdminproductsScreen.auth = { adminOnly: true };
export default AdminproductsScreen;
