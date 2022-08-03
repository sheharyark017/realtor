import { useEffect, useState } from 'react';
import {
  Flex,
  Select,
  Box,
  Text,
  Input,
  Spinner,
  Icon,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';
import { fetchApi, baseUrl } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg';

import { filterData, getFilterValues } from '../utils/filterData';

const SearchFilters = () => {
  const [filters] = useState(filterData);
  const [showLocations, setShowLocations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState();

  const router = useRouter();

  const searchProperties = (filterValues) => {
    const path = router.pathname;
    const { query } = router;

    const values = getFilterValues(filterValues);

    values.forEach((item) => {
      if (item.value && filterValues?.[item.name]) {
        query[item.name] = item.value;
      }
    });

    router.push({ pathname: path, query });
  };

  useEffect(() => {
    if (searchTerm !== '') {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchApi(
          `${baseUrl}/auto-complete?query=${searchTerm}`
        );
        setLoading(false);
        setLocationData(data?.hits);
      };

      fetchData();
    }
  }, [searchTerm]);

  return (
    <Flex flexWrap="wrap" justifyContent="center" bg="gray.100" p="4">
      {filters.map((filter) => (
        <Box key={filter.queryName}>
          <Select
            placeholder={filter.placeholder}
            w="fit-content"
            borderColor="gray.300"
            p="2"
            onChange={(e) => {
              searchProperties({ [filter.queryName]: e.target.value });
            }}
          >
            {filter?.items?.map((item) => (
              <option value={item.value} key={item.value}>
                {item.name}
              </option>
            ))}
          </Select>
        </Box>
      ))}
      <Flex flexDirection="column">
        <Button
          onClick={() => setShowLocations(!showLocations)}
          border="1px"
          borderColor="gray.300"
          marginTop="2"
        >
          Search Location
        </Button>
        {showLocations && (
          <Flex flexDir="column" pos="relative" paddingTop="2">
            <Input
              border="1px"
              borderColor="gray.300"
              placeholder="Type Here"
              minWidth="300px"
              width="100%"
              focusBorderColor="blue.400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm !== '' && (
              <Icon
                as={MdCancel}
                pos="absolute"
                cursor="pointer"
                right="2"
                top="5"
                zIndex="100"
                onClick={() => setSearchTerm('')}
              />
            )}
            {loading && <Spinner margin="auto" marginTop="3" />}
            {showLocations && (
              <Box height="300px" overflow="auto">
                {locationData?.map((location) => (
                  <Box
                    key={location.id}
                    onClick={() => {
                      searchProperties({
                        locationExternalIDs: location.externalID,
                      });
                      setShowLocations(false);
                      setSearchTerm(location.name);
                    }}
                  >
                    <Text
                      cursor="pointer"
                      bg="gray.200"
                      p="2"
                      borderBottom="1px"
                      borderColor="gray.100"
                    >
                      {location.name}
                    </Text>
                  </Box>
                ))}
                {!loading && !locationData?.length && (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    flexDir="column"
                    marginTop="5"
                    marginBottom="5"
                  >
                    <Image src={noresult} alt="no result" />
                    <Text fontSize="xl" marginTop="3">
                      Waiting to search!
                    </Text>
                  </Flex>
                )}
              </Box>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default SearchFilters;
