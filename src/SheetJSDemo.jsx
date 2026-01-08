import React, { useCallback, useEffect, useState } from "react";

import { read, utils, writeFileXLSX } from "xlsx";

export default function SheetJSDemo() {
	/* the component state is an array of presidents */
	const [pres, setPres] = useState([] /* as any[] */);

	/* Fetch and update the state once */
	useEffect(() => {
		(async () => {
			const f = await (
				await fetch("https://docs.sheetjs.com/pres.xlsx")
			).arrayBuffer();
			const wb = read(f); // parse the array buffer
			const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
			const data = utils.sheet_to_json(ws); // generate objects

			console.log(data);
			setPres(data); // update state
		})();
	}, []);

	/* get state data and export to XLSX */
	const exportFile = useCallback(() => {
		const ws = utils.json_to_sheet(pres);
		const wb = utils.book_new();
		utils.book_append_sheet(wb, ws, "Data");
		writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
	}, [pres]);

	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Index</th>
				</tr>
			</thead>
			<tbody>
				{
					/* generate row for each president */
					pres.map((pres, index) => (
						<tr key={index}>
							<td>{pres.Name}</td>
							<td>{pres.Index}</td>
						</tr>
					))
				}
			</tbody>
			<tfoot>
				<tr>
					<td colSpan={2}>
						<button onClick={exportFile}>Export XLSX</button>
					</td>
				</tr>
			</tfoot>
		</table>
	);
}
