import { useState, useEffect } from "react";
import {
  MdAccountBalanceWallet,
  MdOutlineAccountBalanceWallet,
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
} from "react-icons/md";
import NavButton from "./NavButton";
import {
  RiMoneyDollarCircleFill,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { GoGoal } from "react-icons/go";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import api from "../utils/api";

const Nav = () => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.user) {
          setUsername(res.data.user.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-white/60 w-[15rem] max-w-xs min-w-[13rem] h-screen pl-2 sticky top-0 select-none pr-2 flex flex-col items-start justify-between gap-3 border-r-slate-200/60 border-r-2 overflow-y-auto">
      <div className="flex flex-col items-start justify-start gap-3 mt-5">
        <div className="flex items-center gap-5 text-xl text-slate-900 font-semibold ml-2">
          <div className="w-10 h-10 bg-black rounded-md"></div>
          {username}
        </div>
        <div className="w-full h-1 bg-slate-200/80 mt-1"></div>
        <NavButton
          name={"OverView"}
          activeIcon={<MdSpaceDashboard />}
          icon={<MdOutlineSpaceDashboard />}
          link={"/"}
        />
        <NavButton
          name={"My Accounts"}
          activeIcon={<MdAccountBalanceWallet />}
          icon={<MdOutlineAccountBalanceWallet />}
          link={"/accounts"}
        />
        <NavButton
          name={"Transactions"}
          activeIcon={<RiMoneyDollarCircleFill />}
          icon={<RiMoneyDollarCircleLine />}
          link={"/transactions"}
        />
        <NavButton
          name={"Goals"}
          activeIcon={<GoGoal />}
          icon={<GoGoal />}
          link={"/goals"}
        />
      </div>
      <div className="mb-5">
        <NavButton
          name={"Options"}
          activeIcon={<IoSettingsSharp />}
          icon={<IoSettingsOutline />}
          link={"/options"}
        />
      </div>
    </div>
  );
};
export default Nav;
