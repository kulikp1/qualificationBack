const parseSortOrder = (sortOrder) => {
  if (['asc', 'desc'].includes(sortOrder)) return sortOrder;
  return 'asc';
};

const parseSortBy = (sortBy) => {
  const keys = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
  ];

  if (keys.includes(sortBy)) return sortBy;

  return '_id';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};