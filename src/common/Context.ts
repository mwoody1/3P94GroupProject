import React from 'react';

export interface AudioFileMeta extends FileMeta {
  length: string
}

export interface ImageFileMeta extends FileMeta{
  width: number
  height: number
}

export interface VideoFileMeta extends FileMeta {
  width: number
  height: number
  length: string
}

// export interface SelectedVideoFileMeta extends VideoFileMeta {
//   updatedSrc: string
// }

type FileMeta = {
  name: string
  size: number
  src: string
  type: string
}

type Files = {
  audioFiles: AudioFileMeta[]
  imageFiles: ImageFileMeta[]
  videoFiles: VideoFileMeta[]
  selectedVideo?: VideoFileMeta
  setAudioFiles: React.Dispatch<React.SetStateAction<AudioFileMeta[]>>
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFileMeta[]>>
  setVideoFiles: React.Dispatch<React.SetStateAction<VideoFileMeta[]>>
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoFileMeta | undefined>>
}

export const files = {
  audioFiles: [],
  imageFiles: [],
  videoFiles: [],
  setAudioFiles: () => {},
  setImageFiles: () => {},
  setVideoFiles: () => {},
  setSelectedVideo: () => {}
}

export const FilesContext = React.createContext<Files>(files);
export const useFiles = () => React.useContext(FilesContext);


// import React from 'react';

// type Files = {
//   audioFiles: File[]
//   imageFiles: File[]
//   videoFiles: File[]
//   setAudioFiles: React.Dispatch<React.SetStateAction<File[]>>
//   setImageFiles: React.Dispatch<React.SetStateAction<File[]>>
//   setVideoFiles: React.Dispatch<React.SetStateAction<File[]>>
// }

// export const files = {
//   audioFiles: [],
//   imageFiles: [],
//   videoFiles: [],
//   setAudioFiles: () => {},
//   setImageFiles: () => {},
//   setVideoFiles: () => {}
// }

// export const FilesContext = React.createContext<Files>(files);
// export const useFiles = () => React.useContext(FilesContext);