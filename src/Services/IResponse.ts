export interface ResFilms {
  count: number;
  next?: any;
  previous?: any;
  results: ResultFilm[];
}

export interface ResultFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export interface ResCharacter {
  birth_year: "19 BBY",
  eye_color: "Blue",
  films: [],
  gender: "Male",
  hair_color: "Blond",
  height: "172",
  homeworld: "https://swapi.dev/api/planets/1/",
  mass: "77",
  name: "Luke Skywalker",
  skin_color: "Fair",
  created: "2014-12-09T13:50:51.644000Z",
  edited: "2014-12-10T13:52:43.172000Z",
  species: [],
  starships: [],
  url: "https://swapi.dev/api/people/1/",
  vehicles: []
}