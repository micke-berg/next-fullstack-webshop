import { ArrowLeftIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import { Store } from '../../utils/Store';

const ProducScreen = () => {
	const { state, dispatch } = useContext(Store);
	const router = useRouter();
	const { query } = useRouter();
	const { slug } = query;
	const product = data.products.find((x) => x.slug === slug);
	if (!product) {
		return <div>Product not found</div>;
	}

	const addToCartHandler = () => {
		const existItem = state.cart.cartItems.find(
			(item) => item.slug === product.slug
		);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
		router.push('/cart');

		if (product.countInStock < quantity) {
			alert('Sorry. Product is out of stock');
			return;
		}
	};

	return (
		<Layout title={product.name}>
			<div className="py-2">
				<Link href="/">
					<a className="flex items-center">
						<ArrowLeftIcon className="h-5 w-5 mr-1" />
						back to products
					</a>
				</Link>
			</div>
			<div className="grid md:grid-cols-4 md:gap-3">
				<div className="md:col-span-2">
					<Image
						src={product.image}
						alt={product.name}
						width={640}
						height={640}
						layout="responsive"
					></Image>
				</div>
				<div>
					<ul>
						<li>
							<h1 className="text-lg">{product.name}</h1>
						</li>
						<li>Category: {product.category}</li>
						<li>{product.brand}</li>
						<li>
							{product.rating} of {product.numReviews} reviews
						</li>
						<li>{product.decription}</li>
					</ul>
				</div>
				<div>
					<div className="card p-5">
						<div className="mb-2 flex justify-between">
							<div>Price</div>
							<div>${product.price}</div>
						</div>
						<div className="flex mb-2 justify-between">
							<div>Status</div>
							<div>{product.countInStock > 0 ? 'In stock' : 'Unavailible'}</div>
						</div>
						<button
							className="primary-button w-full"
							onClick={addToCartHandler}
						>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ProducScreen;
