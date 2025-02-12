import { Notes } from "./tables";

export type TrackKeypoint = {
  /** chord definition */
  ch: {
    /** the display name of the chord */
    nm: string;
    /** the notes indexes, can go beyond 0-11 for more octaves */
    ns: number[];
  };
  /** in seconds define where this chords hits */
  at: number; 
};

type TrackMeta = {
  bpm: number;
  key: string;
  author: string;
};

export type TrackApiResponse = {
  meta: TrackMeta;
  keypoints: TrackKeypoint[];
};

export type Note = keyof typeof Notes;
