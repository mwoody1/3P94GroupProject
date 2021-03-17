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
  selectedImage?: ImageFileMeta
  selectedVideo?: VideoFileMeta
  setAudioFiles: React.Dispatch<React.SetStateAction<AudioFileMeta[]>>
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFileMeta[]>>
  setVideoFiles: React.Dispatch<React.SetStateAction<VideoFileMeta[]>>
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageFileMeta | undefined>>
  setSelectedVideo: React.Dispatch<React.SetStateAction<VideoFileMeta | undefined>>
}

export const files = {
  audioFiles: [],
  imageFiles: [],
  videoFiles: [],
  setAudioFiles: () => {},
  setImageFiles: () => {},
  setVideoFiles: () => {},
  setSelectedImage: () => {},
  setSelectedVideo: () => {}
}

export const FilesContext = React.createContext<Files>(files);
export const useFiles = () => React.useContext(FilesContext);
