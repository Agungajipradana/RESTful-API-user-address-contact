import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createContactValidation, getContactValidation, updateContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

// Create contact service
const create = async (user, request) => {
  const contact = validate(createContactValidation, request);
  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

// Get contact service
const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  // mengambil data dari database
  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  // untuk mengecek jika contact tidak ada throw error "contact is not found"
  if (!contact) {
    throw new ResponseError(404, "contact is not found");
  }

  return contact;
};

// Update contact service
const update = async (user, request) => {
  const contact = validate(updateContactValidation, request);

  // mengambil data dari database
  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact.id,
    },
  });

  // mengecek data contact dari database apakah !== 1
  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

// Remove contact service
const remove = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  // mengambil data dari database
  const totalInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  // mengecek data contact dari database apakah !== 1
  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return prismaClient.contact.delete({
    where: {
      id: contactId,
    },
  });
};

export default { create, get, update, remove };
