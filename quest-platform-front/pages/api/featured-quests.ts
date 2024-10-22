// pages/api/featured-quests.ts
import { NextApiRequest, NextApiResponse } from 'next';

const featuredQuests = [
  {
    id: 1,
    title: "Featured Quest 1",
    description: "Complete the first quest",
    points: 100,
    image: "/images/aquarius.jpg",
  },
  {
    id: 2,
    title: "Featured Quest 2",
    description: "Complete the second quest",
    points: 150,
    image: "/images/aries.jpg",
  },
  {
    id: 3,
    title: "Featured Quest 3",
    description: "Complete the third quest",
    points: 200,
    image: "/images/gemini.jpg",
  },
  {
    id: 4,
    title: "Featured Quest 4",
    description: "Complete the four quest",
    points: 250,
    image: "/images/pisces.jpg",
  },
  {
    id: 5,
    title: "Featured Quest 5",
    description: "Complete the five quest",
    points: 200,
    image: "/images/scorpio.jpg",
  },
  {
    id: 6,
    title: "Featured Quest 6",
    description: "Complete the six quest",
    points: 300,
    image: "/images/virgo.jpg",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ featuredQuests });
}
