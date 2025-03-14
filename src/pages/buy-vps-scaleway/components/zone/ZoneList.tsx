import {listZones} from "@/constants";
import ZoneItem from "./ZoneItem";

const ZoneList = () => {
	return (
		<div className="grid grid-cols-12 gap-5">
			{listZones.map((item, index) => (
				<div className="x col-span-4" key={index}>
					<ZoneItem item={item} />
				</div>
			))}
		</div>
	);
};

export default ZoneList;
