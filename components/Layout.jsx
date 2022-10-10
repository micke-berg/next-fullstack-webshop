import Head from 'next/head';
import Link from 'next/link';
import { useContext } from 'react';
import { Store } from '../utils/Store';

const Layout = ({ children, title }) => {
	const { state, dispach } = useContext(Store);
	const { cart } = state;

	return (
		<>
			<Head>
				<title>{title ? `${title} Webshop` : 'Webshop'}</title>
				<meta name="description" content="Fullstack webshop" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex min-h-screen flex-col justify-between">
				<header>
					<nav className="flex h-12 px-4 justify-between items-center shadow-md">
						<Link href="/">
							<a className="text-lg font-bold">Webshop</a>
						</Link>
						<div>
							<Link href="/cart">
								<a className="p-2">
									Cart
									{cart.cartItems.length > 0 && (
										<span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
											{cart.cartItems.reduce(
												(prev, current) => prev + current.quantity,
												0
											)}
										</span>
									)}
								</a>
							</Link>
							<Link href="/login">
								<a className="p-2">Login</a>
							</Link>
						</div>
					</nav>
				</header>
				<main className="container m-auto mt-4 px-4">{children}</main>
				<footer className="flex justify-center items-center h-10 shadow-inner">
					Copyright &copy; 2022 Webshop
				</footer>
			</div>
		</>
	);
};

export default Layout;
