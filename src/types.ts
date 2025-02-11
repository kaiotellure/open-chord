import { Notes } from "./tables";

export type TrackKeypoint = {
  keys: { name: string; notes: number[] };
  beat: number;
};

type TrackMeta = {
  bpm: number;
  offset: number;
  length: number;
};

export type TrackApiResponse = {
  meta: TrackMeta;
  keypoints: TrackKeypoint[];
};

export type Note = keyof typeof Notes;
