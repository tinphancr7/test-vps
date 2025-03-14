import { useAppDispatch, useAppSelector } from "@/stores";
import { asyncThunkGetAllYourTeam } from "@/stores/async-thunks/team-thunk";
import { setTeamId } from "@/stores/slices/alibaba-ecs.slice";
import { Select, SelectItem } from "@heroui/react";
import { useEffect } from "react";

function TeamSelect() {
    const dispatch = useAppDispatch()
    const { teams } = useAppSelector((state) => state.teams);
    const { teamId } = useAppSelector(state => state.alibabaEcs);

    useEffect(() => {
        (async () => {
            const fetchTeams = await dispatch(
                asyncThunkGetAllYourTeam()
            ).unwrap();

            dispatch(
                setTeamId(
                    fetchTeams[0]?._id ? fetchTeams[0]?._id : ""
                )
            );
        })();

        return () => {};
    }, []);

    const handleChangeValue = (value: any) => {
        const [team] = [...value];

        dispatch(setTeamId(team));
    };

    return (
        <div className="grid grid-cols-7 gap-2">
            <h3 className="text-base tracking-wide font-medium">
                Team
            </h3>

            <div className="col-span-6 grid grid-cols-2">
                <Select
                    aria-label="operating-system"
                    fullWidth
                    variant="bordered"
                    selectionMode="single"
                    disallowEmptySelection
                    labelPlacement="outside"
                    classNames={{
                        label: "text-base font-bold left-0 group-data-[filled=true]:text-primary",
                        value: "text-base tracking-wide font-medium",
                        trigger:
                            "text-dark border border-slate-400 rounded-sm min-h-10 h-10 border bg-white data-[hover=true]:bg-white data-[open=true]:border-primary",
                        popoverContent: "rounded",
                    }}
                    selectedKeys={new Set([teamId])}
                    onSelectionChange={handleChangeValue}
                    isInvalid={!teamId ? true : false}
                >
                    {teams?.map((item: any) => {
                        return (
                            <SelectItem
                                key={item._id}
                                textValue={item.name}
                            >
                                {item.name}
                            </SelectItem>
                        );
                    })}
                </Select>
            </div>
        </div>
    );
}

export default TeamSelect;
