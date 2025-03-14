import { useState, useLayoutEffect } from "react";

interface UseSetHeightProps {
	max: string;
	dependency: string;
}

function useSetMaxHeight({ max, dependency }: UseSetHeightProps) {
	const [maxHeight, setMaxHeight] = useState<string | null>(null);

	useLayoutEffect(() => {
		const calculateHeight = () => {
			setTimeout(() => {
				const element = document.querySelector(dependency);

				if (element) {
					const elementHeight = element.getBoundingClientRect().height;

					setMaxHeight(`calc(${max} - ${elementHeight}px)`);
				} else {
					setMaxHeight(max); // Nếu không tìm thấy element, giữ giá trị ban đầu
				}
			}, 300);
		};

		calculateHeight(); // Tính toán ngay khi render

		window.addEventListener("resize", calculateHeight); // Cập nhật maxHeight khi thay đổi kích thước

		return () => {
			window.removeEventListener("resize", calculateHeight);
		};
	}, [dependency, max]);

	// Trả về maxHeight hoặc giá trị mặc định
	return maxHeight || max;
}

export default useSetMaxHeight;
