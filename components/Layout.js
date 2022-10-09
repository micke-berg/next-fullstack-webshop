import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children, title }) => {
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
								<a className="p-2">Cart</a>
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
