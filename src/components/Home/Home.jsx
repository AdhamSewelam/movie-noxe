import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Home(props) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  let imgPrefix = "https://image.tmdb.org/t/p/w500";
  console.log(props);

  async function getTrendingMovies(mediaType, callback) {
    let { data } = await axios.get(`
    https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=5704ef950bbc25a9de29d1340094165e`);
    callback(data.results.slice(0, 10));
  }

  useEffect(() => {
    getTrendingMovies("movie", setTrendingMovies);
    getTrendingMovies("tv", setTrendingTv);
    getTrendingMovies("person", setTrendingPeople);
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-4 flex-column d-flex justify-content-center align-content-center">
          <div className="brdr mb-4"></div>
          <h2 className="h3">Trending Movies To Watch Right Now</h2>
          <p className="text-muted m-0">Trending Movies To Watch</p>
          <div className="brdr mt-4"></div>
        </div>
        {trendingMovies.map((movie, index) => (
          <div key={index} className="col-md-2">
            <div className="movie my-3">
              <img
                src={imgPrefix + movie.poster_path}
                className="w-100"
                alt={movie.title}
              />
              <h3 className="h5 my-2">{movie.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-4 flex-column d-flex justify-content-center align-content-center">
          <div className="brdr mb-4"></div>
          <h2 className="h3">Trending Tv Shows To Watch Right Now</h2>
          <p className="text-muted m-0">Trending Tv Shows To Watch</p>
          <div className="brdr mt-4"></div>
        </div>
        {trendingTv.map((movie, index) => (
          <div key={index} className="col-md-2">
            <div className="movie my-3">
              <img
                src={imgPrefix + movie.poster_path}
                className="w-100"
                alt={movie.name}
              />
              <h3 className="h5 my-2">{movie.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-4 flex-column d-flex justify-content-center align-content-center">
          <div className="brdr mb-4"></div>
          <h2 className="h3">Trending Actors To Watch Right Now</h2>
          <p className="text-muted m-0">Trending Actors To Watch</p>
          <div className="brdr mt-4"></div>
        </div>
        {trendingPeople.map((movie, index) => (
          <div key={index} className="col-md-2">
            <div className="movie my-3">
              <img
                src={imgPrefix + movie.profile_path}
                className="w-100"
                alt={movie.name}
              />
              <h3 className="h5 my-2">{movie.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
