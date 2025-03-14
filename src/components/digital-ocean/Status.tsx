import { Chip } from '@heroui/react';
import { SpinnerStatus } from './SpinnerStatus';
export const Status = (type: string) => {
    const colorStatus = (type: string) => {
        switch (type) {
            case 'new':
                return 'warning';
            case 'off':
                return 'danger';
            case 'terminated':
                return 'danger';
            case 'in-progress':
                return 'primary';
            case 'active':
                return 'success';

            default:
                return 'danger';
        }
    };
    switch (type) {
        case 'new':
            return (
                // <Chip radius="sm">
                //     <SpinnerStatus status="New" />
                // </Chip>
                <Chip
                    color={colorStatus(type)}
                    variant="flat"
                    radius="sm"
                    classNames={{
                        content: 'font-semibold tracking-wider',
                    }}
                >
                    <SpinnerStatus status="New" />
                </Chip>
            );
        case 'off':
            return (
                // <Chip radius="sm">
                //     <SpinnerStatus status="New" />
                // </Chip>
                <Chip
                    color={colorStatus(type)}
                    variant="flat"
                    radius="sm"
                    classNames={{
                        content: 'font-semibold tracking-wider',
                    }}
                >
                    {type.toUpperCase()}
                    {/* <SpinnerStatus status="" /> */}
                </Chip>
            );
        case 'terminated':
            return (
                // <Chip radius="sm">
                //     <SpinnerStatus status="New" />
                // </Chip>
                <Chip
                    color={colorStatus(type)}
                    variant="flat"
                    radius="sm"
                    classNames={{
                        content: 'font-semibold tracking-wider',
                    }}
                >
                    {type.toUpperCase()}
                    {/* <SpinnerStatus status="" /> */}
                </Chip>
            );
        case 'in-progress':
            return (
                // <Chip radius="sm">
                //     <SpinnerStatus status="New" />
                // </Chip>
                <Chip
                    color={colorStatus(type)}
                    variant="flat"
                    radius="sm"
                    classNames={{
                        content: 'font-semibold tracking-wider',
                    }}
                >
                    <SpinnerStatus status="In Progress" />
                </Chip>
            );

        case 'active':
            return (
                // <Chip color="success" radius="sm">
                //     {type.toUpperCase()}
                // </Chip>
                <Chip
                    color={colorStatus(type)}
                    variant="flat"
                    radius="sm"
                    classNames={{
                        content: 'font-semibold tracking-wider',
                    }}
                >
                    {type.toUpperCase()}
                </Chip>
            );

        default:
            return <p>{type}</p>;
    }
};
