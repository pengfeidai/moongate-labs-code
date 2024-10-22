// pages/history.tsx
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex, Text, Button } from "@chakra-ui/react";
import { useQuery } from "react-query";
import Link from 'next/link';

const fetchCompletedQuests = async () => {
  const res = await fetch('/api/completed-quests');
  if (!res.ok) {
    throw new Error('Failed to fetch completed quests');
  }
  return res.json();
};

const HistoryPage = () => {
  const { data, error, isLoading } = useQuery('completedQuests', fetchCompletedQuests);

  if (isLoading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Box color="red.500">Error loading completed quests</Box>;

  const totalPoints = data?.completedQuests?.reduce((sum: number, quest: any) => sum + quest.points, 0);

  return (
    <Box p={5} boxShadow="md" borderRadius="md" bg="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Link href="/" passHref>
          <Button as="a" colorScheme="teal" variant="outline">Back to Home</Button>
        </Link>
      </Flex>
      <Text fontSize="2xl" mb={4}>Completed Quests</Text>
      <Text fontSize="lg" mb={4}>Total Points: {totalPoints}</Text>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Points</Th>
            <Th>Completed At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.completedQuests?.map((quest: any) => (
            <Tr key={quest.id}>
              <Td>{quest.id}</Td>
              <Td>{quest.title}</Td>
              <Td>{quest.description}</Td>
              <Td>{quest.points}</Td>
              <Td>{quest.completedAt}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default HistoryPage;
