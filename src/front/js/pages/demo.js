import React, { useState, useEffect, useContext } from "react";

import { Context } from "../store/appContext";
import { ChartJSFinancesUser } from "../component/ChartJSFinancesUser.jsx";

export const Demo = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container"> 
		</div>
	);
};
