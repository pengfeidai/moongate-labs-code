// pages/table.tsx
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Spinner, Flex, Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import ReactPaginate from "react-paginate";
import Link from 'next/link';
import styles from '../styles/Table.module.css';

const fetchQuests = async (page: number, search: string, sort: string) => {
  const res = await fetch(`/api/quests?page=${page}&limit=20&search=${search}&sort=${sort}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const completeQuest = async (id: number) => {
  const res = await fetch('/api/quests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    throw new Error('Failed to complete quest');
  }
  return res.json();
};

const QuestTable = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery(['quests', page, search, sort], () => fetchQuests(page + 1, search, sort), {
    keepPreviousData: true,
  });

  const mutation = useMutation(completeQuest, {
    onMutate: async (id) => {
      await queryClient.cancelQueries(['quests', page, search, sort]);

      const previousData = queryClient.getQueryData(['quests', page, search, sort]);

      queryClient.setQueryData(['quests', page, search, sort], (oldData: any) => {
        return {
          ...oldData,
          quests: oldData.quests.map((quest: any) =>
            quest.id === id ? { ...quest, completed: true } : quest
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['quests', page, search, sort], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['quests', page, search, sort]);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60_000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Box color="red.500">Error loading data</Box>;

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const toggleSortOrder = () => {
    setSort(prev => {
      if (prev === 'asc') return 'desc';
      if (prev === 'desc') return 'default';
      return 'asc';
    });
  };

  return (
    <Box p={5} boxShadow="md" borderRadius="md" bg="white">
      <Flex justify="space-between" align="center" mb={4}>
        <Link href="/" passHref>
          <Button as="a" colorScheme="teal" variant="outline">Back to Home</Button>
        </Link>
        <Button onClick={() => refetch()} colorScheme="teal" variant="solid">Refresh</Button>
        <Input 
          placeholder="Search by title" 
          value={search} 
          onChange={handleSearchChange} 
          width="300px"
        />
      </Flex>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Points</Th>
            <Th onClick={toggleSortOrder} cursor="pointer">
              CreatedAt {sort === 'asc' ? '↑' : sort === 'desc' ? '↓' : ''}
            </Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.quests?.map((quest: any) => (
            <Tr key={quest.id}>
              <Td>{quest.id}</Td>
              <Td>{quest.title}</Td>
              <Td>{quest.description}</Td>
              <Td>{quest.points}</Td>
              <Td>{quest.createdAt}</Td>
              <Td>{quest.completed ? 'Completed' : 'Incomplete'}</Td>
              <Td>
                <Button 
                  colorScheme="blue" 
                  onClick={() => mutation.mutate(quest.id)}
                  isDisabled={quest.completed}
                >
                  Complete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="center" mt={4}>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={data?.totalPages || 1}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          disabledClassName={styles.disabled}
        />
      </Flex>
    </Box>
  );
};

export default QuestTable;
