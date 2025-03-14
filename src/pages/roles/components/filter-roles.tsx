import Container from "@/components/container";
import { useAppDispatch } from "@/stores";
import { setModal } from "@/stores/slices/modal-slice";
import { Button } from "@heroui/react";
import FormRole from "./form-role";
import { useEffect } from "react";
import { asyncThunkGetAllRoles } from "@/stores/async-thunks/role-thunk";
import { FaPlus } from "react-icons/fa6";

function FilterRoles() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(asyncThunkGetAllRoles());
	}, []);

    const handleOpenModalUser = () => {
        dispatch(
			setModal({
				isOpen: true,
				placement: 'right',
				title: 'Thêm quyền hạn mới',
				body: <FormRole isEdit={false} isRead={false} />,
			})
		);
    };

    return (  
        <Container>
			<Button
				variant="solid"
				color="primary"
				radius="sm"
				className="h-8 font-semibold"
				startContent={<FaPlus />}
				onPress={handleOpenModalUser}
			>
				Thêm mới
			</Button>
		</Container>
    );
}

export default FilterRoles;