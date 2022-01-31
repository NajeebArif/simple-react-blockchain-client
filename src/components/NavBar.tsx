import React from "react";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <div id="nav-bar">
      <nav className="bg-gradient-to-r from-slate-900  hover:bg-gradient-to-l hover:text-black text-white font-bold rounded-b shadow flex flex-row">
        <NavLink href="#">Home</NavLink>
        <NavLink href="#">Transactions</NavLink>
        <NavLink href="#">Blockchain</NavLink>
      </nav>
    </div>
  );
}

type NavProps = {
  cssClasses?: string;
  href?: string
};

const NavLink: React.FC<NavProps> = (props) => {
  const css = "hover:bg-gray-500 hover:rounded-b block p-3";
  return (
    <>
      <a
        className={!!props.cssClasses ? props.cssClasses : css}
        href={!!props.href ? props.href : "#"}
      >
        {props.children}
      </a>
    </>
  );
};
