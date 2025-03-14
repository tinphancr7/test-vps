import { CircularProgress } from "@heroui/react";

function LazyLoadingPage() {
	return (
        <div className="h-dvh w-full flex items-center justify-center">
            <CircularProgress size="lg" color="primary" aria-label="Loading..." />
        </div>
    )
}

export default LazyLoadingPage;
