import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavourite === 'boolean') {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactsQuery.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async ({ _id, userId }) => {
  return await ContactsCollection.findOne({ _id, userId });
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const updateContact = async ({contactId, userId}, payload, options = {}) => {
  const contactToUpdate = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId
     },
    payload,
    {
      new: true,
      ...options,
    },
  );

  if (!contactToUpdate) return null;
  return contactToUpdate;
};

export const deleteContact = async ({ contactId, userId }) => {
  return await ContactsCollection.findOneAndDelete({
      _id: contactId,
      userId
     });
};