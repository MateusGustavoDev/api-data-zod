# Validação de dados de uma API com zod 

Primeiro, olhei pelo DevTools como era o formato dos dados retornados da API e criei o seguinte esquema com o Zod:

```typescript
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
```

Então, na minha função que faz a chamada à API, utilizo o método parse do Zod para verificar se os dados retornados da API coincidem com o esquema que foi criado:

```javascript
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
```

O primeiro bloco try...catch é para capturar erros mais genéricos, como problemas na rede, etc., mas o segundo try...catch é o que importa:
```typescript
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
```
Aqui, caso os dados da API não correspondam ao esquema, por exemplo, se alguma propriedade retornada pela API, como "id", passou a ser "userId", o Zod irá disparar um erro e podemos capturá-lo no bloco catch para lidar com o erro de forma mais detalhada.

