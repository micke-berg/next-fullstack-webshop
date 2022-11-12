import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { SlArrowLeft } from 'react-icons/sl';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';

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
				error: '',
			};
		case 'TETCH_FAIL':
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
}

const AdminProductEditScreen = () => {
	const { query, router } = useRouter();
	const productId = query.id;

	const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
		useReducer(reducer, {
			loading: true,
			error: '',
		});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm();

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/admin/products/${productId}`);
				dispatch({ type: 'FETCH_SUCCESS' });
				setValue('name', data.name);
				setValue('slug', data.slug);
				setValue('price', data.price);
				setValue('image', data.image);
				setValue('category', data.category);
				setValue('brand', data.brand);
				setValue('countInStock', data.countInStock);
				setValue('description', data.description);
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, [productId, setValue]);

	const submitHandler = async ({
		name,
		slug,
		price,
		image,
		category,
		brand,
		countInStock,
		decription,
	}) => {
		try {
			dispatch({ type: 'UPDATE_REQUEST' });
			await axios.put(`/api/admin/products/${productId}`, {
				name,
				slug,
				price,
				image,
				category,
				brand,
				countInStock,
				decription,
			});
			dispatch({ type: 'UPDATE_SUCCESS' });
			toast.success('Product uptated successfully');
			router.push('/admin/products');
		} catch (err) {
			dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
			toast.error(getError(err));
		}
	};

	return (
		<Layout title={`Edit product ${productId}`}>
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
				<div className="md:col-span-3">
					{loading ? (
						<div>Loading...</div>
					) : error ? (
						<div className="alert-error">{error}</div>
					) : (
						<form
							className="mx-auto max-w-screen-md"
							onSubmit={handleSubmit(submitHandler)}
						>
							<h1 className="mb-4 text-xl">{`Edit product: ${productId}`}</h1>
							<div className="mb-4">
								<label htmlFor="name">Name</label>
								<input
									id="name"
									type="text"
									autofocus
									placeholder="Name"
									autoFocus
									className="w-full mt-1 mt-1"
									{...register('name', {
										required: 'Please enter name',
									})}
								/>
								{errors.name && (
									<div className="text-red-500">{errors.name.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="slug">Slug</label>
								<input
									id="slug"
									type="text"
									placeholder="Slug"
									className="w-full mt-1"
									{...register('slug', {
										required: 'Please enter slug',
									})}
								/>
								{errors.slug && (
									<div classNme="text-red-500">{errors.name.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="price">Price</label>
								<input
									id="price"
									type="text"
									placeholder="Price"
									className="w-full mt-1"
									{...register('price', {
										required: 'Please enter price',
									})}
								/>
								{errors.price && (
									<div className="text-red-500">{errors.price.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="imageUrl">Image Url</label>
								<input
									id="imageUrl"
									type="text"
									placeholder="Image url"
									className="w-full mt-1"
									{...register('image', {
										required: 'Please enter image url',
									})}
								/>
								{errors.image && (
									<div className="text-red-500">{errors.image.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="category">Category</label>
								<input
									id="category"
									type="text"
									placeholder="Category"
									className="w-full mt-1"
									{...register('category', {
										required: 'Please enter category',
									})}
								/>
								{errors.category && (
									<div className="text-red-500">{errors.category.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="brand">Brand</label>
								<input
									id="brand"
									type="text"
									placeholder="Brand"
									className="w-full mt-1"
									{...register('brand', {
										required: 'Please enter brand',
									})}
								/>
								{errors.brand && (
									<div className="text-red-500">{errors.brand.message}</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="countInStock">Count in stock</label>
								<input
									id="countInStock"
									type="text"
									placeholder="Count in stock"
									className="w-full mt-1"
									{...register('countInStock', {
										required: 'Please enter countInStock',
									})}
								/>
								{errors.countInStock && (
									<div className="text-red-500">
										{errors.countInStock.message}
									</div>
								)}
							</div>
							<div className="mb-4">
								<label htmlFor="description">Description</label>

								<input
									id="description"
									type="text"
									placeholder="Description"
									className="w-full mt-1"
									{...register('description', {
										required: 'Please enter description',
									})}
								/>
								{errors.description && (
									<div className="text-red-500">
										{errors.description.message}
									</div>
								)}
							</div>
							<div className="mb-4">
								<button
									disabled={loadingUpdate}
									className="primary-button w-full md:w-1/6"
								>
									{loadingUpdate ? 'Loading' : 'Update'}
								</button>
							</div>
							<div className="mb-4">
								<Link
									href={`/admin/products`}
									className="secondary-button flex w-full md:w-1/6 justify-center"
								>
									Back
								</Link>
							</div>
						</form>
					)}
				</div>
			</div>
		</Layout>
	);
};

AdminProductEditScreen.auth = { adminOnly: true };

export default AdminProductEditScreen;
