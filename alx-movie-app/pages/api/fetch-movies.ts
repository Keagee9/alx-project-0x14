
import { MoviesProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler (request: NextApiRequest, response: NextApiResponse)  {

  if (request.method === "POST") {
    try {
      const { year, page, genre } = request.body;
      const date = new Date();

      const queryParams = new URLSearchParams({
        year: year || date.getFullYear().toString(),
        sort: 'year.decr',
        limit: '12',
        page: page,
      });

      if (genre) {
        queryParams.append('genre', genre);
      }

      const resp = await fetch(
        `https://moviesdatabase.p.rapidapi.com/titles?${queryParams.toString()}`,
        {
          headers: {
            "x-rapidapi-host": "moviesdatabase.p.rapidapi.com",
            "x-rapidapi-key": process.env.MOVIE_API_KEY || '',
          },
        }
      );

      if (!resp.ok) {
        console.error('API Error:', resp.status, await resp.text());
        throw new Error(`Failed to fetch movies. Status: ${resp.status}`);
      }

      const moviesResponse = await resp.json();
      const movies: MoviesProps[] = moviesResponse.results;

      return response.status(200).json({ movies });
    } catch (error: any) {
      console.error('API Route Error:', error);
      return response.status(500).json({ error: 'Failed to fetch movies', details: error.message });
    }
  } else {
    response.setHeader('Allow', ['POST']);
    response.status(405).end(`Method ${request.method} Not Allowed in here`);
  }
};