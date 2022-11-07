import Link from 'next/link';
import React from 'react';

const DropdownLink = (props) => {
	const { href, children, ...rest } = props;
	return (
		<Link legacyBehavior href={href}>
			<a {...rest}>{children}</a>
		</Link>
	);
};

export default DropdownLink;
