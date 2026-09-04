import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

function PrivateRouteLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState('');
  const [unReadTickets, setUnReadTickets] = useState(0);


  return (
    <div className="flex min-h-full bg-gray-50">
      <div
        className="flex w-0 flex-1 flex-col"
      >
        <Header setUnReadTickets={setUnReadTickets} setCurrency={setCurrency} setSidebarOpen={setSidebarOpen} />
        <Outlet  context={[currency, setCurrency,setUnReadTickets]}/>
      </div>
    </div>
  );
}

export default PrivateRouteLayout;
