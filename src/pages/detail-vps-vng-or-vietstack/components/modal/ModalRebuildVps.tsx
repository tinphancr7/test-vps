import vpsApis from "@/apis/vps-apis";

import RenderFormData from "@/components/form-data/RenderFormData/RenderFormData";
import CustomModal from "@/components/modal/CustomModal";
import {useAppSelector} from "@/stores";
import {osSchema} from "@/utils/validation";
import {yupResolver} from "@hookform/resolvers/yup";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";

const ModalRebuildVps = ({isOpen, onOpenChange, onRebuildVps}: any) => {
	const {id} = useParams();
	const {vm} = useAppSelector((state) => state.detailVps);
	const [listOS, setListOS] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const {
		handleSubmit,
		control,
		setValue,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues: {
			os: "",
		},
		resolver: yupResolver(osSchema),
	});

	useEffect(() => {
		const fetchData = async (id: string) => {
			setIsLoading(true);
			const res = await vpsApis.callFetchOS(id);
			setListOS(res?.data?.data || []);
			setIsLoading(false);
		};
		if (id) {
			fetchData(id);
		}
	}, [id]);

	useEffect(() => {
		setValue("os", vm?.template_name);
	}, [vm?.template_name]);

	const listData = [
		{
			label: "Hệ điều hành",
			name: "os",
			kind: "select",
			placeholder: "Nhập dữ liệu",
			width: "col-span-12",
			isRequired: true,
			children: (
				<>
					{listOS.map((item: any, index) => (
						<option key={index} value={item?.name}>
							{item?.name}
						</option>
					))}
				</>
			),
		},
	];

	const onSubmit = handleSubmit(async (values) => {
		const findOS: any = listOS.find((item: any) => item?.name === values?.os);

		onRebuildVps(findOS?.id);
	});

	return (
		<CustomModal
			title="Cài đặt lại"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
			isSubmitting={isLoading || isSubmitting}
			resetForm={onOpenChange}
			size={"lg"}
		>
			<div>
				<p>
					Cài đặt lại hệ điều hành cho máy ảo,{" "}
					<span className="text-red-600 font-bold">
						xóa tất cả các dữ liệu trên các ổ đĩa.
					</span>
				</p>
				<div className="grid grid-cols-12 gap-4 mt-5">
					{listData?.map((item, index) => (
						<div key={index} className={item?.width}>
							<RenderFormData item={item} control={control} errors={errors} />
						</div>
					))}
				</div>
			</div>
		</CustomModal>
	);
};

export default ModalRebuildVps;
