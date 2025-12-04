
export interface BackgroundImage {
  url: string;
  alternativeText: string;
}


export interface HeroData {
  mainTitle: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  missionStatement: string;
  backgroundImage?: BackgroundImage[];
}