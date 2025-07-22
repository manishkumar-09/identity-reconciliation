import { ContactResponse, IdentityInput } from "../types/identity";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { identityResponse } from "../utils/responseFormatter";

// const handleIndentity = async (req: Request, res: Response) => {
//   const { email, phoneNumber }: IdentityInput = req.body;

//   try {
//     if (!email || !phoneNumber) {
//       return res
//         .status(400)
//         .json({ error: "Email or phoneNumber is required" });
//     }

//     // 1. Get all matching contacts by email OR phoneNumber
//     const existingUsers = await prisma.contact.findMany({
//       where: {
//         OR: [
//           { email: email || undefined },
//           { phoneNumber: phoneNumber || undefined },
//         ],
//       },
//       orderBy: { createdAt: "asc" },
//     });

//     // 2. If no user exists, create a new primary
//     if (existingUsers.length === 0) {
//       const newContact = await prisma.contact.create({
//         data: {
//           email,
//           phoneNumber,
//           linkPrecedence: "primary",
//         },
//       });
//       return res.status(200).json(identityResponse([newContact], newContact));
//     }

//     // 3. Flatten all related contacts
//     const contactIds = new Set<number>();
//     const collectAllRelatedContacts = async (contacts: any[]) => {
//       for (const contact of contacts) {
//         contactIds.add(contact.id);
//         if (contact.linkedId) contactIds.add(contact.linkedId);
//       }
//     };
//     await collectAllRelatedContacts(existingUsers);

//     const allContacts = await prisma.contact.findMany({
//       where: {
//         OR: [
//           { id: { in: [...contactIds] } },
//           { linkedId: { in: [...contactIds] } },
//         ],
//       },
//       orderBy: { createdAt: "asc" },
//     });

//     // 4. Find the true primary (earliest primary by createdAt)
//     const primaryContact =
//       allContacts.find((c) => c.linkPrecedence === "primary") || allContacts[0];

//     // 5. Check if this exact match already exists
//     const isAlreadyLinked = allContacts.find(
//       (c) => c.email === email && c.phoneNumber === phoneNumber
//     );

//     // 6. If not, create as secondary pointing to true primary
//     if (!isAlreadyLinked) {
//       const newSecondary = await prisma.contact.create({
//         data: {
//           email,
//           phoneNumber,
//           linkPrecedence: "secondary",
//           linkedId: primaryContact.id,
//         },
//       });
//       allContacts.push(newSecondary);
//     }

//     return res.status(200).json(identityResponse(allContacts, primaryContact));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err,
//     });
//   }
// };

const handleIndentity = async (req: Request, res: Response) => {
  const { email, phoneNumber }: IdentityInput = req.body;
  try {
    if (!email || !phoneNumber) {
      return res.status(400).json("Email or Phone number is required");
    }

    //To find all existing contacts in ascending order
    const existingUsers = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    //If no match found in the existing user array
    if (existingUsers.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "primary",
        },
      });
      return res.status(200).json(identityResponse([newContact], newContact));
    }

    // Collect All Related Contacts

    const contactIds = new Set<number>();
    for (const contact of existingUsers) {
      contactIds.add(contact.id);
      if (contact.linkedId) {
        contactIds.add(contact.linkedId);
      }
    }
    // Fetch the Full Group
    const allContacts = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: [...contactIds] } },
          { linkedId: { in: [...contactIds] } },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    //find the  primary contact using createdAt
    const primaryContact =
      allContacts.find((c) => c.linkPrecedence === "primary") || allContacts[0];

    // if contact already exit with exact match
    const isAlreadyLinked = allContacts.find(
      (c) => c.email === email && c.phoneNumber === phoneNumber
    );

    // if not create as secondary contact
    if (!isAlreadyLinked) {
      const newSecondary = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: "secondary",
        },
      });
      allContacts.push(newSecondary);
    }
    return res.status(200).json(identityResponse(allContacts, primaryContact));
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error occured : ${err}`,
    });
  }
};
export { handleIndentity };
