import { Radio, RadioGroup } from "@heroui/react";

function LogonUsername() {

    return (
        <div className="grid grid-cols-7 gap-2 my-3">
            <h3 className="text-base tracking-wide font-medium">
                Tên đăng nhập
            </h3>

            <div className="col-span-6 items-center">
                <RadioGroup label="" value={"root"} size="sm">
                    <Radio value="root">root</Radio>
                </RadioGroup>
            </div>
        </div>
    );
}

export default LogonUsername;
