"use client"
import { api } from "@/lib/axios";
import { useState } from "react";
import { z } from 'zod'

interface CardProps {
  name: string
  releaseDate: string
}

function Card({ name, releaseDate }: CardProps) {
  return (<div className="w-full p-4 bg-zinc-800 flex flex-col gap-4 rounded-md">
    <span className="text-white font-semibold text-xl">{name}</span>
    <span className="text-zinc-300">{releaseDate}</span>
  </div>)
}

function Error() {
  return (<div className="w-full p-4 bg-zinc-800 flex flex-col gap-4 rounded-md">
    <span className="text-red-500 font-semibold text-xl">Error ao buscar filmes</span>
    <span className="text-zinc-300">Desculpe, parece que a algum problema no servidor.</span>
  </div>)
}

const resultSchema = z.array(z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
},
))

type Movies = z.infer<typeof resultSchema>

export default function Home() {
  const [movies, setMovies] = useState<Movies | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [inputValue, setInputValue] = useState('')

  async function searchMoviesByTitle(title: string) {
    try {
      setIsLoading(true)
      const response = await api(`/search/movie?query=${title}`)

      try {
        const validateResponse = resultSchema.parse(response.data.results)
        setMovies(response.data.results)
        setIsLoading(false)
        setError(false)
      } catch (error) {
        setIsLoading(false)
        setError(true)
        console.log('ERRO NO PARSE: ' + error)
      }

    } catch (error) {
      setIsLoading(false)
      console.log("ERRO AO CHAMAR A API: " + error)
    }
  }

  return (
    <div className="w-[700px] m-auto mt-24">
      <div className="w-full flex flex-col gap-3">
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="buscar filme" className="pl-4 outline-none focus:border-2 focus:violet-blue-800 w-full h-9 text-white bg-zinc-900 border border-violet-700 rounded-md" />
        <button onClick={() => searchMoviesByTitle(inputValue)} className="w-full bg-violet-700 mb-5 uppercase font-semibold rounded-md outline-none hover:bg-violet-800 h-9 text-white">Buscar</button>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading && (
          <span className="text-white mt-8">Buscando filmes...</span>
        )}
        {isLoading === false && (
          movies?.map((movie) => <Card key={movie.id} name={movie.title} releaseDate={movie.release_date} />)
        )}
        {error && (
          <Error />
        )}
      </div>
    </div>
  );
}
