import { useEffect, useRef } from "react";

interface SideBarHeaderProps {
    setIsGroups: (arg0: boolean) => void;
    isGroups: boolean;
    headerOne: string;
    headerTwo: string;
    rootClassName: string;
}


const SideBarHeader = ({ setIsGroups, isGroups, headerOne, headerTwo, rootClassName }: SideBarHeaderProps) => {
    const p1Ref = useRef<HTMLParagraphElement>(null);
    const p2Ref = useRef<HTMLParagraphElement>(null);
    const underlineRef = useRef<HTMLDivElement>(null);
    const moveUnderline = (targetRef: React.RefObject<HTMLParagraphElement>) => {
        if (targetRef.current && underlineRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            underlineRef.current.style.width = `${rect.width}px`;
            underlineRef.current.style.left = `${rect.left + window.scrollX}px`;
            underlineRef.current.style.top = `${rect.bottom + window.scrollY}px`;
        }
    };

    useEffect(() => {
        const handleResize = () => moveUnderline((!isGroups ? p1Ref : p2Ref) as React.RefObject<HTMLParagraphElement>);

        moveUnderline((!isGroups ? p1Ref : p2Ref) as React.RefObject<HTMLParagraphElement>);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isGroups]);
    return (
        <div className={`${rootClassName}__header`}>
            <div className={`${rootClassName}__header__top`}>
                <p className={`${rootClassName}__header__top__title`} onClick={() => setIsGroups(false)} ref={p1Ref}>{headerOne}</p>
                <p className={`${rootClassName}__header__top__title`} onClick={() => setIsGroups(true)} ref={p2Ref}>{headerTwo}</p>
            </div>
            <span className={`${rootClassName}__header__underline`} ref={underlineRef}></span>
        </div>
    );
};

export default SideBarHeader;