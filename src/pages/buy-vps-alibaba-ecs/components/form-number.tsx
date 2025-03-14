import { Button } from "@heroui/react";
import { GrFormSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

interface IFormNumberProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

const FormNumber = ({
  value,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
}: IFormNumberProps) => {
  const handleIncrease = ()=> {
    if(value < max) {
      onChange(value + step)
    }
  }

  const handleDecrease = ()=> {
    if(value > min) {
      onChange(value - step)
    }
  }

  return (
    <div className="flex items-center border">
      <Button
        className="!scale-100 rounded-sm bg-gray-200 disabled:opacity-50"
        size="sm"
        isIconOnly
        onPress={handleDecrease}
        disabled={value <= min}
      >
        <GrFormSubtract />
      </Button>
      <div className="w-[80px] !text-center">{value}</div>
      <Button
        className="!scale-100 rounded-sm bg-gray-200 disabled:opacity-50"
        size="sm"
        isIconOnly
        onPress={handleIncrease}
        disabled={value >= max}
      >
        <IoMdAdd />
      </Button>
    </div>
  );
};

export default FormNumber;
