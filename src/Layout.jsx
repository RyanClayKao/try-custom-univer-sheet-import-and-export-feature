import { Outlet } from "react-router";
import TopNav from "./TopNav";
import classes from "./Layout.module.css";

const Layout = () => {
	return (
		<div className={classes.layout}>
			<header className={classes.header}>
				<TopNav />
			</header>
			<main className={classes.main}>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
