import { Spinner } from "@heroui/react";

function LazyLoadingLayout() {
    return (  
        <div className="w-screen h-screen flex items-center justify-center">
            <Spinner 
                size="lg"
                color="primary"
            />
        </div>  
    );
}

export default LazyLoadingLayout;