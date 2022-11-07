/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const ProductItem = ({ product }) => {
	return (
		<div>
			<Link href={`/product/${product.slug}`}>
				<img src={product.image} alt={product.name} />
			</Link>
			<div className="flex flex-col items-center justify-center p-4 font-thin tracking-wide">
				<h2 className="text-md font-normal">{product.name}</h2>
				<p>{product.brand}</p>
				<p className="mb-2">$ {product.price}</p>
			</div>
		</div>
	);
};

export default ProductItem;
