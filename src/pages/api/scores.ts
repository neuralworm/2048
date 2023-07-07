// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  ip: string,
  name: string,
  turns: number;
  score: number
}

const topScores: Data[] = []

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  if (req.method == "GET") GET(req, res)
  if (req.method == "POST") POST(req, res)
}
const GET = (req: NextApiRequest,
  res: NextApiResponse<Data[]>) => {
  res.status(200).json(topScores)
}
const POST = (req: NextApiRequest,
  res: NextApiResponse<Data[]>) => {
  let newScore = req.body
}