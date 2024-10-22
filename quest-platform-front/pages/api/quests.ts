// pages/api/quests.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { completedQuests, addCompletedQuest } from '../data';

let quests: any = [];

// Initialize quests if not already initialized
if (quests.length === 0) {
  const startDate = new Date(2020, 0, 1);

  for (let i = 1; i <= 5000; i++) {
    const incrementalDate = new Date(startDate.getTime() + i * 100000000);
    quests.push({ 
      id: i, 
      title: `Quest ${i}`, 
      description: `Description ${i}`, 
      points: 10, 
      createdAt: incrementalDate.toISOString().split('T')[0],
      completed: false
    });
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = 1, limit = 10, search = '', sort = 'asc' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const sortAsc = sort === 'asc';

    let filteredQuests = quests.filter(quest => 
      quest.title.toLowerCase().includes((search as string).toLowerCase())
    );

    filteredQuests.sort((a, b) => {
      if (sortAsc) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedQuests = filteredQuests.slice(startIndex, endIndex);

    res.status(200).json({
      quests: paginatedQuests,
      totalPages: Math.ceil(filteredQuests.length / limitNumber),
      currentPage: pageNumber,
    });
  } else if (req.method === 'POST') {
    const { id } = req.body;
    const questIndex = quests.findIndex(quest => quest.id === id);
    if (questIndex > -1) {
      quests[questIndex].completed = true;
      const completedQuest = { ...quests[questIndex], completedAt: new Date().toISOString() };
      addCompletedQuest(completedQuest);
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Quest not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}