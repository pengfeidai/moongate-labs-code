import { NextApiRequest, NextApiResponse } from 'next';
import { completedQuests } from '../data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('completedQuests2:', completedQuests);
  if (req.method === 'GET') {
    res.status(200).json({ completedQuests });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
