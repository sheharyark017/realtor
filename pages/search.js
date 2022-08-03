import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';

import SearchFilters from '../components/SearchFilters';
import Property from '../components/property';
import noresult from '../assets/images/noresult.svg';
import { fetchApi, baseUrl } from '../utils/fetchApi';

const Search = ({ properties }) => {
  const [searchFilters, setSearchFilters] = useState(false);

  const router = useRouter();

  console.log(router);

  return (
    <Box>
      <Flex
        cursor="pointer"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
        p="2"
        fontWeight="black"
        fontSize="lg"
        justifyContent="center"
        alignItems="center"
        onClick={() => setSearchFilters((prevFilters) => !prevFilters)}
      >
        <Text>Search Property By Filters</Text>
        <Icon paddingLeft="2" w="7" as={BsFilter} />
      </Flex>
      {searchFilters && <SearchFilters />}
      <Text fontSize="2xl" p="4" fontWeight="bold">
        Property
        {router.query.purpose === '' && ''}
        {router.query.purpose === 'for-sale' && ' for Sale'}
        {router.query.purpose === 'for-rent' && ' for Rent'}
      </Text>
      <Flex flexWrap="wrap">
        {properties.map((property) => (
          <Property property={property} key={property.id} />
        ))}
      </Flex>
      {properties.length === 0 && (
        <Flex
          h="55vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          marginTop="5"
          marginBottom="5"
        >
          <Image src={noresult} alt="no result" />
          <Text fontSize="2xl" marginTop="5" fontWeight="medium">
            No Results Found
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Search;

export async function getServerSideProps({ query }) {
  const purpose = query.purpose || 'for-rent';
  const rentFrequency = query.rentFrequency || 'monthly';
  const minPrice = query.minPrice || '0';
  const maxPrice = query.maxPrice || '1000000';
  const roomsMin = query.roomsMin || '0';
  const bathsMin = query.bathsMin || '0';
  const sort = query.sort || 'price-desc';
  const areaMax = query.areaMax || '35000';
  const locationExternalIDs = query.locationExternalIDs || '5002';
  const categoryExternalID = query.categoryExternalID || '4';

  const data = await fetchApi(
    `${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`
  );

  return {
    props: {
      properties: data?.hits,
    },
  };
}
