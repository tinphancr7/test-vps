import { FaChevronLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

type HeadingPageProps = {
    back?: {
        link: string;
        title: string;
    };
    heading: {
        title: string;
        subtitle?: string;
    };
    rightElement?: React.ReactNode;
};

export const HeadingPage = ({
    back,
    heading,
    rightElement,
}: HeadingPageProps) => {
    return (
        <div>
            {back && (
                <Link
                    to={back.link}
                    className={
                        "text-secondary-dark mb-4 flex max-w-fit items-center gap-1 text-[1rem] font-medium"
                    }
                >
                    <FaChevronLeft className="size-4 min-w-4" />
                    {back.title}
                </Link>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-secondary-dark mb-3 text-3xl font-bold capitalize leading-[1.5] xl:text-4xl">
                        {heading.title}
                    </h1>
                    {heading.subtitle && (
                        <p className="text-[#212529]">{heading.subtitle}</p>
                    )}
                </div>
                {rightElement}
            </div>
        </div>
    );
};
