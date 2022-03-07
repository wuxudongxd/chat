import { useRef, useState } from "react";
import ReactDOM from "react-dom";

const ImgPreview = ({
  src,
  ...rest
}: {
  [key in string]: any;
}) => {
  const [isShow, setIsShow] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      bgRef.current?.contains(e.target as Node) &&
      !previewImgRef.current?.contains(e.target as Node)
    ) {
      setIsShow(false);
    }
  };

  return (
    <>
      {isShow &&
        ReactDOM.createPortal(
          <div
            ref={bgRef}
            className="fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center transition-all"
            onClick={handleBgClick}
          >
            <img ref={previewImgRef} className="w-3/4 object-contain" src={src} />
          </div>,
          document.body
        )}
      <img {...rest} onClick={() => setIsShow(true)} src={src} />
    </>
  );
};

export default ImgPreview;
