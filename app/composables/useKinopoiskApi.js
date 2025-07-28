export const useKinopoiskApi = () => {
  const config = useRuntimeConfig()
  
  const makeRequest = async (url, params = {}) => {
    const cacheKey = `kp-${url}-${JSON.stringify(params)}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)

    try {
      const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
        headers: { 'X-API-KEY': config.public.kinopoiskApiKey }
      })
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      const data = await response.json()
      localStorage.setItem(cacheKey, JSON.stringify(data))
      return data
    } catch (error) {
      console.error('Ошибка запроса:', error)
      return null
    }
  }

  const fetchTopMovies = async (page = 1, limit = 20) => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      sortField: 'rating.kp',
      sortType: '-1',
      limit,
      page,
      type: 'movie',
      'rating.kp': '7-10',
      'votes.kp': '100000-10000000'
    })
    
    return {
      movies: data?.docs || [],
      totalPages: 5 // Фиксируем 5 страниц
    }
  }

  // Остальные методы без изменений
  const fetchMovie = async (movieId) => {
    return await makeRequest(`https://api.kinopoisk.dev/v1.4/movie/${movieId}`)
  }

  const fetchTrendingMovies = async () => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      sortField: 'votes.kp',
      sortType: '-1',
      limit: 5,
      type: 'movie',
      isSeries: false
    })
    return data?.docs || []
  }

  const fetchRussianMovies = async () => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      'countries.name': 'Россия',
      type: 'movie',
      limit: 10,
      sortField: 'votes.kp',
      sortType: '-1'
    })
    return data?.docs || []
  }

  const fetchRussianSeries = async () => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      'countries.name': 'Россия',
      type: 'tv-series',
      limit: 10,
      sortField: 'votes.kp',
      sortType: '-1'
    })
    return data?.docs || []
  }

  return { 
    fetchMovie, 
    fetchTrendingMovies, 
    fetchRussianMovies, 
    fetchRussianSeries,
    fetchTopMovies
  }
}