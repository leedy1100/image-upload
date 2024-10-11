"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_COUNT = 5;

export default function Previews() {
  const [files, setFiles] = useState<Array<File & { preview: string }>>([]);

  const deleteFile = useCallback(
    (idx: number) => {
      const newFile = files.filter((_, index) => index !== idx);
      setFiles(newFile);
    },
    [files]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      const filesName = files.map((file) => file.name);
      const isDuplicated = newFiles.some((newFile) =>
        filesName.includes(newFile.name)
      );

      if (isDuplicated) {
        alert("중복 이미지는 업로드할 수 없습니다.");
        return;
      }

      if (files.length + newFiles.length > MAX_FILE_COUNT) {
        alert("최대 5개까지만 업로드 가능합니다.");
        return;
      }

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    disabled: files.length >= MAX_FILE_COUNT ? true : false,
    noDrag: true,
  });

  const thumbs = files.map((file, idx) => (
    <div
      className="relative inline-flex w-20 h-20 mt-4 mr-8 box-border"
      key={file.name}
    >
      <div className="flex min-w-0 overflow-hidden">
        <Image
          src={file.preview}
          className="h-full rounded-md"
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          width={100}
          height={100}
          alt="thumbnail"
        />
      </div>
      <button
        className="absolute -top-2 -right-2 rounded-full w-6 h-6 bg-gray-100"
        onClick={() => deleteFile(idx)}
      >
        x
      </button>
    </div>
  ));

  const emptyThumbs = Array.from({
    length: MAX_FILE_COUNT - files.length,
  }).map((_, idx) => (
    <div
      className="top-10 right-10 inline-flex justify-end rounded-md border border-dashed w-20 h-20 mt-4 mr-8 box-border"
      key={idx}
    >
      <div className="flex min-w-0 overflow-hidden"></div>
    </div>
  ));

  useEffect(() => {
    console.log(files);
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="flex gap-8">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="flex items-center justify-center w-20 h-20 border border-dashed rounded-md mt-4 hover:border-gray-600 cursor-pointer text-gray-400"
      >
        <input {...getInputProps()} />
        <p>+</p>
      </div>
      <aside className="relative flex flex-row flex-wrap">
        {thumbs}
        {emptyThumbs}
      </aside>
    </section>
  );
}
