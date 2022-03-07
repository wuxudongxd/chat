import React, { useRef } from "react";

interface FileUploadProps {
  updateFile: (file: any) => void;
  [key: string]: any;
}

const FileUpload = ({ updateFile, ...rest }: FileUploadProps) => {
  const fileInput = useRef<HTMLInputElement | null>(null);

  // dnd
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.items as DataTransferItemList;
    if (!files || files.length <= 0) {
      return;
    }
    const fileList: any[] = [];

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].kind === "file") {
        let entry = files[i].webkitGetAsEntry();
        getFileFromEntryRecursively(entry);
      }
    }
    fileList[0] && updateFile(fileList[0].file);

    function getFileFromEntryRecursively(entry: any) {
      if (entry.isFile) {
        entry.file(
          (file: File) => {
            let path = entry.fullPath.substring(1);
            fileList.push({
              file,
              path: path,
            });
          },
          (e: Error) => {
            console.log(e);
          }
        );
      } else {
        let reader = entry.createReader();
        reader.readEntries(
          (entries: any) => {
            entries.forEach((entry: any) => {
              getFileFromEntryRecursively(entry);
            });
          },
          (e: Error) => {
            console.log(e);
          }
        );
      }
    }
  };

  // file input
  const handleFile = () => fileInput.current?.click();
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.files && updateFile(event.target.files[0]);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleDrop}
      className="w-28 h-32 rounded border-dashed border border-slate-300 hover:border-blue-400 bg-gray-100 transition-all"
    >
      <div
        className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
        onClick={handleFile}
      >
        <span className="text-3xl -mt-5 mb-3">+</span>
        <span>上传文件</span>
      </div>
      <input
        ref={fileInput}
        type="file"
        className="h-0 w-0 opacity-0"
        onChange={handleInput}
      />
    </div>
  );
};

export default FileUpload;
