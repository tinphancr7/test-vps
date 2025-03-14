import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
interface Option {
  value: any;
  label: string;
}

interface UpCloudSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange?: (option: Option) => void;
  className?: string;
  mainText?: string;
  disabled?: boolean;
}

export default function UpCloudSelect({
  options,
  defaultValue,
  onChange,
  className = "",
  mainText,
  disabled = false,
}: UpCloudSelectProps) {
  const defaultOption =
    options.find((option) => option.value === defaultValue) || options[0];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative z-[9999] flex h-full w-full">
      <div
        className={clsx(
          "flex h-full min-h-5 w-full items-center justify-between gap-2 rounded-sm border-[1px] border-gray-300 px-2 py-1",
          className,
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
        onClick={toggleDropdown}
      >
        <p className="text-sm font-medium">
          {mainText ?? selectedOption.label}
        </p>
        <span className="text-sm">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full z-[999] mt-1.5 w-full border-[1px] border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`${
                selectedOption.value === option.value && "text-up-cloud-primary"
              } relative flex w-full cursor-pointer items-center justify-center border-b-[1px] border-b-gray-300 py-3 text-sm last:border-b-0 hover:text-up-cloud-primary`}
              onClick={() => handleSelect(option)}
            >
              <p className="w-full truncate px-3">{option.label}</p>
              {selectedOption.value === option.value && (
                <div className="absolute bottom-0 left-0 top-0 z-20 w-[3px] bg-up-cloud-primary"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
