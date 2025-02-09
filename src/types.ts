export type TrackKeypoint = {
  t: number /** the timestamp in seconds */;
  k: number[] /** the kind of chord */;
  n: string /** the name of the chord */;
};

type TrackMeta = {
  transcriber: {
    name: string;
    social: string;
  };
};

export type TrackApiResponse = {
  meta: TrackMeta;
  keypoints: TrackKeypoint[];
};
