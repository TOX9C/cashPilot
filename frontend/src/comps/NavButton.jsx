import { useLocation } from "react-router-dom";

const NavButton = ({ activeIcon, icon, name, link }) => {
  const active = useLocation().pathname == link ? true : false;
  console.log(active, link);

  return (
    <div>
      <div className="text-slate-600 flex items-center gap-1 text-[1.3rem] cursor-pointer ml-4 mt-3 ">
        {active ? activeIcon : icon}
        <p className={active ? "font-bold" : ""}>{name}</p>
      </div>
    </div>
  );
};
export default NavButton;
