import { Box, Grid, GridItem, Image, Text, Button, Flex, Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";
import Link from 'next/link';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const fetchFeaturedQuests = async () => {
  const res = await fetch('/api/featured-quests');
  if (!res.ok) {
    throw new Error('Failed to fetch featured quests');
  }
  return res.json();
};

const FeaturedQuests = () => {
  const { data, error, isLoading, refetch } = useQuery('featuredQuests', fetchFeaturedQuests);

  if (isLoading) return <Flex justify="center" align="center" height="100vh"><Spinner size="xl" /></Flex>;
  if (error) return <Box color="red.500">Error loading featured quests</Box>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={4}>
        <Link href="/" passHref>
          <Button as="a" colorScheme="teal" variant="outline">Back to Home</Button>
        </Link>
        <Button onClick={() => refetch()} colorScheme="teal" variant="solid">Refresh</Button>
      </Flex>
      <Slider {...settings}>
        {data?.featuredQuests?.map((quest: any) => (
          <Box key={quest.id} p={4} boxShadow="md" borderRadius="md" overflow="hidden">
            <Image 
              src={quest.image} 
              alt={quest.title} 
              boxSize="100%" 
              objectFit="cover" 
              width="100%" 

            />
            <Box p={4}>
              <Text fontWeight="bold" fontSize="xl" mb={2}>{quest.title}</Text>
              <Text mb={2}>{quest.description}</Text>
              <Text color="teal.500" fontWeight="bold">{quest.points} Points</Text>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default FeaturedQuests;
