import Container from "@/components/container";
import { useAppSelector } from "@/stores";
import CardRole from "./card-role";

function RolesList() {
    const { roles } = useAppSelector(state => state.roles);

    return (  
        <Container className={"rounded-md mt-2 grid grid-cols-3 gap-4 bg-light"}>
            {!!roles?.length && roles?.map(
                (role, index) => <CardRole key={index} role={role} />
            )}
        </Container>
    );
}

export default RolesList;