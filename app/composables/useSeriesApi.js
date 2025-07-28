export const useSeriesApi = () => {
  const config = useRuntimeConfig()
  
  const makeRequest = async (url, params = {}) => {
    const cacheKey = `kp-series-${url}-${JSON.stringify(params)}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)

    try {
      // Правильно формируем параметры запроса
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v))
        } else {
          queryParams.append(key, value)
        }
      })

      const response = await fetch(`${url}?${queryParams}`, {
        headers: { 
          'X-API-KEY': config.public.kinopoiskSeriesApiKey
        }
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

   const searchContent = async (query, page = 1, limit = 5) => {
    if (!query || query.trim().length < 2) return { results: [], total: 0 }
    
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie/search', {
      query: query.trim(),
      page,
      limit,
      sortField: 'rating.kp',
      sortType: '-1'
    })
    
    return {
      results: data?.docs || [],
      total: data?.total || 0
    }
  }
    const fetchTopSeries = async (page = 1, limit = 20) => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      sortField: 'rating.kp',
      sortType: '-1',
      limit,
      page,
      type: 'tv-series',
      'rating.kp': '7-10',
      'votes.kp': '50000-10000000'
    })
    
    return {
      series: data?.docs || [],
      totalPages: 5 // Фиксируем 5 страниц
    }
  }

  const fetchSeriesDetails = async (seriesId) => {
  return await makeRequest(`https://api.kinopoisk.dev/v1.4/movie/${seriesId}`, {
    append_to_response: 'persons,facts'
  });
};

  const fetchTopRussianContent = async (page = 1, limit = 20) => {
    const data = await makeRequest('https://api.kinopoisk.dev/v1.4/movie', {
      sortField: 'rating.kp',
      sortType: '-1',
      limit,
      page,
      'countries.name': 'Россия',
      'rating.kp': '7-10',
      'votes.kp': '100000-10000000',
      'type': ['movie', 'tv-series'] // Только фильмы и сериалы
    })
    
    // Дополнительная фильтрация на клиенте
    const filteredContent = (data?.docs || []).filter(item => 
      item.type === 'movie' || item.type === 'tv-series'
    )
    
    return {
      content: filteredContent,
      totalPages: 5
    }
  }

  return { 
    fetchTopSeries,
    searchContent,
    fetchSeriesDetails,
    fetchTopRussianContent
  }
}