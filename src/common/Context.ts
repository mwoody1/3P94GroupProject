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

export type Project = {
  name: string
  audioFiles: AudioFileMeta[]
  imageFiles: ImageFileMeta[]
  videoFiles: VideoFileMeta[]
  selectedImage?: ImageFileMeta
  selectedVideo?: VideoFileMeta
}

export type ProjectsState = {
  projects: Project[]
  currentProject: Project
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  setCurrentProject: React.Dispatch<React.SetStateAction<Project>>
}

// export const projectDefaults: Project = {
//   name: 'New Project',
//   audioFiles: [],
//   imageFiles: [],
//   videoFiles: [],
//   redScale: 100,
//   greenScale: 100,
//   blueScale: 100,
//   brightness: 100,
//   opacity: 100,
//   greyscale: false,
//   setRedScale: () => {},
//   setGreenScale: () => {},
//   setBlueScale: () => {},
//   setBrightness: () => {},
//   setOpacity: () => {},
//   setGreyscale: () => {},
// }

export const projectDefaults: Project = {
  name: 'New Project',
  audioFiles: [],
  imageFiles: [],
  videoFiles: []
}

export const initialProjectsState: ProjectsState = {
  projects: [projectDefaults],
  currentProject: projectDefaults,
  setProjects: () => {},
  setCurrentProject: () => {},
}

export const StateContext = React.createContext<ProjectsState>(initialProjectsState);
export const useProjects = () => React.useContext(StateContext);
