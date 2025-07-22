import { Contact } from "@prisma/client";
import { ContactResponse } from "../types/identity";

export function identityResponse(
  contacts: Contact[],
  primary: Contact
): ContactResponse {
  const emailSet = new Set<string>();
  const phoneNumberSet = new Set<string>();
  const secondaryContactIds: number[] = [];

  contacts.forEach((contact) => {
    if (contact.email) {
      emailSet.add(contact.email);
    }
    if (contact.phoneNumber) {
      phoneNumberSet.add(contact.phoneNumber);
    }
    if (contact.id !== primary?.id) {
      secondaryContactIds.push(contact.id);
    }
  });
  return {
    primaryContactId: primary.id,
    emails: [...emailSet],
    phoneNumbers: [...phoneNumberSet],
    secondaryContactIds,
  };
}
