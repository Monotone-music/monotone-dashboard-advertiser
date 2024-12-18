import React, { useState, useCallback, useRef } from "react";
import { IAudioMetadata, parseBlob } from "music-metadata";
import styles from "./styles.module.scss";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import axios from 'axios';
import apiClient from "@/service/apiClient";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

const UploaderPage: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [metadata, setMetadata] = useState<IAudioMetadata>();
  const [dragActive, setDragActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
    const imageURL = URL.createObjectURL(acceptedFiles[0]);
    setImageSrc(imageURL);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleFile = async (selectedFile: File | null) => {
    setAudioFile(selectedFile);

    if (selectedFile) {
      const audioURL = URL.createObjectURL(selectedFile);
      setAudioSrc(audioURL);

      // Extract metadata
      const metadata = await parseBlob(selectedFile);
      setMetadata(metadata);
    } else {
      setAudioSrc(null);
      setMetadata(undefined);
    }
  };

  const handleDrag = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        await handleFile(event.dataTransfer.files[0]);
      }
    },
    []
  );

  const handleUpload = async () => {
    console.log("audioFile:", audioFile);
    console.log("imageFile:", imageFile);
    console.log("title:", title);
    console.log("type:", type);
    setIsUploading(true);
    if (type === 'banner_ad') {
      if (!imageFile || !title) {
        setIsUploading(false);
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Missing fields",
          description: "Please provide image and title.",
          className: styles["toast-error"],
        });
        return;
      }
    } else {
      if (!audioFile || !imageFile || !title) {
        setIsUploading(false);
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Missing fields",
          description: "Please provide all required fields.",
          className: styles["toast-error"],
        });
        return;
      }
    }

    const formData = new FormData();
    if (type === 'player_ad' && audioFile) {
      formData.append("media", audioFile);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("title", title);
    toast({
      variant: "default",
      duration: 3000,
      title: "Advertisement files uploading...",
      description: "Please wait until the process is complete!",
    });

    await apiClient
      .put(`/advertisement/create?type=${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data;",
        },
      })
      .then((response) => {
        setIsUploading(false);
        console.log("Advertisement uploaded successfully:", response.data);
        toast({
          variant: "default",
          duration: 3000,
          title: "Advertisement uploaded successfully",
          description: "Your files have been uploaded successfully.",
          className: styles["toast-success"],
        });
      })
      .catch((error) => {
        setIsUploading(false);
        console.error("Error uploading files:", error);
        toast({
          variant: "destructive",
          duration: 3000,
          title: "Advertisement upload failed",
          description: "Please try again later.",
          className: styles["toast-error"],
        });
      });
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);
      audio.onloadedmetadata = () => {
        if (audio.duration > 15) {
          toast({
            variant: "destructive",
            duration: 3000,
            title: "Audio file too long",
            description: "The audio file must be 15 seconds or shorter.",
            className: styles["toast-error"],
          });
        } else {
          setAudioFile(file);
          setAudioSrc(audioURL);
        }
      };
    }
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImageFile(file);
  //     const imageURL = URL.createObjectURL(file);
  //     setImageSrc(imageURL);
  //   }
  // };

  return (
    <div className={styles.container}>
      <h1>Upload Advertisement Request</h1>
      <div className="w-full max-w-md my-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>
      <div className="w-full max-w-md my-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        >
          <option className="decoration-slate-600" value=""> -- Select Advertisement Type -- </option>
          <option value="player_ad">Player Advertisement</option>
          <option value="banner_ad">Banner Advertisement</option>
        </select>
      </div>
      {type === 'player_ad' && (
        <>
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className={`${styles.drop_area} ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <p>Drag & Drop your audio file here or click to select a file</p>
        <p>Only audio file with the duration of <span className="font-bold">15 seconds or less</span> will be accepted</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-upload"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </label>
      </>
      )}
      {audioSrc && (
        <div
          className={cn(
            "w-full pt-10 flex-1 text-center items-center justify-center"
          )}
        >
          <h2>Audio Preview:</h2>
          <audio
            ref={audioRef}
            src={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            style={{ display: "none" }}
          />
          <div
            className={cn("w-full flex items-center justify-center space-x-4")}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="rounded-full p-4 bg-green-500"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </Button>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-96 accent-gray-500 h-1.5"
            />
            <span className="text-sm">
              {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
              {new Date(duration * 1000).toISOString().substr(14, 5)}
            </span>
          </div>
        </div>
      )}
      {metadata && (
        <div className={styles.metadata}>
          <p>
            <strong>Title:</strong> {metadata.common.title}
          </p>
          <p>
            <strong>Artist:</strong> {metadata.common.artist}
          </p>
          <p>
            <strong>Album:</strong> {metadata.common.album}
          </p>
          <p>
            <strong>Year:</strong> {metadata.common.year}
          </p>
          {metadata.common.genre && metadata.common.genre.length > 0 && (
            <p>
              <strong>Genre:</strong> {metadata.common.genre.join(", ")}
            </p>
          )}
        </div>
      )}
    {((type === 'player_ad' && audioFile) || type === 'banner_ad') && (
    <>
      <div className="w-full my-4 justify-center flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <div
          {...getRootProps()}
          className={`${styles.drop_area} ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image file here ...</p>
          ) : (
            <div>
              <p>Drag & drop the image file here, or click to select file</p>
              {/* <p></p> */}
            </div>
          )}
        </div>
        {imageSrc && (
          <div className="w-full max-w-md mt-4">
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
      </>
      )}

      <Button
        onClick={handleUpload}
        disabled={!imageFile || isUploading}
        className="mt-4"
      >
        {isUploading ? (
          <svg
            className="animate-spin flex justify-center items-center h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
};

export default UploaderPage;
